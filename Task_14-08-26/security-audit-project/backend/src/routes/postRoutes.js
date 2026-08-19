const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const { requireAuth, requireOwnershipOrAdmin } = require('../middleware/auth');
const { doubleCsrfProtection } = require('../middleware/csrfProtection');
const {
  handleValidation,
  postRules,
  commentRules,
  idParamRule,
} = require('../middleware/validators');

router.get('/', postController.list);
router.get('/search', postController.search);
router.get('/:id', idParamRule, handleValidation, postController.getOne);

router.post(
  '/',
  requireAuth,
  doubleCsrfProtection,
  postRules,
  handleValidation,
  postController.create
);

router.delete(
  '/:id',
  requireAuth,
  doubleCsrfProtection,
  idParamRule,
  handleValidation,
  requireOwnershipOrAdmin(postController.getPostOwnerId),
  postController.remove
);

router.post(
  '/:id/comments',
  requireAuth,
  doubleCsrfProtection,
  idParamRule,
  commentRules,
  handleValidation,
  postController.addComment
);

module.exports = router;
