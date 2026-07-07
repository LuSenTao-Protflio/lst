import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import projects from "../data/projects";
import { useLanguage } from "../i18n";

const narrativeFields = [
  { key: "background", labelKey: "narrative.fields.0.label", enKey: "narrative.fields.0.en" },
  { key: "role", labelKey: "narrative.fields.1.label", enKey: "narrative.fields.1.en" },
  { key: "challenge", labelKey: "narrative.fields.2.label", enKey: "narrative.fields.2.en" },
  { key: "decision", labelKey: "narrative.fields.3.label", enKey: "narrative.fields.3.en" },
  { key: "outcome", labelKey: "narrative.fields.4.label", enKey: "narrative.fields.4.en" },
];

export default function ProjectDetail() {
  const { lang, t } = useLanguage();
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="detail-not-found">
        <h1>{t("detail.notFound")}</h1>
        <p>{t("detail.notFoundDesc").replace("{id}", id)}</p>
        <Link to="/" className="detail-back-link">{t("detail.back")}</Link>
      </div>
    );
  }

  const projectT = t(`projects.${project.id}`);

  return (
    <div className="detail">
      {/* Header */}
      <motion.div
        className="detail-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <span className="detail-num">{project.num}</span>
        <div className="detail-tags">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <h1 className="detail-title">{projectT.title}</h1>
        <p className="detail-en">{projectT.en}</p>
        <p className="detail-desc">{projectT.desc}</p>
      </motion.div>

      {/* Hero */}
      <div className="detail-hero">
        <img src={project.hero} alt={projectT.title} />
      </div>

      {/* Narrative Framework */}
      <motion.section
        className="detail-narrative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="narrative-title">{t("narrative.title")}</h2>
        <div className="narrative-grid">
          {narrativeFields.map((field) => (
            <div className="narrative-card" key={field.key}>
              <span className="narrative-card-label">{t(field.labelKey)}</span>
              <span className="narrative-card-en">{t(field.enKey)}</span>
              <div className="narrative-card-skeleton">
                <span className="skeleton-bar" />
                <span className="skeleton-bar short" />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Image Grid */}
      {project.images.length > 0 && (
        <motion.section
          className="detail-grid-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <div className="detail-grid">
            {project.images.map((src, j) => (
              <motion.div
                key={src}
                className="detail-grid-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * j }}
              >
                <img src={src} alt="" loading={j > 2 ? "lazy" : "eager"} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Back Link */}
      <footer className="detail-footer">
        <Link to="/" className="detail-back-link">{t("detail.back")}</Link>
      </footer>
    </div>
  );
}
