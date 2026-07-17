import { motion, useReducedMotion } from "framer-motion";
import ProjectLabel from "./ProjectLabel";

const reveal = (reduceMotion, delay = 0) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 24 },
  whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.5, delay },
});

export default function WoofProjectDetail({ project, projectT }) {
  const reduceMotion = useReducedMotion();
  const detail = projectT.detail;
  const detailImages = project.detailImages || project.images;
  const detailImageAlts = project.detailImageAlts || [];

  return (
    <main className="woof-detail">
      <section className="woof-exhibition">
        <div className="woof-image-stream" aria-label={`${projectT.title} project images`}>
          {detailImages.map((src, index) => (
            <motion.figure key={src} {...reveal(reduceMotion, Math.min(index * 0.035, 0.14))}>
              <img
                src={src}
                alt={detailImageAlts[index] || `${projectT.title} — ${index + 1}`}
                loading={index > 1 ? "lazy" : "eager"}
              />
            </motion.figure>
          ))}
        </div>

        <aside className="woof-explanation">
          <div className="woof-explanation-sticky">
            <ProjectLabel num={project.num} />
            <div className="detail-tags">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <h1>{projectT.title}</h1>
            <p className="woof-detail-en">{projectT.en}</p>
            <p className="woof-detail-desc">{projectT.desc}</p>

            <dl className="woof-detail-meta">
              {detail.meta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="woof-explanation-sections">
              {detail.sections.map((section) => (
                <section key={section.label}>
                  <span>{section.label}</span>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
