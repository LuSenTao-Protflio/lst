import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../i18n";
import HoverProjectReveal from "./HoverProjectReveal";
import Plasma from "./Plasma";
import ScrambledText from "./ScrambledText";

export default function InteractiveCover({ onEnter }) {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const wheelLocked = useRef(false);

  const enterPortfolio = (destination = "/portfolio") => onEnter?.(destination);
  const plasmaInteractive = !reduceMotion
    && typeof window !== "undefined"
    && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onWheel = (event) => {
    if (wheelLocked.current || event.deltaY < 18) return;
    event.preventDefault();
    wheelLocked.current = true;
    enterPortfolio();
    window.setTimeout(() => { wheelLocked.current = false; }, 900);
  };

  const titleLines = lang === "zh"
    ? ["卢森涛", "个人作品集网站"]
    : ["LUSEN TAO", "PERSONAL PORTFOLIO"];

  return (
    <section className="interactive-cover" id="portfolio-cover" onWheel={onWheel}>
      <div className="cover-plasma" aria-hidden="true">
        {!reduceMotion && (
          <Plasma
            color="#e6ff1a"
            speed={0.45}
            scale={1.15}
            opacity={0.2}
            mouseInteractive={plasmaInteractive}
          />
        )}
      </div>
      <div className="cover-plasma-veil" aria-hidden="true" />

      <motion.nav
        className="cover-nav"
        aria-label={lang === "zh" ? "入口导航" : "Entry navigation"}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        <button type="button" className="cover-nav-brand" onClick={() => enterPortfolio("/portfolio")}>LUSEN TAO</button>
        <div className="cover-nav-links">
          <button type="button" onClick={() => enterPortfolio("/portfolio#work")}>WORK</button>
          <button type="button" onClick={() => enterPortfolio("/portfolio#info")}>INFO</button>
          <button type="button" className="cover-nav-contact" onClick={() => enterPortfolio("/portfolio#contact")}>
            {lang === "zh" ? "联系我" : "CONTACT"}
          </button>
        </div>
      </motion.nav>

      <div className="cover-main-grid">
        <div className="cover-title-block">
          <div className="cover-title-mask">
            <motion.h1
              initial={reduceMotion ? false : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScrambledText text={titleLines[0]} delay={120} duration={920} />
            </motion.h1>
          </div>
          <div className="cover-title-mask cover-title-secondary">
            <motion.div
              className="cover-title-highlight-wrap"
              initial={reduceMotion ? false : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="cover-title-highlight">
                <ScrambledText text={titleLines[1]} delay={360} duration={1080} />
              </span>
            </motion.div>
          </div>
          <motion.p
            className="cover-title-en"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            {lang === "zh" ? "LUSEN TAO — PERSONAL PORTFOLIO" : "卢森涛 · 个人作品集网站"}
          </motion.p>
          <motion.p
            className="cover-title-note"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            BRANDING / UI·UX / PUBLICATION / EVENT VISUAL
          </motion.p>
        </div>

        <HoverProjectReveal />
      </div>

      <motion.button
        type="button"
        className="cover-enter-button"
        onClick={() => enterPortfolio()}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.25 }}
      >
        <span className="cover-enter-arrow" aria-hidden="true">↓</span>
        <span>{lang === "zh" ? "进入作品集" : "Enter portfolio"}</span>
        <small>{lang === "zh" ? "ENTER PORTFOLIO" : "进入作品集"}</small>
      </motion.button>
    </section>
  );
}
