import { Link } from "react-router-dom";
import projects from "../data/projects";
import { useLanguage } from "../i18n";
import SiteFooter from "./SiteFooter";

export default function ProjectChrome({ currentId }) {
  const { lang, t } = useLanguage();
  const index = projects.findIndex((project) => project.id === currentId);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const previousTitle = t(`projects.${previous.id}`).title;
  const nextTitle = t(`projects.${next.id}`).title;
  const previousLabel = lang === "zh" ? "上一个项目" : "Previous project";
  const nextLabel = lang === "zh" ? "下一个项目" : "Next project";

  return (
    <>
      <nav className="project-pager" aria-label={lang === "zh" ? "项目导航" : "Project navigation"}>
        <Link to={`/project/${previous.id}`} className="project-pager-link project-pager-previous">
          <span>← {previousLabel}</span>
          <strong>{previousTitle}</strong>
        </Link>
        <Link to={`/project/${next.id}`} className="project-pager-link project-pager-next">
          <span>{nextLabel} →</span>
          <strong>{nextTitle}</strong>
        </Link>
      </nav>

      <SiteFooter />
    </>
  );
}
