import { useState } from 'react';
import { GalleryImage } from '../types';
import { useInView } from '../hooks/useInView';
import { buildPlaceholderUrl, buildSrcSet } from '../utils/buildImageUrls';

interface Props {
  image: GalleryImage;
  reserveSpace: boolean;
  onClick: () => void;
}

export function GalleryItem({ image, reserveSpace, onClick }: Props) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  const [loaded, setLoaded] = useState(false);

  const placeholderUrl = buildPlaceholderUrl(image.picsumId, image.width, image.height);
  const jpgSrcSet = buildSrcSet(image.picsumId, image.width, image.height, 'jpg');
  const webpSrcSet = buildSrcSet(image.picsumId, image.width, image.height, 'webp');
  const fallbackSrc = jpgSrcSet.split(',')[0].trim().split(' ')[0];
  const aspectRatio = image.width / image.height;

  return (
    <button
      ref={ref}
      type="button"
      className="gallery-item"
      style={reserveSpace ? { aspectRatio: String(aspectRatio) } : undefined}
      onClick={onClick}
      aria-label={`Open ${image.alt} in lightbox`}
    >
      {/* tiny blurred placeholder, loads immediately (it's only 24px
          wide so barely costs anything), fades out once the real
          image is ready */}
      <img
        src={placeholderUrl}
        alt=""
        aria-hidden="true"
        className="gallery-placeholder"
        style={{ opacity: loaded ? 0 : 1, backgroundColor: image.dominantColor }}
      />

      {/* the real image only starts loading once this item is close
          to the viewport - that's the actual lazy loading here,
          loading="lazy" on top of that is just a browser-level backup */}
      {inView && (
        <picture>
          <source type="image/webp" srcSet={webpSrcSet} sizes="(min-width: 900px) 25vw, 50vw" />
          <img
            src={fallbackSrc}
            srcSet={jpgSrcSet}
            sizes="(min-width: 900px) 25vw, 50vw"
            alt={image.alt}
            loading="lazy"
            className="gallery-full"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
          />
        </picture>
      )}
    </button>
  );
}
