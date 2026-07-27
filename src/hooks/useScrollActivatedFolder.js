import { useEffect, useRef } from "react";

export default function useScrollActivatedFolder({ enabled, onChange }) {
  const activeIdRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      activeIdRef.current = null;
      onChange(null);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") return undefined;

    const projectNodes = Array.from(
      document.querySelectorAll(".project[data-project-id]"),
    );
    if (projectNodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const center = window.innerHeight / 2;
            const aDistance = Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - center);
            const bDistance = Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - center);
            return aDistance - bDistance;
          });

        if (entering.length > 0) {
          const nextId = entering[0].target.dataset.projectId;
          activeIdRef.current = nextId;
          onChange(nextId);
          return;
        }

        const activeEntry = entries.find(
          (entry) => entry.target.dataset.projectId === activeIdRef.current,
        );
        if (activeEntry && !activeEntry.isIntersecting) {
          activeIdRef.current = null;
          onChange(null);
        }
      },
      { rootMargin: "-34% 0px -34% 0px", threshold: 0 },
    );

    projectNodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      activeIdRef.current = null;
    };
  }, [enabled, onChange]);
}
