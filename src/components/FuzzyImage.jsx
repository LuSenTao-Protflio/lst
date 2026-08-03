import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function FuzzyImage({
  src,
  alt = "",
  baseIntensity = 0.2,
  hoverIntensity = 0.5,
  enableHover = true,
  className = "",
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return undefined;

    const context = canvas.getContext("2d");
    const sourceCanvas = document.createElement("canvas");
    const sourceContext = sourceCanvas.getContext("2d");
    if (!context || !sourceContext) return undefined;

    const image = new Image();
    image.decoding = "async";
    image.src = src;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let frameId = 0;
    let intensity = reduceMotion ? 0 : baseIntensity;
    let targetIntensity = intensity;

    const drawSource = () => {
      if (!image.complete || !image.naturalWidth) return;
      sourceContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      sourceContext.clearRect(0, 0, width, height);
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      sourceContext.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      sourceCanvas.width = canvas.width;
      sourceCanvas.height = canvas.height;
      drawSource();
    };

    const draw = () => {
      intensity += (targetIntensity - intensity) * 0.12;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      if (!image.complete || !image.naturalWidth) {
        frameId = requestAnimationFrame(draw);
        return;
      }

      const slices = Math.max(5, Math.round(10 + intensity * 26));
      const jitter = intensity * 11;
      const sliceHeight = height / slices;
      for (let index = 0; index < slices; index += 1) {
        const y = index * sliceHeight;
        const shift = reduceMotion ? 0 : (Math.random() - 0.5) * jitter;
        context.drawImage(sourceCanvas, 0, y * dpr, canvas.width, Math.ceil(sliceHeight * dpr) + 1, shift, y, width, sliceHeight + 1);
      }

      if (!reduceMotion) frameId = requestAnimationFrame(draw);
    };

    const onEnter = () => {
      if (enableHover && !reduceMotion) targetIntensity = hoverIntensity;
    };
    const onLeave = () => {
      if (enableHover && !reduceMotion) targetIntensity = baseIntensity;
    };
    const observer = new ResizeObserver(resize);

    observer.observe(wrapper);
    image.addEventListener("load", resize);
    wrapper.addEventListener("pointerenter", onEnter);
    wrapper.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    resize();
    frameId = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      image.removeEventListener("load", resize);
      wrapper.removeEventListener("pointerenter", onEnter);
      wrapper.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [baseIntensity, enableHover, hoverIntensity, reduceMotion, src]);

  return (
    <span ref={wrapperRef} className={`fuzzy-image${className ? ` ${className}` : ""}`}>
      <canvas ref={canvasRef} aria-label={alt} role="img" />
      <img className="fuzzy-image-fallback" src={src} alt="" aria-hidden="true" />
    </span>
  );
}
