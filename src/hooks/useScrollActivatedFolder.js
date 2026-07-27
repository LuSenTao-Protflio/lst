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

    const intersectingNodes = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingNodes.add(entry.target);
          } else {
            intersectingNodes.delete(entry.target);
          }
        });

        if (intersectingNodes.size === 0) {
          if (activeIdRef.current !== null) {
            activeIdRef.current = null;
            onChange(null);
          }
          return;
        }

        const center = window.innerHeight / 2;
        const nextNode = Array.from(intersectingNodes).reduce((closest, node) => {
          const nodeRect = node.getBoundingClientRect();
          const closestRect = closest.getBoundingClientRect();
          const nodeDistance = Math.abs(nodeRect.top + nodeRect.height / 2 - center);
          const closestDistance = Math.abs(closestRect.top + closestRect.height / 2 - center);
          return nodeDistance < closestDistance ? node : closest;
        });
        const nextId = nextNode.dataset.projectId;
        if (activeIdRef.current !== nextId) {
          activeIdRef.current = nextId;
          onChange(nextId);
        }
      },
      { rootMargin: "-34% 0px -34% 0px", threshold: 0 },
    );

    projectNodes.forEach((node) => observer.observe(node));

    return () => {
      intersectingNodes.clear();
      activeIdRef.current = null;
      observer.disconnect();
    };
  }, [enabled, onChange]);
}
