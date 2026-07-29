import { useCLS } from '../hooks/useCLS';

interface Props {
  reserveSpace: boolean;
  onToggleReserveSpace: () => void;
}

// good CLS is under 0.1, needs improvement 0.1-0.25, poor above 0.25
// (these thresholds are Google's, used across web performance tools)
function ratingFor(score: number) {
  if (score < 0.1) return 'good';
  if (score < 0.25) return 'needs improvement';
  return 'poor';
}

export function ClsPanel({ reserveSpace, onToggleReserveSpace }: Props) {
  const cls = useCLS();

  return (
    <div className="cls-panel">
      <p>
        CLS score: <strong>{cls.toFixed(4)}</strong> ({ratingFor(cls)})
      </p>
      <label>
        <input type="checkbox" checked={reserveSpace} onChange={onToggleReserveSpace} />
        Reserve image space with aspect-ratio (uncheck to see CLS get worse)
      </label>
    </div>
  );
}
