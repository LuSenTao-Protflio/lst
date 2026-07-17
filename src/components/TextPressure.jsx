import { useCallback, useEffect, useRef, useState } from "react";
import "@fontsource-variable/roboto-flex/full.css";

const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const getAttr = (distance, maxDist, minVal, maxVal) => Math.max(minVal, maxVal - Math.abs((maxVal * distance) / maxDist) + minVal);
const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func(...args), delay); }; };

export default function TextPressure({ text = "Compressa", width = true, weight = true, italic = true, alpha = false, flex = true, stroke = false, scale = false, textColor = "#FFFFFF", className = "", minFontSize = 24, reduceMotion = false }) {
  const containerRef = useRef(null); const titleRef = useRef(null); const spansRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 }); const cursorRef = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize); const [scaleY, setScaleY] = useState(1); const [lineHeight, setLineHeight] = useState(1);
  const chars = text.split("");
  useEffect(() => {
    const handleMouseMove = (event) => { cursorRef.current = { x: event.clientX, y: event.clientY }; };
    const handleTouchMove = (event) => { const touch = event.touches[0]; cursorRef.current = { x: touch.clientX, y: touch.clientY }; };
    window.addEventListener('mousemove', handleMouseMove); window.addEventListener('touchmove', handleTouchMove, { passive: true });
    const rect = containerRef.current?.getBoundingClientRect(); if (rect) mouseRef.current = cursorRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('touchmove', handleTouchMove); };
  }, []);
  const setSize = useCallback(() => {
    const container = containerRef.current; const title = titleRef.current; if (!container || !title) return;
    const { width: containerW, height: containerH } = container.getBoundingClientRect(); setFontSize(Math.max(containerW / (chars.length / 2), minFontSize)); setScaleY(1); setLineHeight(1);
    requestAnimationFrame(() => { const textRect = titleRef.current?.getBoundingClientRect(); if (scale && textRect?.height) { const ratio = containerH / textRect.height; setScaleY(ratio); setLineHeight(ratio); } });
  }, [chars.length, minFontSize, scale]);
  useEffect(() => { const debouncedSetSize = debounce(setSize, 100); debouncedSetSize(); window.addEventListener("resize", debouncedSetSize); return () => window.removeEventListener("resize", debouncedSetSize); }, [setSize]);
  useEffect(() => {
    if (reduceMotion) return undefined; let rafId;
    const animate = () => { mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15; mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15; const titleRect = titleRef.current?.getBoundingClientRect();
      if (titleRect) { const maxDist = titleRect.width / 2; spansRef.current.forEach((span) => { if (!span) return; const rect = span.getBoundingClientRect(); const d = dist(mouseRef.current, { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }); const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100; const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400; const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0; const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1; const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`; if (span.style.fontVariationSettings !== settings) span.style.fontVariationSettings = settings; if (alpha && span.style.opacity !== alphaVal) span.style.opacity = alphaVal; }); }
      rafId = requestAnimationFrame(animate); };
    animate(); return () => cancelAnimationFrame(rafId);
  }, [alpha, italic, reduceMotion, weight, width]);
  const dynamicClassName = [className, flex ? "flex" : "", stroke ? "stroke" : ""].filter(Boolean).join(" ");
  return <div ref={containerRef} className="text-pressure-container"><h1 ref={titleRef} className={`text-pressure-title ${dynamicClassName}`} style={{ fontSize, lineHeight, transform: `scale(1, ${scaleY})`, fontFamily: "Roboto Flex", color: textColor }}>{chars.map((char, index) => <span key={`${char}-${index}`} ref={(element) => { spansRef.current[index] = element; }} data-char={char}>{char}</span>)}</h1></div>;
}
