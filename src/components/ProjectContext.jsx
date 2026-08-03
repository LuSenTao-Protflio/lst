import { useLanguage } from "../i18n";

/** A short editorial read of the project: why it exists and how the design responds. */
export default function ProjectContext({ detail, className = "" }) {
  const { lang } = useLanguage();
  const sections = (detail?.sections || []).slice(0, 2);
  if (!sections.length) return null;

  const labels = lang === "en"
    ? ["Project background", "Design rationale"]
    : ["设计背景", "设计说明"];

  return (
    <div className={`project-context ${className}`.trim()}>
      {sections.map((section, index) => (
        <section className="project-context-item" key={`${section.title}-${index}`}>
          <span>{labels[index] || section.label}</span>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </div>
  );
}
