const express = require('express');
const store = require('../../data/tasks');
const { validateTask } = require('../../validators/taskValidator');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { taskLinks, collectionLinks } = require('../../utils/hateoas');
const { parsePagination, paginate } = require('../../utils/pagination');

const router = express.Router();

function baseUrl(req) {
  return `${req.protocol}://${req.get('host')}`;
}

function serializeTask(task, req) {
  return { ...task, _links: taskLinks(task, baseUrl(req)) };
}

router.get('/', (req, res) => {
  const { page, limit } = parsePagination(req.query);
  let items = store.getAll();

  if (req.query.status) {
    items = items.filter((t) => t.status === req.query.status);
  }

  const { pageItems, totalItems, totalPages } = paginate(items, page, limit);

  res.json({
    _embedded: { tasks: pageItems.map((t) => serializeTask(t, req)) },
    _links: collectionLinks(baseUrl(req), page, limit, totalPages),
    page,
    limit,
    totalItems,
    totalPages,
  });
});

router.get('/:id', (req, res, next) => {
  const task = store.getById(Number(req.params.id));
  if (!task) return next(new NotFoundError(`Task ${req.params.id} was not found`, req.originalUrl));

  res.json(serializeTask(task, req));
});

router.post('/', (req, res, next) => {
  const errors = validateTask(req.body, { partial: false });
  if (errors.length > 0) return next(new ValidationError(errors, req.originalUrl));

  const task = store.create(req.body);
  res
    .status(201)
    .location(`${baseUrl(req)}/api/v2/tasks/${task.id}`)
    .json(serializeTask(task, req));
});

router.put('/:id', (req, res, next) => {
  const existing = store.getById(Number(req.params.id));
  if (!existing) return next(new NotFoundError(`Task ${req.params.id} was not found`, req.originalUrl));

  const errors = validateTask(req.body, { partial: false });
  if (errors.length > 0) return next(new ValidationError(errors, req.originalUrl));

  const task = store.update(Number(req.params.id), req.body);
  res.json(serializeTask(task, req));
});

router.patch('/:id', (req, res, next) => {
  const existing = store.getById(Number(req.params.id));
  if (!existing) return next(new NotFoundError(`Task ${req.params.id} was not found`, req.originalUrl));

  const errors = validateTask(req.body, { partial: true });
  if (errors.length > 0) return next(new ValidationError(errors, req.originalUrl));

  const task = store.patch(Number(req.params.id), req.body);
  res.json(serializeTask(task, req));
});

router.delete('/:id', (req, res, next) => {
  const removed = store.remove(Number(req.params.id));
  if (!removed) return next(new NotFoundError(`Task ${req.params.id} was not found`, req.originalUrl));

  res.status(204).send();
});

module.exports = router;
