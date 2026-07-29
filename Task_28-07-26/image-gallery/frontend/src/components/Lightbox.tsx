import { useEffect } from 'react';
import { GalleryImage } from '../types';
import { buildSrcSet } from '../utils/buildImageUrls';
import { getNextIndex, getPrevIndex } from '../utils/lightboxNav';

interface Props {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: Props) {
  const image = images[currentIndex];

  // lock page scroll while the lightbox is open, restore it on close
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(getNextIndex(currentIndex, images.length));
      if (e.key === 'ArrowLeft') onNavigate(getPrevIndex(currentIndex, images.length));
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);

  if (!image) return null;

  const jpgSrcSet = buildSrcSet(image.picsumId, image.width, image.height, 'jpg');
  const webpSrcSet = buildSrcSet(image.picsumId, image.width, image.height, 'webp');
  const fallbackSrc = jpgSrcSet.split(',').pop()!.trim().split(' ')[0];

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={image.alt}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <button
          className="lightbox-nav lightbox-prev"
          onClick={() => onNavigate(getPrevIndex(currentIndex, images.length))}
          aria-label="Previous image"
        >
          ‹
        </button>

        <picture>
          <source type="image/webp" srcSet={webpSrcSet} sizes="90vw" />
          <img src={fallbackSrc} srcSet={jpgSrcSet} sizes="90vw" alt={image.alt} className="lightbox-image" />
        </picture>

        <button
          className="lightbox-nav lightbox-next"
          onClick={() => onNavigate(getNextIndex(currentIndex, images.length))}
          aria-label="Next image"
        >
          ›
        </button>

        <p className="lightbox-caption">
          {image.alt} ({currentIndex + 1} / {images.length})
        </p>
      </div>
    </div>
  );
}
