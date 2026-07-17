export default function ProjectFolderReveal({ project, title, open }) {
  const images = (project.previewImages || project.images).slice(0, 3);
  const label = title;

  return (
    <span
      className={`project-inline-folder${open ? " is-open" : ""}`}
      aria-hidden="true"
    >
      <span className="project-inline-folder-scene" aria-hidden="true">
        <span className="project-inline-folder-back" />
        <span className="project-inline-folder-cards">
          {images.map((src, index) => (
            <span className={`project-inline-folder-card card-${index + 1}`} key={src}>
              <img src={src} alt="" loading="lazy" />
            </span>
          ))}
        </span>
        <span className="project-inline-folder-flap" />
        <span className="project-inline-folder-front">
          <small>{label}</small>
          <strong>OPEN ↗</strong>
        </span>
      </span>
    </span>
  );
}
