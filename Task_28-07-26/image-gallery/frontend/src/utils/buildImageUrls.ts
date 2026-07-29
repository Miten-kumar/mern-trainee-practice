// the widths we generate srcset entries for - the browser picks
// whichever one best matches the actual rendered size + device pixel
// ratio, so we're not always shipping the largest image
export const RESPONSIVE_WIDTHS = [320, 640, 960, 1280];

// tiny version used for the blur-up placeholder, small enough to load
// almost instantly even on a slow connection
export const PLACEHOLDER_WIDTH = 24;

// keeps the aspect ratio of the original photo when we ask picsum for
// a resized version, otherwise the image would get stretched/cropped
export function scaledHeight(targetWidth: number, naturalWidth: number, naturalHeight: number): number {
  return Math.round((targetWidth / naturalWidth) * naturalHeight);
}

export function buildJpgUrl(picsumId: number, width: number, height: number): string {
  return `https://picsum.photos/id/${picsumId}/${width}/${height}`;
}

export function buildWebpUrl(picsumId: number, width: number, height: number): string {
  return `https://picsum.photos/id/${picsumId}/${width}/${height}.webp`;
}

export function buildPlaceholderUrl(picsumId: number, naturalWidth: number, naturalHeight: number): string {
  const height = scaledHeight(PLACEHOLDER_WIDTH, naturalWidth, naturalHeight);
  return buildJpgUrl(picsumId, PLACEHOLDER_WIDTH, height);
}

// builds a srcset string like "url1 320w, url2 640w, url3 960w"
export function buildSrcSet(
  picsumId: number,
  naturalWidth: number,
  naturalHeight: number,
  format: 'jpg' | 'webp'
): string {
  return RESPONSIVE_WIDTHS.map((width) => {
    const height = scaledHeight(width, naturalWidth, naturalHeight);
    const url = format === 'webp' ? buildWebpUrl(picsumId, width, height) : buildJpgUrl(picsumId, width, height);
    return `${url} ${width}w`;
  }).join(', ');
}
