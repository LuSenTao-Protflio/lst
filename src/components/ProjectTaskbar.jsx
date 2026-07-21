import { Link } from "react-router-dom";
import projects from "../data/projects";
import { useLanguage } from "../i18n";

export default function ProjectTaskbar({ project, title }) {
  const { lang } = useLanguage();
  const index = projects.findIndex((item) => item.id === project.id);
  const current = String(index + 1).padStart(2, "0");
  const total = String(projects.length).padStart(2, "0");

  return (
    <nav className="project-taskbar" aria-label={lang === "zh" ? "项目详情导航" : "Project detail navigation"}>
      <Link to={`/portfolio#${project.id}`} className="project-taskbar-back">
        <span className="project-taskbar-back-long">← {lang === "zh" ? "返回作品集" : "Back to work"}</span>
        <span className="project-taskbar-back-short">← {lang === "zh" ? "返回" : "Back"}</span>
      </Link>
      <strong className="project-taskbar-title">{title}</strong>
      <span className="project-taskbar-order">
        <span className="project-taskbar-order-long">PROJECT {current} / {total}</span>
        <span className="project-taskbar-order-short">{current}·{total}</span>
      </span>
    </nav>
  );
}
