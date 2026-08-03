import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LightRays from "../components/LightRays";
import projects from "../data/projects";
import { useLanguage } from "../i18n";
import photoImg from "../../assets/IMG_2345.webp";
import SiteFooter from "../components/SiteFooter";
import ProjectFolderReveal from "../components/ProjectFolderReveal";
import useScrollActivatedFolder from "../hooks/useScrollActivatedFolder";

export default function Home() {
  const { lang, setLang, t } = useLanguage();
  const [activeFolder, setActiveFolder] = useState(null);
  const [outroActive, setOutroActive] = useState(false);
  const [hoverFolders, setHoverFolders] = useState(() => (
    typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ));
  const toggleLang = () => setLang(l => (l === "zh" ? "en" : "zh"));

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHoverFolders(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useScrollActivatedFolder({
    enabled: !hoverFolders,
    onChange: setActiveFolder,
  });

  return (
    <div className="app">
      <nav className={`nav ${outroActive ? "is-outro-hidden" : ""}`}>
        <span className="nav-logo">Lusen Tao</span>
        <div className="nav-links">
          <a href="#directory" className="nav-link">{t("nav.work")}</a>
          <a href="#info" className="nav-link">{t("nav.info")}</a>
        </div>
        <button
          className="nav-lang-btn"
          onClick={toggleLang}
          aria-label="Switch language"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          <span className="nav-lang-label">{t("langBtn")}</span>
        </button>
      </nav>

      <section className="hero-info-flow">
        <LightRays
          className="hero-info-rays"
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
        {/* ── Hero ── */}
        <header className="hero" id="portfolio-home">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="hero-eyebrow">{t("hero.eyebrow")}</p>
          <h1 className="hero-title">
            <motion.span className={lang === "en" ? "hero-title-en-display" : undefined} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}>
              {t("hero.name")}
            </motion.span>
            <motion.span className="hero-title-en-display" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}>
              {t("hero.role")}
            </motion.span>
            <motion.span className="hero-title-en-display" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 0.61, 0.36, 1] }}>
              {t("hero.portfolio")}
            </motion.span>
          </h1>
          <motion.p
            className="hero-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {t("hero.meta").split("\n").map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </motion.p>
        </motion.div>
        </header>

        {/* ── Info ── */}
        <section className="info" id="info">
        <motion.div
          className="info-layout"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="info-photo-wrap">
            <div className="info-photo">
              <img src={photoImg} alt={t("hero.name")} />
              <div className="info-photo-contact-card">
                <span className="info-photo-avatar" aria-hidden="true">
                  <img src={photoImg} alt="" />
                </span>
                <span className="info-photo-contact-copy">
                  <strong>卢森涛</strong>
                  <small>{lang === "zh" ? "视觉传达设计" : "Visual Communication Design"}</small>
                </span>
                <a href="#contact" className="info-photo-contact-action">{lang === "zh" ? "联系我" : "Contact"}</a>
              </div>
            </div>
          </div>
          <div className="info-cols">
            <div className="info-row">
              <span className="info-row-label">{t("info.education.label")}</span>
              <span className="info-row-value">{t("info.education.value")}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">{t("info.experience.label")}</span>
              <span className="info-row-value">{t("info.experience.value")}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">{t("info.tools.label")}</span>
              <span className="info-row-value">{t("info.tools.value")}</span>
            </div>
            <div className="info-row">
              <span className="info-row-label">{t("info.contact.label")}</span>
              <span className="info-row-value">{t("info.contact.value")}</span>
            </div>
          </div>
        </motion.div>
        </section>
      </section>

      {/* ── Project Directory ── */}
      <section className="directory" id="directory">
        <motion.h2
          className="dir-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t("directory")}
        </motion.h2>
        <div className="dir-list">
          {projects.map((p, i) => {
            const projectT = t(`projects.${p.id}`);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <a
                  href={`#${p.id}`}
                  className="dir-row"
                >
                  <span className="dir-row-num">{p.num}</span>
                  <div className="dir-row-body">
                    <h3 className="dir-row-title">{projectT.title}</h3>
                    <p className="dir-row-en">{projectT.en}</p>
                  </div>
                  <div className="dir-row-tags">
                    {p.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Work / Individual Projects ── */}
      <section className="work" id="work">
        {projects.map((p, i) => {
          const projectT = t(`projects.${p.id}`);
          return (
            <motion.div
              key={p.id}
              className="project"
              id={p.id}
              data-project-id={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <Link
                to={`/project/${p.id}`}
                className="project-hit-area"
                aria-label={`查看${projectT.title}完整项目`}
                onPointerEnter={() => hoverFolders && setActiveFolder(p.id)}
                onPointerLeave={() => hoverFolders && setActiveFolder(null)}
                onFocusCapture={() => setActiveFolder(p.id)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setActiveFolder(null);
                }}
              >
                <div className="project-summary">
                  <div className="project-body">
                    <span className="project-num">{p.num}</span>
                    <div className="project-tags">
                      {p.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                    <h2 className="project-title">{projectT.title}</h2>
                    <p className="project-en">{projectT.en}</p>
                    <p className="project-desc">{projectT.desc}</p>
                  </div>
                  <ProjectFolderReveal project={p} title={projectT.title} open={activeFolder === p.id} />
                </div>

                {p.images.length > 0 && (
                  <div className="project-grid">
                    {(p.previewImages || p.images).slice(0, 3).map((src, j) => (
                      <motion.div
                        key={src}
                        className="grid-item"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.45, delay: 0.05 * j }}
                      >
                        <img src={src} alt="" loading={j > 2 ? "lazy" : "eager"} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </section>

      <SiteFooter onActiveChange={setOutroActive} />
    </div>
  );
}
