import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../i18n";
import HoverProjectReveal from "./HoverProjectReveal";
import LightRays from "./LightRays";

export default function InteractiveCover({ onEnter, isExiting = false }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const wheelLocked = useRef(false);

  const enterPortfolio = (destination = "/portfolio") => onEnter?.(destination);

  const onWheel = (event) => {
    if (wheelLocked.current || event.deltaY < 18) return;
    event.preventDefault();
    wheelLocked.current = true;
    enterPortfolio();
    window.setTimeout(() => { wheelLocked.current = false; }, 900);
  };

  return (
    <section
      className={`interactive-cover${isExiting ? " is-exiting" : ""}`}
      id="portfolio-cover"
      onWheel={onWheel}
    >
      {!reduceMotion && (
        <LightRays
          className="cover-light-rays"
          raysOrigin="top-center"
          raysColor="#e6ff1a"
          raysSpeed={1.5}
          lightSpread={2.8}
          rayLength={5}
          pulsating
          fadeDistance={2}
          saturation={1.2}
          followMouse
          mouseInfluence={0.22}
          noiseAmount={0.5}
          distortion={0}
        />
      )}
      <div className="cover-glass-veil" aria-hidden="true" />

      <motion.nav
        className="cover-text-nav"
        aria-label={lang === "zh" ? "入口导航" : "Entry navigation"}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <button type="button" className="cover-text-nav-item cover-text-nav-work" onClick={() => enterPortfolio("/portfolio#work")}>
          <span aria-hidden="true">01</span> WORK
        </button>
        <button type="button" className="cover-text-nav-item cover-text-nav-info" onClick={() => enterPortfolio("/portfolio#info")}>
          <span aria-hidden="true">02</span> INFO
        </button>
        <button type="button" className="cover-text-nav-item cover-text-nav-contact" onClick={() => enterPortfolio("/portfolio#contact")}>
          <span aria-hidden="true">03</span> {lang === "zh" ? "联系我" : "CONTACT"}
        </button>
      </motion.nav>

      <div className="cover-main-grid">
        <HoverProjectReveal />
      </div>

      <motion.button
        type="button"
        className="cover-enter-link"
        onClick={() => enterPortfolio()}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.08 }}
      >
        <span className="cover-enter-label">{lang === "zh" ? "进入作品集" : "Enter portfolio"}</span>
        <span className="cover-enter-subtitle">{lang === "zh" ? "ENTER PORTFOLIO" : "进入作品集"}</span>
        <span className="cover-enter-double-arrow" aria-hidden="true">↓↓</span>
      </motion.button>
    </section>
  );
}
