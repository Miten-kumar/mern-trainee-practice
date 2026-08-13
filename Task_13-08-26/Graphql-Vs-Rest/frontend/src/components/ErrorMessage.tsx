import "./components.css";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({
  message,
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        !
      </div>

      <h3>Something went wrong</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;