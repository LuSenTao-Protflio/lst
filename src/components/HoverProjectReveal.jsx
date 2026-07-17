import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import projects from "../data/projects";
import { useLanguage } from "../i18n";

const PROXIMITY_RADIUS = 148;
const SMOOTHING_MS = 110;

export default function HoverProjectReveal() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [finePointer, setFinePointer] = useState(false);
  const rowRefs = useRef([]);
  const targetRef = useRef([]);
  const currentRef = useRef([]);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);

  const runFrame = useCallback((now) => {
    const dt = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    const k = 1 - Math.exp(-dt / (SMOOTHING_MS / 1000));
    let moving = false;

    rowRefs.current.forEach((row, index) => {
      if (!row) return;
      const target = targetRef.current[index] ?? 0;
      const current = currentRef.current[index] ?? 0;
      const next = current + (target - current) * k;
      const value = Math.abs(target - next) < 0.0015 ? target : next;
      currentRef.current[index] = value;
      row.style.setProperty("--proximity", value.toFixed(4));
      if (value !== target) moving = true;
    });

    frameRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (frameRef.current != null) return;
    lastFrameRef.current = performance.now();
    frameRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const clearProximity = useCallback(() => {
    targetRef.current = rowRefs.current.map(() => 0);
    setHovered(null);
    startLoop();
  }, [startLoop]);

  const handlePointerMove = useCallback((event) => {
    if (!finePointer || reduceMotion) return;

    const nextTargets = rowRefs.current.map((row) => {
      if (!row) return 0;
      const rect = row.getBoundingClientRect();
      const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
      return Math.max(0, 1 - distance / PROXIMITY_RADIUS) ** 2;
    });
    const closest = nextTargets.reduce((best, value, index) => value > nextTargets[best] ? index : best, 0);

    targetRef.current = nextTargets;
    setHovered(nextTargets[closest] > 0 ? closest : null);
    startLoop();
  }, [finePointer, reduceMotion, startLoop]);

  useEffect(() => {
    const query = window.matchMedia("(pointer:fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => () => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="cover-project-reveal">
      <div
        className="cover-project-list"
        role="list"
        onPointerMove={handlePointerMove}
        onPointerLeave={clearProximity}
      >
        {projects.map((project, index) => {
          const translated = t(`projects.${project.id}`);
          const active = hovered === index;
          return (
            <motion.div
              key={project.id}
              className="cover-project-row-wrap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.06 + index * 0.045 }}
            >
              <div
                ref={(element) => {
                  rowRefs.current[index] = element;
                  if (element && !element.style.getPropertyValue("--proximity")) {
                    element.style.setProperty("--proximity", "0.0000");
                  }
                }}
                className={`cover-project-row${active ? " is-active" : ""}`}
                role="listitem"
              >
                <span className="cover-project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="cover-project-tick" aria-hidden="true" />
                <span className="cover-project-title">{translated.title}</span>
              </div>
              {finePointer && !reduceMotion && project.id !== "misc" && (
                <motion.div
                  className="cover-project-preview"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, x: active ? 0 : 10, scale: active ? 1 : 0.985 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                >
                  <img src={project.hero} alt="" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
