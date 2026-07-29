import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchItems } from './searchApi';

describe('searchItems', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls the search endpoint with the encoded query', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const controller = new AbortController();
    await searchItems('type script', controller.signal);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/search?q=type%20script',
      expect.objectContaining({ signal: controller.signal })
    );
  });

  it('returns the results array from the response', async () => {
    const fakeResults = [{ id: 1, name: 'TypeScript', category: 'Language' }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: fakeResults }),
    });

    const controller = new AbortController();
    const results = await searchItems('type', controller.signal);
    expect(results).toEqual(fakeResults);
  });

  it('throws when the response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });

    const controller = new AbortController();
    await expect(searchItems('type', controller.signal)).rejects.toThrow('Search failed with status 500');
  });

  it('propagates an AbortError if the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    global.fetch = vi.fn().mockImplementation((_url, options) => {
      if (options.signal.aborted) {
        return Promise.reject(new DOMException('Aborted', 'AbortError'));
      }
      return Promise.resolve({ ok: true, json: async () => ({ results: [] }) });
    });

    await expect(searchItems('type', controller.signal)).rejects.toThrow('Aborted');
  });
});
