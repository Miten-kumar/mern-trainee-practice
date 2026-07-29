import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCLS } from './useCLS';

describe('useCLS', () => {
  afterEach(() => {
    // @ts-expect-error cleaning up our test mock
    delete global.PerformanceObserver;
  });

  it('starts at 0', () => {
    global.PerformanceObserver = vi.fn().mockImplementation(() => {
      return { observe: vi.fn(), disconnect: vi.fn() };
    }) as any;

    const { result } = renderHook(() => useCLS());
    expect(result.current).toBe(0);
  });

  it('adds up layout-shift entry values that had no recent input', () => {
    let capturedCallback: any;
    global.PerformanceObserver = vi.fn().mockImplementation((cb) => {
      capturedCallback = cb;
      return { observe: vi.fn(), disconnect: vi.fn() };
    }) as any;

    const { result } = renderHook(() => useCLS());

    act(() => {
      capturedCallback({
        getEntries: () => [
          { value: 0.05, hadRecentInput: false },
          { value: 0.03, hadRecentInput: false },
        ],
      });
    });

    expect(result.current).toBeCloseTo(0.08);
  });

  it('ignores layout shifts caused by recent user input', () => {
    let capturedCallback: any;
    global.PerformanceObserver = vi.fn().mockImplementation((cb) => {
      capturedCallback = cb;
      return { observe: vi.fn(), disconnect: vi.fn() };
    }) as any;

    const { result } = renderHook(() => useCLS());

    act(() => {
      capturedCallback({
        getEntries: () => [{ value: 0.2, hadRecentInput: true }],
      });
    });

    expect(result.current).toBe(0);
  });
});
