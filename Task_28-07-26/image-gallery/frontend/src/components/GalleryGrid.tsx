import { GalleryImage } from '../types';
import { GalleryItem } from './GalleryItem';

interface Props {
  images: GalleryImage[];
  reserveSpace: boolean;
  onSelect: (index: number) => void;
}

export function GalleryGrid({ images, reserveSpace, onSelect }: Props) {
  return (
    <div className="gallery-grid">
      {images.map((image, index) => (
        <GalleryItem key={image.id} image={image} reserveSpace={reserveSpace} onClick={() => onSelect(index)} />
      ))}
    </div>
  );
}
