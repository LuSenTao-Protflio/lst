import { useEffect, useRef } from "react";
import "@fontsource-variable/roboto-flex/full.css";
import { calculateGlyphVariation } from "../utils/kineticTypography";

const restingAxes = "'wght' 100, 'wdth' 25, 'ital' 0";

export default function KineticPortfolioTitle({ text, reduceMotion, pointer }) {
  const titleRef = useRef(null);
  const glyphsRef = useRef([]);
  const pointerRef = useRef(pointer);
  const smoothedPointerRef = useRef(null);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const glyphs = glyphsRef.current;

    if (reduceMotion) {
      glyphs.forEach((glyph) => {
        glyph.style.fontVariationSettings = restingAxes;
      });
      return undefined;
    }

    let frameId;
    const updateGlyphs = () => {
      const title = titleRef.current;
      if (!title) return;

      const titleRect = title.getBoundingClientRect();
      const target = pointerRef.current ?? {
        x: titleRect.left + titleRect.width / 2,
        y: titleRect.top + titleRect.height / 2,
      };

      if (!smoothedPointerRef.current) {
        smoothedPointerRef.current = { ...target };
      }

      smoothedPointerRef.current.x += (target.x - smoothedPointerRef.current.x) / 15;
      smoothedPointerRef.current.y += (target.y - smoothedPointerRef.current.y) / 15;

      glyphsRef.current.forEach((glyph) => {
        if (!glyph) return;

        const rect = glyph.getBoundingClientRect();
        const distance = Math.hypot(
          smoothedPointerRef.current.x - (rect.left + rect.width / 2),
          smoothedPointerRef.current.y - (rect.top + rect.height / 2),
        );
        const { weight, width, italic } = calculateGlyphVariation(distance, titleRect.width / 2);
        glyph.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}, 'ital' ${italic}`;
      });

      frameId = requestAnimationFrame(updateGlyphs);
    };

    frameId = requestAnimationFrame(updateGlyphs);
    return () => cancelAnimationFrame(frameId);
  }, [reduceMotion, text]);

  return (
    <h1 ref={titleRef} className="prelude-title" aria-label={text}>
      {text.split("").map((glyph, index) => (
        <span
          data-glyph
          key={`${glyph}-${index}`}
          ref={(element) => {
            glyphsRef.current[index] = element;
          }}
        >
          {glyph}
        </span>
      ))}
    </h1>
  );
}
