import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n";

export default function SiteFooter({ editorial = false, onActiveChange }) {
  const { t } = useLanguage();
  const observerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = observerRef.current;
    if (!editorial || !node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting);
        onActiveChange?.(entry.isIntersecting && entry.intersectionRatio >= 0.42);
      },
      { threshold: [0, 0.42] },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      onActiveChange?.(false);
    };
  }, [editorial, onActiveChange]);

  if (!editorial) {
    return (
      <footer className="footer-compact" id="contact">
        <div className="footer-compact-inner">
          <div>
            <h2 className="footer-heading">{t("footer.col1Heading")}</h2>
            <h3 className="footer-contact-label footer-heading">{t("footer.emailLabel")}</h3>
            <a href="mailto:sentaolu371@gmail.com" className="footer-compact-link">
              {t("footer.col1Email")}
            </a>
            <h3 className="footer-contact-label footer-heading">{t("footer.phoneLabel")}</h3>
            <a href="tel:15875591020" className="footer-compact-link footer-compact-phone">
              {t("footer.col1Phone")}
            </a>
          </div>
          <div>
            <p className="footer-about">{t("footer.col2Desc")}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer className={`footer${isRevealed ? " is-revealed" : ""}`} id="contact">
        <div className="footer-observer">
          <div className="footer-info-stage">
            <div className="footer-info">
              <div className="footer-contact">
                <h2 className="footer-heading">{t("footer.col1Heading")}</h2>
                <h3 className="footer-contact-label footer-heading">{t("footer.emailLabel")}</h3>
                <a href="mailto:sentaolu371@gmail.com" className="footer-contact-link">
                  {t("footer.col1Email")}
                </a>
                <h3 className="footer-contact-label footer-heading">{t("footer.phoneLabel")}</h3>
                <a href="tel:15875591020" className="footer-contact-link">
                  {t("footer.col1Phone")}
                </a>
              </div>
              <div className="footer-about-col">
                <p className="footer-about">{t("footer.col2Desc")}</p>
              </div>
            </div>
          </div>

          <p className="footer-wordmark" aria-label="LUSENTAO">LUSENTAO</p>
        </div>
      </footer>
      <div ref={observerRef} className="footer-reveal-spacer" aria-hidden="true" />
    </>
  );
}
