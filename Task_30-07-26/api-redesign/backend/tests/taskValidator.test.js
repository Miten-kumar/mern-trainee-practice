const { validateTask } = require('../validators/taskValidator');

describe('validateTask - full validation (POST/PUT)', () => {
  it('passes with a valid task', () => {
    const errors = validateTask({ title: 'Do the thing', status: 'pending', priority: 'low' });
    expect(errors).toEqual([]);
  });

  it('requires a title', () => {
    const errors = validateTask({});
    expect(errors.some((e) => e.field === 'title')).toBe(true);
  });

  it('rejects an empty/whitespace-only title', () => {
    const errors = validateTask({ title: '   ' });
    expect(errors.some((e) => e.field === 'title')).toBe(true);
  });

  it('rejects a title over 200 characters', () => {
    const errors = validateTask({ title: 'a'.repeat(201) });
    expect(errors.some((e) => e.field === 'title')).toBe(true);
  });

  it('rejects an invalid status', () => {
    const errors = validateTask({ title: 'ok', status: 'not-a-real-status' });
    expect(errors.some((e) => e.field === 'status')).toBe(true);
  });

  it('rejects an invalid priority', () => {
    const errors = validateTask({ title: 'ok', priority: 'urgent' });
    expect(errors.some((e) => e.field === 'priority')).toBe(true);
  });

  it('rejects a dueDate that is not a valid date', () => {
    const errors = validateTask({ title: 'ok', dueDate: 'not-a-date' });
    expect(errors.some((e) => e.field === 'dueDate')).toBe(true);
  });

  it('allows a null dueDate', () => {
    const errors = validateTask({ title: 'ok', dueDate: null });
    expect(errors).toEqual([]);
  });
});

describe('validateTask - partial validation (PATCH)', () => {
  it('does not require title when title is not being changed', () => {
    const errors = validateTask({ status: 'completed' }, { partial: true });
    expect(errors).toEqual([]);
  });

  it('still validates title if it IS included', () => {
    const errors = validateTask({ title: '' }, { partial: true });
    expect(errors.some((e) => e.field === 'title')).toBe(true);
  });

  it('still validates status if it IS included', () => {
    const errors = validateTask({ status: 'bogus' }, { partial: true });
    expect(errors.some((e) => e.field === 'status')).toBe(true);
  });
});
