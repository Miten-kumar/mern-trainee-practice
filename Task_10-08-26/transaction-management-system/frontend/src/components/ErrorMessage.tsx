interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          !
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-red-800">
            Something went wrong
          </h3>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}