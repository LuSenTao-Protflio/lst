import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n";

export default function FloatingGlassNav() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const [homeVisible, setHomeVisible] = useState(false);
  const isHome = pathname === "/portfolio";
  const isProject = pathname.startsWith("/project/");

  useEffect(() => {
    if (!isHome) {
      setHomeVisible(false);
      return;
    }

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const firstProject = document.getElementById("whelk");
        setHomeVisible(Boolean(firstProject && window.scrollY >= firstProject.offsetTop - 80));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  if (isProject) return null;

  if (!isHome) return null;

  const label = lang === "zh" ? "返回顶部" : "Back to top";
  return (
    <button
      type="button"
      className={`floating-glass-nav floating-back-top${homeVisible ? " is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      aria-label={label}
      aria-hidden={!homeVisible}
      tabIndex={homeVisible ? 0 : -1}
    >
      <span className="floating-glass-arrow" aria-hidden="true">↑</span>
      <span>{label}</span>
    </button>
  );
}
