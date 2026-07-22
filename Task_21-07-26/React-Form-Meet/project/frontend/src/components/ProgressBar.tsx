import { STEP_LABELS } from '../schema';

interface Props {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: Props) {
  return (
    <ol className="progress-bar" aria-label="Form progress">
      {STEP_LABELS.map((label, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <li
            key={label}
            className={`progress-step ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className="progress-step-circle">{isDone ? '✓' : index + 1}</span>
            <span className="progress-step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
