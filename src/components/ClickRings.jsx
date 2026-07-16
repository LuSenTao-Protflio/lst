import { useEffect, useRef, useState } from "react";

export default function ClickRings() {
  const [rings, setRings] = useState([]);
  const timers = useRef(new Set());

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPointerDown = (event) => {
      if (!finePointer.matches || reducedMotion.matches || !event.isPrimary || event.button !== 0) return;
      const id = `${event.timeStamp}-${event.clientX}-${event.clientY}`;
      setRings((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
      const timer = window.setTimeout(() => {
        setRings((current) => current.filter((ring) => ring.id !== id));
        timers.current.delete(timer);
      }, 350);
      timers.current.add(timer);
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  return (
    <div className="click-rings-layer" aria-hidden="true">
      {rings.map((ring) => <span key={ring.id} className="click-ring" style={{ left: ring.x, top: ring.y }} />)}
    </div>
  );
}
