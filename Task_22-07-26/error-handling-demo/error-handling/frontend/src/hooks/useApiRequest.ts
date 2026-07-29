import { useCallback, useEffect, useState } from 'react';
import { fetchWithRetry } from '../services/apiClient';
import { errorLogger } from '../services/errorLogger';
import { AppError } from '../errors';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

// generic data-fetching hook used by each widget. Keeps the retry
// button and error state logic in one place instead of repeating it
// in every widget component.
export function useApiRequest<T>(url: string) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await fetchWithRetry(url);
      setState({ data, loading: false, error: null });
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError(String(err), 'unknown');
      errorLogger.logError(appError, { level: 'section' });
      setState({ data: null, loading: false, error: appError });
    }
  }, [url]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, retry };
}
