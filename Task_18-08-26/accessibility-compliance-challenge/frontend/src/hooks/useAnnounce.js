import { useContext } from 'react';
import { AnnouncerContext } from '../context/AnnouncerContext.jsx';

export function useAnnounce() {
  return useContext(AnnouncerContext);
}
