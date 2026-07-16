import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

const latinPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&+";
const chinesePool = "视觉传达设计作品品牌图形界面编排字体影像";

function scramble(text, resolved, pool) {
  return [...text].map((character, index) => {
    if (/\s/.test(character) || index < resolved) return character;
    return pool[Math.floor(Math.random() * pool.length)];
  }).join("");
}

export default function ScrambledText({ text, delay = 0, duration = 900, className = "" }) {
  const reduceMotion = useReducedMotion();
  const pool = useMemo(() => /[\u3400-\u9fff]/.test(text) ? chinesePool : latinPool, [text]);
  const [displayed, setDisplayed] = useState(() => scramble(text, 0, pool));

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(text);
      return undefined;
    }

    setDisplayed(scramble(text, 0, pool));
    let frame = 0;
    let startTime = 0;
    let animationFrame = 0;

    const timeout = window.setTimeout(() => {
      const tick = (time) => {
        if (!startTime) startTime = time;
        const progress = Math.min(1, (time - startTime) / duration);
        const resolved = Math.floor(progress * [...text].length);
        if (frame % 2 === 0 || progress === 1) {
          setDisplayed(progress === 1 ? text : scramble(text, resolved, pool));
        }
        frame += 1;
        if (progress < 1) animationFrame = window.requestAnimationFrame(tick);
      };
      animationFrame = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [delay, duration, pool, reduceMotion, text]);

  return (
    <span className={`scrambled-text${className ? ` ${className}` : ""}`} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
    </span>
  );
}
