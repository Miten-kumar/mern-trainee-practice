interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({
  message,
}: ErrorMessageProps) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
}