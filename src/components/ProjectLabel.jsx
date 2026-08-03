export default function ProjectLabel({ num, className = "" }) {
  return (
    <span className={`project-label ${className}`.trim()}>
      PROJECT <span className="project-label-num">{num}</span>{" "}
      <i aria-hidden="true">/</i>{" "}
      项目 <span className="project-label-num">{num}</span>
    </span>
  );
}
