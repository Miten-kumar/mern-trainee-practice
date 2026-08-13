import { useEffect, useState } from 'react';
import Checkout from './Checkout';
import { getOrCreateSessionId, fetchSnapshot } from './machine/persist';

export default function App() {
  const [ready, setReady] = useState(false);
  const [sessionId] = useState(getOrCreateSessionId);
  const [snapshot, setSnapshot] = useState(undefined);
  const [apiOnline, setApiOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const restored = await fetchSnapshot(sessionId);
      if (cancelled) return;
      setSnapshot(restored);
      setApiOnline(true);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the backend never responds (down / CORS / wrong port), fall back to a
  // fresh session after a short wait rather than blocking the UI forever.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!ready) {
        setApiOnline(false);
        setReady(true);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-noise flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-sm">
          <span className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
          connecting to backend…
        </div>
      </div>
    );
  }

  return <Checkout sessionId={sessionId} initialSnapshot={snapshot} apiOnline={apiOnline} />;
}
