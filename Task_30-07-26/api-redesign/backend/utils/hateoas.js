// HATEOAS = the response tells you what you can do next, instead of
// the client having to hardcode urls/methods it "just knows" about.
// loosely inspired by HAL, not a strict implementation of it.

function taskLinks(task, baseUrl) {
  const taskUrl = `${baseUrl}/api/v2/tasks/${task.id}`;
  return {
    self: { href: taskUrl, method: 'GET' },
    update: { href: taskUrl, method: 'PUT' },
    patch: { href: taskUrl, method: 'PATCH' },
    delete: { href: taskUrl, method: 'DELETE' },
    collection: { href: `${baseUrl}/api/v2/tasks`, method: 'GET' },
  };
}

function collectionLinks(baseUrl, page, limit, totalPages) {
  const url = (p) => `${baseUrl}/api/v2/tasks?page=${p}&limit=${limit}`;

  const links = {
    self: { href: url(page), method: 'GET' },
    first: { href: url(1), method: 'GET' },
    last: { href: url(totalPages), method: 'GET' },
  };

  if (page > 1) links.prev = { href: url(page - 1), method: 'GET' };
  if (page < totalPages) links.next = { href: url(page + 1), method: 'GET' };

  return links;
}

module.exports = { taskLinks, collectionLinks };
