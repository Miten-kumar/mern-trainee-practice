import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorLogger, getStats, subscribeToStats } from './errorLogger';
import { NetworkError, ApiError } from '../errors';

describe('errorLogger', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  });

  it('increments the session stats for the error type', () => {
    const before = getStats().network || 0;
    errorLogger.logError(new NetworkError());
    expect(getStats().network).toBe(before + 1);
  });

  it('notifies subscribers when a new error is logged', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToStats(listener);

    errorLogger.logError(new ApiError('failed', 500));
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it('stops notifying a listener after it unsubscribes', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToStats(listener);
    unsubscribe();

    errorLogger.logError(new NetworkError());
    expect(listener).not.toHaveBeenCalled();
  });

  it('sends the error to the backend logging endpoint', () => {
    errorLogger.logError(new ApiError('failed', 500));

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/errors',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('does not throw if the backend request itself fails', () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));
    expect(() => errorLogger.logError(new NetworkError())).not.toThrow();
  });
});
