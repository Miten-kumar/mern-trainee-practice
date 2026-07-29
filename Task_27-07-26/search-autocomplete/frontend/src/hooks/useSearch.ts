import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import { searchItems } from '../services/searchApi';
import { SearchResult } from '../types';

const DEBOUNCE_MS = 200;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  // cache previous results per search term so re-typing something
  // already searched shows instantly, no loading state at all
  const cacheRef = useRef(new Map<string, SearchResult[]>());
  // keeps track of the in-flight request so we can cancel it if a
  // newer search kicks off before it finishes
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      abortControllerRef.current?.abort();
      setResults([]);
      setLoading(false);
      setError(null);
      setHasSearched(false);
      return;
    }

    const cacheKey = trimmed.toLowerCase();
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setResults(cached);
      setLoading(false);
      setError(null);
      setHasSearched(true);
      return;
    }

    // cancel whatever request was still running for the previous query,
    // its response would be stale by the time it arrives anyway
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    // note: we deliberately don't clear `results` here, the old list
    // stays on screen (with the loading spinner next to it) instead of
    // flashing to empty, that's what keeps this feeling fast
    searchItems(trimmed, controller.signal)
      .then((data) => {
        cacheRef.current.set(cacheKey, data);
        setResults(data);
        setLoading(false);
        setHasSearched(true);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // a newer search replaced this one, ignore
        setError('Something went wrong, please try again.');
        setLoading(false);
      });
  }, [debouncedQuery]);

  // is the debounce timer still waiting to fire? used to show a subtle
  // "about to search" hint before the actual network request even starts
  const isPending = query.trim() !== debouncedQuery.trim();

  return { query, setQuery, results, loading, error, hasSearched, isPending };
}
