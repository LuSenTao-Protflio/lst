export default function ProjectLabel({ num, className = "" }) {
  return (
    <span className={`project-label ${className}`.trim()}>
      PROJECT {num} <i aria-hidden="true">/</i> 项目 {num}
    </span>
  );
}
