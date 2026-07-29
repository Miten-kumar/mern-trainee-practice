import { GalleryImage } from '../types';

const API_URL = 'http://localhost:4000';

export async function fetchImages(): Promise<GalleryImage[]> {
  const res = await fetch(`${API_URL}/api/images`);
  if (!res.ok) {
    throw new Error(`Failed to load images (status ${res.status})`);
  }
  const data = await res.json();
  return data.images;
}
