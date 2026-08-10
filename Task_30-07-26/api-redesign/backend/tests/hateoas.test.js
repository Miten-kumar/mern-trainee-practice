const { taskLinks, collectionLinks } = require('../utils/hateoas');

describe('taskLinks', () => {
  const task = { id: 5 };
  const base = 'http://localhost:4000';

  it('builds all 5 links pointing at the right task id', () => {
    const links = taskLinks(task, base);
    expect(links.self).toEqual({ href: 'http://localhost:4000/api/v2/tasks/5', method: 'GET' });
    expect(links.update).toEqual({ href: 'http://localhost:4000/api/v2/tasks/5', method: 'PUT' });
    expect(links.patch).toEqual({ href: 'http://localhost:4000/api/v2/tasks/5', method: 'PATCH' });
    expect(links.delete).toEqual({ href: 'http://localhost:4000/api/v2/tasks/5', method: 'DELETE' });
    expect(links.collection).toEqual({ href: 'http://localhost:4000/api/v2/tasks', method: 'GET' });
  });
});

describe('collectionLinks', () => {
  const base = 'http://localhost:4000';

  it('has no "prev" link on the first page', () => {
    const links = collectionLinks(base, 1, 10, 3);
    expect(links.prev).toBeUndefined();
    expect(links.next).toBeDefined();
  });

  it('has no "next" link on the last page', () => {
    const links = collectionLinks(base, 3, 10, 3);
    expect(links.next).toBeUndefined();
    expect(links.prev).toBeDefined();
  });

  it('has both prev and next on a middle page', () => {
    const links = collectionLinks(base, 2, 10, 3);
    expect(links.prev).toBeDefined();
    expect(links.next).toBeDefined();
  });

  it('always includes self, first, and last', () => {
    const links = collectionLinks(base, 2, 10, 3);
    expect(links.self.href).toContain('page=2');
    expect(links.first.href).toContain('page=1');
    expect(links.last.href).toContain('page=3');
  });
});
