import { NetworkError, ApiError } from '../errors';

const DEFAULT_RETRIES = 3;
const BASE_DELAY_MS = 500;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FetchOptions extends RequestInit {
  retries?: number;
}

// wraps fetch so callers get proper NetworkError/ApiError instances
// instead of having to check response.ok everywhere, and retries
// automatically when it makes sense to.
export async function fetchWithRetry(url: string, options: FetchOptions = {}) {
  const { retries = DEFAULT_RETRIES, ...fetchOptions } = options;

  let attempt = 0;

  while (true) {
    try {
      let response: Response;
      try {
        response = await fetch(url, fetchOptions);
      } catch (err) {
        // fetch throws (not a rejected status) when the network itself
        // failed - no connection, DNS failure, CORS blocked, etc.
        throw new NetworkError();
      }

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        try {
          const body = await response.json();
          if (body?.message) message = body.message;
        } catch {
          // response wasn't json, just use the default message
        }
        throw new ApiError(message, response.status);
      }

      return await response.json();
    } catch (error) {
      const canRetry =
        attempt < retries &&
        (error instanceof NetworkError || (error instanceof ApiError && error.isRetryable));

      if (!canRetry) {
        throw error;
      }

      // exponential backoff: 500ms, 1000ms, 2000ms...
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      await wait(delay);
      attempt++;
    }
  }
}
