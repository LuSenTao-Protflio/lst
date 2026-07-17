import { useParams, Link } from "react-router-dom";
import projects from "../data/projects";
import { useLanguage } from "../i18n";
import WoofProjectDetail from "./WoofProjectDetail";
import MetaKeysProjectDetail from "./MetaKeysProjectDetail";
import EditorialProjectDetail from "./EditorialProjectDetail";
import ProjectChrome from "./ProjectChrome";
import ProjectTaskbar from "./ProjectTaskbar";

export default function ProjectDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="detail-not-found">
        <h1>{t("detail.notFound")}</h1>
        <p>{t("detail.notFoundDesc").replace("{id}", id)}</p>
        <Link to="/entry" className="detail-back-link">{t("detail.back")}</Link>
      </div>
    );
  }

  const projectT = t(`projects.${project.id}`);

  const detailContent = project.id === "woof"
    ? <WoofProjectDetail project={project} projectT={projectT} />
    : project.id === "metakeys"
      ? <MetaKeysProjectDetail project={project} projectT={projectT} />
      : <EditorialProjectDetail project={project} projectT={projectT} />;

  return <><ProjectTaskbar project={project} title={projectT.title} />{detailContent}<ProjectChrome currentId={project.id} /></>;
}
