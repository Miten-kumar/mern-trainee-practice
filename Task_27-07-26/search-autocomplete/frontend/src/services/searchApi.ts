import { SearchResult } from '../types';

const API_URL = 'http://localhost:4000';

// takes an AbortSignal so the caller can cancel this specific request
// if a newer search starts before this one finishes
export async function searchItems(query: string, signal: AbortSignal): Promise<SearchResult[]> {
  const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`, { signal });

  if (!res.ok) {
    throw new Error(`Search failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.results;
}
