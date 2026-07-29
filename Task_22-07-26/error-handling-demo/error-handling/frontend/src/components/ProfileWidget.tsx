import { useApiRequest } from '../hooks/useApiRequest';
import { NetworkError, ApiError } from '../errors';

interface Profile {
  name: string;
  role: string;
  joined: string;
}

export function ProfileWidget() {
  const { data, loading, error, retry } = useApiRequest<Profile>('http://localhost:4000/api/demo/profile');

  if (loading) return <div className="widget">Loading profile...</div>;

  if (error) {
    return (
      <div className="widget widget-error" role="alert">
        <p>{describeError(error as NetworkError | ApiError)}</p>
        <button className="btn btn-small" onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="widget">
      <h3>Profile</h3>
      <p>{data?.name}</p>
      <p className="hint">
        {data?.role} - joined {data?.joined}
      </p>
    </div>
  );
}

// network errors and api errors need different messages, since they
// mean different things to the user
function describeError(error: NetworkError | ApiError) {
  if (error.type === 'network') {
    return "Couldn't reach the server, check your internet connection.";
  }
  if (error.type === 'api') {
    return `Server returned an error (status ${(error as ApiError).status}).`;
  }
  return 'Something went wrong loading this widget.';
}
