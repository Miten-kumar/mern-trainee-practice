import { useState } from 'react';

interface BadData {
  user: { name: string } | null;
}

// simulates a common real bug - code assumes some nested data exists
// and blows up when it doesn't. Error boundaries only catch errors
// during rendering, so we trigger the bug by setting state and letting
// the next render throw - throwing directly inside the click handler
// would NOT be caught by the boundary.
export function BuggyWidget() {
  const [data, setData] = useState<BadData>({ user: { name: 'Test User' } });
  const [broken, setBroken] = useState(false);

  if (broken) {
    // data.user is null here, so .name access throws a TypeError -
    // a genuine runtime error, not a network/api one
    return <p>{data.user!.name.toUpperCase()}</p>;
  }

  return (
    <div className="widget">
      <h3>Buggy widget</h3>
      <p className="hint">Click the button below to simulate a real JS bug (not network/API related).</p>
      <button
        className="btn btn-small"
        onClick={() => {
          setData({ user: null });
          setBroken(true);
        }}
      >
        Trigger bug
      </button>
    </div>
  );
}
