import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TextPressure from "../components/TextPressure";
import LightRays from "../components/LightRays";
import { shouldAdvanceFromKey, shouldAdvanceFromWheel } from "../utils/preludeNavigation";
import usePortfolioReducedMotion from "../hooks/usePortfolioReducedMotion";

export default function Prelude() {
  const navigate = useNavigate();
  const reduceMotion = usePortfolioReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const lockedRef = useRef(false);
  const timeoutRef = useRef(null);

  const advance = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLeaving(true);
    timeoutRef.current = window.setTimeout(() => navigate("/entry"), reduceMotion ? 0 : 360);
  }, [navigate, reduceMotion]);

  useEffect(() => () => {
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!shouldAdvanceFromKey(event.key, event.target?.tagName)) return;
      event.preventDefault();
      advance();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advance]);

  const handleWheel = (event) => {
    if (!shouldAdvanceFromWheel(event.deltaY)) return;
    event.preventDefault();
    advance();
  };

  return (
    <motion.main
      className={`prelude${leaving ? " is-leaving" : ""}`}
      onWheel={handleWheel}
      initial={reduceMotion ? false : { opacity: 0.01 }}
      animate={leaving ? { opacity: 0, filter: "blur(4px)" } : { opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.45 }}
    >
      {!reduceMotion && (
        <LightRays
          className="prelude-light-rays"
          raysOrigin="top-center"
          raysColor="#e6ff1a"
          raysSpeed={1.3}
          lightSpread={2.4}
          rayLength={5.3}
          pulsating
          fadeDistance={2}
          saturation={1.1}
          followMouse
          mouseInfluence={0.18}
          noiseAmount={0.35}
          distortion={0}
        />
      )}
      <div className="prelude-glass" aria-hidden="true" />

      <header className="prelude-meta-grid">
        <span className="prelude-meta prelude-meta-name">Lusentao</span>
        <span className="prelude-meta prelude-meta-school">深圳大学</span>
        <span className="prelude-meta prelude-meta-major">视觉传达设计</span>
      </header>

      <div className="prelude-title-wrap">
        <TextPressure text="portfolio" flex alpha={false} stroke={false} width weight italic={false} textColor="#E6FF1A" minFontSize={36} reduceMotion={reduceMotion} />
      </div>

      <button type="button" className="prelude-enter-control" onClick={advance} aria-label="进入项目入口">
        <span aria-hidden="true">↓</span>
      </button>
    </motion.main>
  );
}
