import { useEffect, useRef } from "react";
import "@fontsource-variable/roboto-flex/full.css";
import { calculateGlyphVariation } from "../utils/kineticTypography";

const restingAxes = "'wght' 100, 'wdth' 25";

export default function KineticPortfolioTitle({ text, reduceMotion }) {
  const titleRef = useRef(null);
  const glyphsRef = useRef([]);
  const cursorRef = useRef(null);
  const smoothedCursorRef = useRef(null);

  useEffect(() => {
    const updateCursor = (point) => {
      cursorRef.current = { x: point.clientX, y: point.clientY };
    };
    const handleMouseMove = (event) => updateCursor(event);
    const handleTouchMove = (event) => updateCursor(event.touches[0]);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      glyphsRef.current.forEach((glyph) => {
        if (!glyph) return;
        glyph.style.fontVariationSettings = restingAxes;
        glyph.style.opacity = "1";
      });
      return undefined;
    }

    let frameId;
    const updateGlyphs = () => {
      const title = titleRef.current;
      if (!title) return;

      const titleRect = title.getBoundingClientRect();
      const restingPoint = { x: titleRect.left + titleRect.width / 2, y: titleRect.top + titleRect.height / 2 };
      const target = cursorRef.current ?? restingPoint;

      if (!smoothedCursorRef.current) smoothedCursorRef.current = { ...target };
      smoothedCursorRef.current.x += (target.x - smoothedCursorRef.current.x) / 15;
      smoothedCursorRef.current.y += (target.y - smoothedCursorRef.current.y) / 15;

      glyphsRef.current.forEach((glyph) => {
        if (!glyph) return;
        const rect = glyph.getBoundingClientRect();
        const distance = Math.hypot(smoothedCursorRef.current.x - (rect.left + rect.width / 2), smoothedCursorRef.current.y - (rect.top + rect.height / 2));
        const { weight, width, alpha } = calculateGlyphVariation(distance, titleRect.width / 2);
        glyph.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}`;
        glyph.style.opacity = String(alpha);
      });

      frameId = requestAnimationFrame(updateGlyphs);
    };

    frameId = requestAnimationFrame(updateGlyphs);
    return () => cancelAnimationFrame(frameId);
  }, [reduceMotion, text]);

  return (
    <h1 ref={titleRef} className="prelude-title" aria-label={text}>
      {text.split("").map((glyph, index) => (
        <span data-glyph key={`${glyph}-${index}`} ref={(element) => { glyphsRef.current[index] = element; }}>
          {glyph}
        </span>
      ))}
    </h1>
  );
}
