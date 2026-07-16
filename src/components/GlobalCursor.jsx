import { useEffect, useMemo, useRef, useState } from "react";

export default function GlobalCursor() {
  const [finePointer, setFinePointer] = useState(false);
  const arrowRef = useRef(null);
  const labelRef = useRef(null);

  const pointerQuery = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(pointer: fine)") : null),
    [],
  );

  useEffect(() => {
    if (!pointerQuery) return undefined;
    const sync = () => setFinePointer(pointerQuery.matches);
    sync();
    pointerQuery.addEventListener("change", sync);
    return () => pointerQuery.removeEventListener("change", sync);
  }, [pointerQuery]);

  useEffect(() => {
    if (!finePointer) return undefined;

    const arrow = arrowRef.current;
    const label = labelRef.current;
    if (!arrow || !label) return undefined;

    const setScale = (value) => {
      arrow.style.setProperty("--cursor-scale", value);
      label.style.setProperty("--cursor-scale", value);
    };

    const onMove = (event) => {
      arrow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) scale(var(--cursor-scale, 1))`;
      label.style.transform = `translate3d(${event.clientX + 28}px, ${event.clientY + 12}px, 0) scale(var(--cursor-scale, 1))`;
      arrow.style.opacity = "1";
      label.style.opacity = "1";
    };
    const onDown = (event) => {
      if (event.button === 0) setScale("0.92");
    };
    const onUp = () => setScale("1");
    const onOut = (event) => {
      if (event.relatedTarget == null) {
        arrow.style.opacity = "0";
        label.style.opacity = "0";
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerout", onOut);
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <div className="global-cursor-layer" aria-hidden="true">
      <div ref={labelRef} className="global-cursor-label">卢森涛</div>
      <div ref={arrowRef} className="global-cursor-arrow">
        <svg width="31" height="31" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M0 0 L22 13 L12.5 15 L9 25 Z" fill="#E6FF1A" stroke="rgba(58,58,58,.32)" strokeWidth="0.7" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
