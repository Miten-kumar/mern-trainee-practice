import { describe, it, expect } from 'vitest';
import { highlightMatch } from './highlightMatch';

describe('highlightMatch', () => {
  it('returns the whole text as one segment when query is empty', () => {
    const result = highlightMatch('JavaScript', '');
    expect(result).toEqual([{ text: 'JavaScript', highlighted: false }]);
  });

  it('returns the whole text as one segment when there is no match', () => {
    const result = highlightMatch('JavaScript', 'xyz');
    expect(result).toEqual([{ text: 'JavaScript', highlighted: false }]);
  });

  it('highlights a match at the start of the text', () => {
    const result = highlightMatch('JavaScript', 'Java');
    expect(result).toEqual([
      { text: 'Java', highlighted: true },
      { text: 'Script', highlighted: false },
    ]);
  });

  it('highlights a match in the middle of the text', () => {
    const result = highlightMatch('TypeScript', 'Script');
    expect(result).toEqual([
      { text: 'Type', highlighted: false },
      { text: 'Script', highlighted: true },
    ]);
  });

  it('is case insensitive but preserves the original casing in the output', () => {
    const result = highlightMatch('JavaScript', 'javascript');
    expect(result).toEqual([{ text: 'JavaScript', highlighted: true }]);
  });

  it('only highlights the first match if the substring appears twice', () => {
    const result = highlightMatch('banana', 'an');
    expect(result).toEqual([
      { text: 'b', highlighted: false },
      { text: 'an', highlighted: true },
      { text: 'ana', highlighted: false },
    ]);
  });
});
