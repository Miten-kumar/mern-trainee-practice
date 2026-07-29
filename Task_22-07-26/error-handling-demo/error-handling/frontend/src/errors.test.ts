import { describe, it, expect } from 'vitest';
import { AppError, NetworkError, ApiError, RuntimeError } from './errors';

describe('custom error classes', () => {
  it('NetworkError is an AppError with type network', () => {
    const err = new NetworkError();
    expect(err).toBeInstanceOf(AppError);
    expect(err.type).toBe('network');
  });

  it('ApiError carries the status code and type api', () => {
    const err = new ApiError('not found', 404);
    expect(err).toBeInstanceOf(AppError);
    expect(err.type).toBe('api');
    expect(err.status).toBe(404);
  });

  it('ApiError.isRetryable is true for 5xx', () => {
    const err = new ApiError('server error', 503);
    expect(err.isRetryable).toBe(true);
  });

  it('ApiError.isRetryable is false for 4xx', () => {
    const err = new ApiError('bad request', 400);
    expect(err.isRetryable).toBe(false);
  });

  it('RuntimeError has type runtime', () => {
    const err = new RuntimeError('something broke');
    expect(err.type).toBe('runtime');
  });
});
