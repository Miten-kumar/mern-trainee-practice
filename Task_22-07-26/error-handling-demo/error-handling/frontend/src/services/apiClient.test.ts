import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWithRetry } from './apiClient';
import { NetworkError, ApiError } from '../errors';

function mockResponse(ok: boolean, status: number, body: unknown) {
  return { ok, status, json: async () => body } as Response;
}

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed json on a successful response', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockResponse(true, 200, { hello: 'world' }));

    const result = await fetchWithRetry('http://test/ok');
    expect(result).toEqual({ hello: 'world' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('throws NetworkError and retries when fetch itself rejects', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('failed to fetch'));

    await expect(fetchWithRetry('http://test/down', { retries: 1 })).rejects.toBeInstanceOf(NetworkError);
    // 1 initial attempt + 1 retry = 2 calls
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry a 404 (not retryable), fails fast', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockResponse(false, 404, { message: 'not found' }));

    await expect(fetchWithRetry('http://test/missing', { retries: 3 })).rejects.toBeInstanceOf(ApiError);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries a 503 up to the retry limit then throws ApiError', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockResponse(false, 503, { message: 'unavailable' }));

    await expect(fetchWithRetry('http://test/flaky', { retries: 1 })).rejects.toBeInstanceOf(ApiError);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('succeeds if a later retry attempt works', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(false, 503, { message: 'unavailable' }))
      .mockResolvedValueOnce(mockResponse(true, 200, { ok: true }));

    const result = await fetchWithRetry('http://test/flaky', { retries: 2 });
    expect(result).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
