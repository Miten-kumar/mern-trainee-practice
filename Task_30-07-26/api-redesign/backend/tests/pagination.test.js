const { parsePagination, paginate } = require('../utils/pagination');

describe('parsePagination', () => {
  it('defaults to page 1, limit 10 when nothing is given', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10 });
  });

  it('parses valid page and limit from query params', () => {
    expect(parsePagination({ page: '3', limit: '25' })).toEqual({ page: 3, limit: 25 });
  });

  it('clamps a page below 1 up to 1', () => {
    expect(parsePagination({ page: '-5' })).toEqual({ page: 1, limit: 10 });
  });

  it('clamps a limit above the max down to the max', () => {
    expect(parsePagination({ limit: '9999' })).toEqual({ page: 1, limit: 50 });
  });

  it('falls back to defaults for garbage input', () => {
    expect(parsePagination({ page: 'abc', limit: 'xyz' })).toEqual({ page: 1, limit: 10 });
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it('returns the correct slice for a given page/limit', () => {
    const { pageItems } = paginate(items, 2, 10);
    expect(pageItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('calculates totalItems and totalPages correctly', () => {
    const { totalItems, totalPages } = paginate(items, 1, 10);
    expect(totalItems).toBe(25);
    expect(totalPages).toBe(3);
  });

  it('returns an empty page past the last page', () => {
    const { pageItems } = paginate(items, 10, 10);
    expect(pageItems).toEqual([]);
  });

  it('handles an empty list without dividing by zero weirdness', () => {
    const { pageItems, totalPages } = paginate([], 1, 10);
    expect(pageItems).toEqual([]);
    expect(totalPages).toBe(1);
  });
});
