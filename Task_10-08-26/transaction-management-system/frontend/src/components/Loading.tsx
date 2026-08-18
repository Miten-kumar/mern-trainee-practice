interface LoadingProps {
  message?: string;
}

export default function Loading({
  message = "Loading...",
}: LoadingProps) {
  return (
    <div className="flex min-h-60 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />

        <p className="text-sm text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}