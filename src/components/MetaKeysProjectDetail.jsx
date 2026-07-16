import { motion, useReducedMotion } from "framer-motion";
import ProjectLabel from "./ProjectLabel";

const reveal = (reduceMotion, delay = 0) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 24 },
  whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.55, delay },
});

function StoryCopy({ section, className = "", reduceMotion }) {
  return (
    <motion.div className={`metakeys-story-copy ${className}`.trim()} {...reveal(reduceMotion)}>
      <span>{section.label}</span>
      <h2>{section.title}</h2>
      <p>{section.body}</p>
    </motion.div>
  );
}

export default function MetaKeysProjectDetail({ project, projectT }) {
  const reduceMotion = useReducedMotion();
  const detail = projectT.detail;
  const images = project.images;

  return (
    <main className="metakeys-detail">
      <section className="metakeys-detail-intro">
        <motion.figure className="metakeys-detail-lead" {...reveal(reduceMotion)}>
          <img src={project.hero} alt={`${projectT.title} — packaging presentation`} />
        </motion.figure>

        <aside className="metakeys-detail-aside">
          <div className="metakeys-detail-aside-inner">
            <ProjectLabel num={project.num} />
            <div className="detail-tags">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <h1>{projectT.title}</h1>
            <p className="metakeys-detail-en">{projectT.en}</p>
            <p className="metakeys-detail-desc">{projectT.desc}</p>
            <dl className="metakeys-detail-meta">
              {detail.meta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      <section className="metakeys-story">
        <StoryCopy section={detail.sections[0]} reduceMotion={reduceMotion} />
        <div className="metakeys-portrait-pair">
          {[images[0], images[1]].map((src, index) => (
            <motion.figure key={src} {...reveal(reduceMotion, index * 0.06)}>
              <img src={src} alt={`MetaKeys brand concept ${index + 1}`} />
            </motion.figure>
          ))}
        </div>

        <StoryCopy section={detail.sections[1]} className="metakeys-story-copy-right" reduceMotion={reduceMotion} />
        <motion.figure className="metakeys-landscape" {...reveal(reduceMotion)}>
          <img src={images[3]} alt="MetaKeys lanyard application" />
        </motion.figure>

        <StoryCopy section={detail.sections[2]} reduceMotion={reduceMotion} />
        <div className="metakeys-system-grid">
          <motion.figure {...reveal(reduceMotion)}>
            <img src={images[4]} alt="MetaKeys modular visual system" />
          </motion.figure>
          <div>
            <motion.figure {...reveal(reduceMotion, 0.06)}>
              <img src={images[5]} alt="MetaKeys product presentation" />
            </motion.figure>
            <motion.figure {...reveal(reduceMotion, 0.12)}>
              <img src={images[6]} alt="MetaKeys product application" />
            </motion.figure>
          </div>
        </div>

        <div className="metakeys-square-pair">
          {[images[7], images[8]].map((src, index) => (
            <motion.figure key={src} {...reveal(reduceMotion, index * 0.06)}>
              <img src={src} alt={`MetaKeys 3D scene ${index + 1}`} />
            </motion.figure>
          ))}
        </div>
      </section>

    </main>
  );
}
