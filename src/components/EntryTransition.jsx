import { useEffect } from "react";

const EXIT_DURATION_MS = 380;

export default function EntryTransition({ active, onComplete }) {
  useEffect(() => {
    if (!active) return undefined;

    const timeoutId = window.setTimeout(onComplete, EXIT_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [active, onComplete]);

  return null;
}
