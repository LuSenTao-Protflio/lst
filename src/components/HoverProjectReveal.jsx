import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import projects from "../data/projects";
import { useLanguage } from "../i18n";

export default function HoverProjectReveal() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer:fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className="cover-project-reveal"
      onPointerLeave={() => setHovered(null)}
    >
      <div className="cover-project-list">
        {projects.map((project, index) => {
          const translated = t(`projects.${project.id}`);
          const active = hovered === index;
          const dimmed = hovered != null && !active;
          return (
            <motion.div
              key={project.id}
              className="cover-project-row-wrap"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.75 + index * 0.06 }}
            >
              <Link
                to={`/project/${project.id}`}
                className={`cover-project-row${active ? " is-active" : ""}${dimmed ? " is-dimmed" : ""}`}
                onPointerEnter={() => finePointer && setHovered(index)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
              >
                <span className="cover-project-title">{translated.title}</span>
              </Link>
              {finePointer && !reduceMotion && project.id !== "misc" && (
                <motion.div
                  className="cover-project-preview"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, x: active ? 0 : 10, scale: active ? 1 : 0.985 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                >
                  <img src={project.hero} alt="" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
