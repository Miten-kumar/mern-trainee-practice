import { describe, it, expect } from 'vitest';
import { getNextIndex, getPrevIndex } from './lightboxNav';

describe('getNextIndex', () => {
  it('moves to the next index normally', () => {
    expect(getNextIndex(0, 5)).toBe(1);
    expect(getNextIndex(3, 5)).toBe(4);
  });

  it('wraps back to 0 after the last item', () => {
    expect(getNextIndex(4, 5)).toBe(0);
  });
});

describe('getPrevIndex', () => {
  it('moves to the previous index normally', () => {
    expect(getPrevIndex(3, 5)).toBe(2);
  });

  it('wraps to the last item when going back from 0', () => {
    expect(getPrevIndex(0, 5)).toBe(4);
  });
});
