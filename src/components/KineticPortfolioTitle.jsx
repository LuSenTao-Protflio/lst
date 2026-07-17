import { useCallback, useEffect, useRef } from "react";
import "@fontsource-variable/roboto-flex/full.css";
import { calculateGlyphVariation } from "../utils/kineticTypography";

const restingVariation = { weight: 420, width: 88, italic: 0 };

export default function KineticPortfolioTitle({ lines, reduceMotion }) {
  const rootRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef(null);

  const writeVariation = useCallback((glyph, variation) => {
    glyph.style.setProperty("--glyph-weight", String(variation.weight));
    glyph.style.setProperty("--glyph-width", String(variation.width));
    glyph.style.setProperty("--glyph-italic", String(variation.italic));
  }, []);

  const resetGlyphs = useCallback(() => {
    rootRef.current?.querySelectorAll("[data-glyph]").forEach((glyph) => writeVariation(glyph, restingVariation));
  }, [writeVariation]);

  const updateGlyphs = useCallback(() => {
    if (!rootRef.current || !pointerRef.current) return;
    const { x, y } = pointerRef.current;

    rootRef.current.querySelectorAll("[data-glyph]").forEach((glyph) => {
      const rect = glyph.getBoundingClientRect();
      const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
      writeVariation(glyph, calculateGlyphVariation(distance));
    });
  }, [writeVariation]);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updateGlyphs();
    });
  }, [updateGlyphs]);

  useEffect(() => () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (reduceMotion) resetGlyphs();
  }, [reduceMotion, resetGlyphs]);

  const handlePointerMove = (event) => {
    if (reduceMotion) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    scheduleUpdate();
  };

  const handlePointerLeave = () => {
    pointerRef.current = null;
    resetGlyphs();
  };

  return (
    <h1
      ref={rootRef}
      className="prelude-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {lines.map((line) => (
        <span className="prelude-title-line" key={line}>
          {[...line].map((glyph, index) => (
            <span data-glyph key={`${glyph}-${index}`}>{glyph}</span>
          ))}
        </span>
      ))}
    </h1>
  );
}
