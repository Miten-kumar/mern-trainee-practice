import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useInView } from './useInView';

// small test component so the ref actually attaches to a real DOM
// node, which is what the hook needs to start observing
function TestComponent() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return <div ref={ref}>{inView ? 'visible' : 'hidden'}</div>;
}

describe('useInView', () => {
  afterEach(() => {
    // @ts-expect-error cleaning up our test mock
    delete global.IntersectionObserver;
  });

  it('starts as not in view', () => {
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    })) as any;

    render(<TestComponent />);
    expect(screen.getByText('hidden')).toBeTruthy();
  });

  it('becomes true once the observed element intersects', () => {
    let capturedCallback: (entries: { isIntersecting: boolean }[]) => void = () => {};

    global.IntersectionObserver = vi.fn().mockImplementation((cb) => {
      capturedCallback = cb;
      return { observe: vi.fn(), disconnect: vi.fn() };
    }) as any;

    render(<TestComponent />);

    act(() => {
      capturedCallback([{ isIntersecting: true }]);
    });

    expect(screen.getByText('visible')).toBeTruthy();
  });
});
