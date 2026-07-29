import { describe, it, expect } from 'vitest';
import {
  scaledHeight,
  buildJpgUrl,
  buildWebpUrl,
  buildPlaceholderUrl,
  buildSrcSet,
  RESPONSIVE_WIDTHS,
  PLACEHOLDER_WIDTH,
} from './buildImageUrls';

describe('scaledHeight', () => {
  it('keeps the aspect ratio when scaling down', () => {
    // a 1000x500 (2:1) image scaled to width 320 should be height 160
    expect(scaledHeight(320, 1000, 500)).toBe(160);
  });

  it('handles a square image', () => {
    expect(scaledHeight(320, 800, 800)).toBe(320);
  });
});

describe('buildJpgUrl / buildWebpUrl', () => {
  it('builds a picsum url with the given id and dimensions', () => {
    expect(buildJpgUrl(42, 320, 200)).toBe('https://picsum.photos/id/42/320/200');
  });

  it('adds a .webp suffix for the webp version', () => {
    expect(buildWebpUrl(42, 320, 200)).toBe('https://picsum.photos/id/42/320/200.webp');
  });
});

describe('buildPlaceholderUrl', () => {
  it('uses the small placeholder width, scaled to keep aspect ratio', () => {
    const url = buildPlaceholderUrl(10, 1000, 500);
    const expectedHeight = scaledHeight(PLACEHOLDER_WIDTH, 1000, 500);
    expect(url).toBe(`https://picsum.photos/id/10/${PLACEHOLDER_WIDTH}/${expectedHeight}`);
  });
});

describe('buildSrcSet', () => {
  it('includes one entry per responsive width', () => {
    const srcSet = buildSrcSet(10, 1000, 500, 'jpg');
    const entries = srcSet.split(', ');
    expect(entries.length).toBe(RESPONSIVE_WIDTHS.length);
  });

  it('labels each entry with its width descriptor', () => {
    const srcSet = buildSrcSet(10, 1000, 500, 'jpg');
    RESPONSIVE_WIDTHS.forEach((width) => {
      expect(srcSet).toContain(`${width}w`);
    });
  });

  it('uses webp urls when format is webp', () => {
    const srcSet = buildSrcSet(10, 1000, 500, 'webp');
    expect(srcSet).toContain('.webp');
  });

  it('does not include .webp when format is jpg', () => {
    const srcSet = buildSrcSet(10, 1000, 500, 'jpg');
    expect(srcSet).not.toContain('.webp');
  });
});
