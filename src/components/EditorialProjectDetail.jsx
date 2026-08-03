import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ProjectLabel from "./ProjectLabel";
import ProjectContext from "./ProjectContext";

const reveal = (reduceMotion, delay = 0) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 24 },
  whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.55, delay },
});

function StoryCopy({ section, alignRight = false, reduceMotion }) {
  return (
    <motion.div className={`editorial-story-copy${alignRight ? " editorial-story-copy-right" : ""}`} {...reveal(reduceMotion)}>
      <span>{section.label}</span>
      <h2>{section.title}</h2>
      <p>{section.body}</p>
    </motion.div>
  );
}

function ImageFigure({ src, alt, reduceMotion, delay = 0 }) {
  if (!src) return null;
  return (
    <motion.figure {...reveal(reduceMotion, delay)}>
      <img src={src} alt={alt} />
    </motion.figure>
  );
}

export default function EditorialProjectDetail({ project, projectT }) {
  const reduceMotion = useReducedMotion();
  const detail = projectT.detail;
  let heroRemoved = false;
  const contentImages = project.images.filter((src) => {
    if (!heroRemoved && src === project.hero) {
      heroRemoved = true;
      return false;
    }
    return true;
  });

  const fullImage = contentImages[0];
  const pairImages = contentImages.slice(1, 3);
  const asymmetricImages = contentImages.slice(3, 5);
  const remainingImages = contentImages.slice(5);
  const defaultStoryLayout = [
    { sectionIndex: 0, layout: "wide", images: fullImage ? [fullImage] : [] },
    { sectionIndex: 1, layout: "pair", images: pairImages },
    { sectionIndex: 2, layout: "asymmetric", images: asymmetricImages },
    { layout: "remainder", images: remainingImages },
  ].filter((group) => group.images.length > 0);
  const storyLayout = project.storyLayout || defaultStoryLayout;

  return (
    <main className={`editorial-detail editorial-detail-${project.id}`}>
      <section className="editorial-detail-intro">
        <motion.figure className="editorial-detail-lead" {...reveal(reduceMotion)}>
          <img src={project.hero} alt={`${projectT.title} — project overview`} />
        </motion.figure>
        <aside className="editorial-detail-aside">
          <div className="editorial-detail-aside-inner">
            <ProjectLabel num={project.num} />
            <div className="detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h1>{projectT.title}</h1>
            <p className="editorial-detail-en">{projectT.en}</p>
            <p className="editorial-detail-desc">{projectT.desc}</p>
            <ProjectContext detail={detail} />
            <dl className="editorial-detail-meta">
              {detail.meta.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
            </dl>
          </div>
        </aside>
      </section>

      <section className="editorial-story">
        {storyLayout.map((group, groupIndex) => (
          <Fragment key={`${group.layout}-${groupIndex}`}>
            {Number.isInteger(group.sectionIndex) && (
              <StoryCopy
                section={detail.sections[group.sectionIndex]}
                alignRight={group.sectionIndex === 1}
                reduceMotion={reduceMotion}
              />
            )}
            <div className={`editorial-story-${group.layout} editorial-count-${group.images.length}${group.align ? ` editorial-align-${group.align}` : ""}`}>
              {group.images.map((src, index) => (
                <ImageFigure
                  key={src}
                  src={src}
                  alt={`${projectT.title} physical application ${groupIndex + 1}.${index + 1}`}
                  reduceMotion={reduceMotion}
                  delay={index * 0.06}
                />
              ))}
            </div>
          </Fragment>
        ))}
      </section>

    </main>
  );
}
