export default function Field({ label, value, onChange, placeholder, type = 'text', mono = false, maxLength }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm',
          'focus:border-[var(--accent)] transition-colors outline-none',
          mono ? 'font-mono' : '',
        ].join(' ')}
      />
    </label>
  );
}
