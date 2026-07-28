import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import projects from "../data/projects";
import { useLanguage } from "../i18n";
import usePortfolioReducedMotion from "../hooks/usePortfolioReducedMotion";

const PROXIMITY_RADIUS = 148;
const SMOOTHING_MS = 110;

export default function HoverProjectReveal() {
  const { t } = useLanguage();
  const reduceMotion = usePortfolioReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [finePointer, setFinePointer] = useState(false);
  const [mobileCoarsePointer, setMobileCoarsePointer] = useState(false);
  const [activeTouchIndex, setActiveTouchIndex] = useState(null);
  const rowRefs = useRef([]);
  const targetRef = useRef([]);
  const currentRef = useRef([]);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);
  const touchPointerRef = useRef(null);
  const touchX = useMotionValue(0);
  const touchY = useMotionValue(0);

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
    if (event.pointerType === "touch" && mobileCoarsePointer && touchPointerRef.current === event.pointerId) {
      const previewWidth = Math.min(window.innerWidth * 0.48, 184);
      const previewHeight = previewWidth / 1.6;
      touchX.set(Math.max(12, Math.min(event.clientX + 18, window.innerWidth - previewWidth - 12)));
      touchY.set(Math.max(12, Math.min(event.clientY - previewHeight - 20, window.innerHeight - previewHeight - 12)));

      const nextIndex = rowRefs.current.findIndex((row) => {
        if (!row) return false;
        const rect = row.getBoundingClientRect();
        return event.clientX >= rect.left
          && event.clientX <= rect.right
          && event.clientY >= rect.top
          && event.clientY <= rect.bottom;
      });
      setActiveTouchIndex(nextIndex >= 0 && projects[nextIndex]?.id !== "misc" ? nextIndex : null);
      return;
    }

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
  }, [finePointer, mobileCoarsePointer, reduceMotion, startLoop, touchX, touchY]);

  const handlePointerDown = useCallback((event) => {
    if (!mobileCoarsePointer || event.pointerType !== "touch") return;
    touchPointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    handlePointerMove(event);
  }, [handlePointerMove, mobileCoarsePointer]);

  const finishTouch = useCallback((event) => {
    if (event.pointerType !== "touch" || touchPointerRef.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    touchPointerRef.current = null;
    setActiveTouchIndex(null);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(pointer:fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 599px) and (pointer: coarse)");
    const sync = () => {
      setMobileCoarsePointer(query.matches);
      if (!query.matches) {
        touchPointerRef.current = null;
        setActiveTouchIndex(null);
      }
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => () => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
  }, []);

  const touchProject = activeTouchIndex == null ? null : projects[activeTouchIndex];

  return (
    <div className="cover-project-reveal">
      <div
        className="cover-project-list"
        role="list"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishTouch}
        onPointerCancel={finishTouch}
        onLostPointerCapture={finishTouch}
        onPointerLeave={clearProximity}
      >
        {projects.map((project, index) => {
          const translated = t(`projects.${project.id}`);
          const active = hovered === index || activeTouchIndex === index;
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
      <AnimatePresence>
        {mobileCoarsePointer && touchProject && touchProject.id !== "misc" && (
          <motion.div
            className="cover-project-touch-preview"
            style={{ x: touchX, y: touchY }}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <motion.img
              key={touchProject.id}
              src={touchProject.hero}
              alt=""
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.16 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
