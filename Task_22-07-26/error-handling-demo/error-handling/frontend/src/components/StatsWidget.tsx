import { useApiRequest } from '../hooks/useApiRequest';

interface Stats {
  visits: number;
  signups: number;
  activeUsers: number;
}

export function StatsWidget() {
  const { data, loading, error, retry } = useApiRequest<Stats>('http://localhost:4000/api/demo/stats');

  if (loading) return <div className="widget">Loading stats...</div>;

  if (error) {
    return (
      <div className="widget widget-error" role="alert">
        <p>Stats service is unavailable right now (it failed even after automatic retries).</p>
        <button className="btn btn-small" onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="widget">
      <h3>Stats</h3>
      <p>Visits: {data?.visits}</p>
      <p>Signups: {data?.signups}</p>
      <p>Active users: {data?.activeUsers}</p>
      <p className="hint">This endpoint fails about half the time, so it's a good demo of the retry logic.</p>
    </div>
  );
}
