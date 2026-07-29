import { useEffect, useState } from 'react';
import { getStats, subscribeToStats } from '../services/errorLogger';

export function ErrorAnalyticsPanel() {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    // re-render this panel whenever a new error gets logged anywhere
    const unsubscribe = subscribeToStats(() => setStats(getStats()));
    return unsubscribe;
  }, []);

  const total = Object.values(stats).reduce((sum, n) => sum + n, 0);

  return (
    <div className="analytics-panel">
      <h3>Errors this session</h3>
      {total === 0 ? (
        <p className="hint">No errors logged yet.</p>
      ) : (
        <ul>
          {Object.entries(stats).map(([type, count]) => (
            <li key={type}>
              {type}: {count}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
