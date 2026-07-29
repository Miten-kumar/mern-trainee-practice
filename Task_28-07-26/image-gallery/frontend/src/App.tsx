import { useEffect, useState } from 'react';
import { fetchImages } from './services/imagesApi';
import { GalleryImage } from './types';
import { GalleryGrid } from './components/GalleryGrid';
import { Lightbox } from './components/Lightbox';
import { ClsPanel } from './components/ClsPanel';

export default function App() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [reserveSpace, setReserveSpace] = useState(true);

  useEffect(() => {
    fetchImages()
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-shell">
      <h1>Gallery</h1>

      <ClsPanel reserveSpace={reserveSpace} onToggleReserveSpace={() => setReserveSpace((v) => !v)} />

      {loading && <p className="hint">Loading images...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <GalleryGrid images={images} reserveSpace={reserveSpace} onSelect={setLightboxIndex} />
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
