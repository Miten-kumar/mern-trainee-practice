// full page takeover - used by the root error boundary. Reload is the
// safest recovery here since we don't know what state the whole app is in.
export function RootFallback(error: Error, reset: () => void) {
  return (
    <div className="fallback fallback-root">
      <h1>Something went wrong</h1>
      <p>The app hit an unexpected error. Reloading the page usually fixes it.</p>
      <p className="fallback-detail">{error.message}</p>
      <button
        className="btn btn-primary"
        onClick={() => {
          reset();
          window.location.reload();
        }}
      >
        Reload page
      </button>
    </div>
  );
}

// used for a whole page/route level boundary - less drastic than a
// full reload, lets the user try re-rendering just this page
export function PageFallback(error: Error, reset: () => void) {
  return (
    <div className="fallback fallback-page">
      <h2>This page couldn't load</h2>
      <p className="fallback-detail">{error.message}</p>
      <button className="btn btn-secondary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}

// small inline box, used for individual widgets/sections so one
// broken widget doesn't take down the rest of the dashboard
export function SectionFallback(error: Error, reset: () => void) {
  return (
    <div className="fallback fallback-section" role="alert">
      <p>This section failed to load.</p>
      <p className="fallback-detail">{error.message}</p>
      <button className="btn btn-small" onClick={reset}>
        Retry
      </button>
    </div>
  );
}
