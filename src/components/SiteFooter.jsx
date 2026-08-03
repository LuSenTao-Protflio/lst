import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../i18n";

export default function SiteFooter({ editorial = false, onActiveChange }) {
  const { t } = useLanguage();
  const observerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = observerRef.current;
    if (!editorial || !node || !onActiveChange) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => onActiveChange?.(entry.isIntersecting),
      { threshold: 0.42 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      onActiveChange?.(false);
    };
  }, [editorial, onActiveChange]);

  const reveal = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 36 },
        whileInView: { opacity: 1, y: 0 },
      };

  if (!editorial) {
    return (
      <footer className="footer-compact" id="contact">
        <div className="footer-compact-inner">
          <div>
            <h2 className="footer-heading">{t("footer.col1Heading")}</h2>
            <a href="mailto:sentaolu371@gmail.com" className="footer-compact-link">
              {t("footer.col1Email")}
            </a>
            <a href="tel:15875591020" className="footer-compact-link footer-compact-phone">
              15875591020
            </a>
          </div>
          <div>
            <h2 className="footer-heading">{t("footer.col2Heading")}</h2>
            <p className="footer-about">{t("footer.col2Desc")}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer" id="contact">
      <div className="footer-observer">
        <motion.p
          className="footer-wordmark"
          aria-label="LUSENTAO"
          {...reveal}
          viewport={{ amount: 0.2 }}
          transition={{
            duration: 0.9,
            delay: reduceMotion ? 0 : 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >LUSENTAO</motion.p>

        <div ref={observerRef} className="footer-info-stage">
          <motion.div
            className="footer-info"
            {...reveal}
            viewport={{ amount: 0.35 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footer-contact">
            <h2 className="footer-heading">{t("footer.col1Heading")}</h2>
            <a href="mailto:sentaolu371@gmail.com" className="footer-contact-link">
              {t("footer.col1Email")}
            </a>
            <a href="tel:15875591020" className="footer-contact-link">
              15875591020
            </a>
          </div>
          <div className="footer-about-col">
            <h2 className="footer-heading">{t("footer.col2Heading")}</h2>
            <p className="footer-about">{t("footer.col2Desc")}</p>
          </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
