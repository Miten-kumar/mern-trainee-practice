import { useRef } from "react";

export function LazyProof({ label }: { label: string }) {
  // useRef instead of state on purpose - we just want to capture the
  // mount time once and never re-run this, no need to trigger renders
  const mountedAt = useRef(new Date().toLocaleTimeString());

  return (
    <p>
      <strong>{label}</strong> content first mounted at{" "}
      <code>{mountedAt.current}</code>. Switch tabs away and back - this
      time won't change, because the panel stays mounted once visited.
    </p>
  );
}
