export default function ProcessingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin mb-6" />
      <h2 className="font-display text-xl font-semibold mb-1">Processing payment</h2>
      <p className="text-sm text-[var(--text-muted)] font-mono">talking to the payment gateway…</p>
    </div>
  );
}
