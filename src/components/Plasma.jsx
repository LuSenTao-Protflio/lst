import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;
  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w / d * o.xyz) {
    p = z * normalize(vec3(C - .5 * r, r.y));
    p.z -= 4.;
    S = p;
    d = p.y - T;
    p.x += .4 * (1. + p.y) * sin(d + p.x * .1) * cos(.34 * d + p.x * .05);
    Q = p.xz *= mat2(cos(p.y + vec4(0, 11, 33, 0) - T));
    z += d = abs(sqrt(length(Q * Q)) - .25 * (5. + S.y)) / 3. + 8e-4;
    o = 1. + sin(S.y + p.z * .5 + S.z - length(S - p) + vec4(2, 1, 0, 8));
  }
  o.xyz = tanh(O / 1e4);
}

bool finite1(float x) { return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c) {
  return vec3(finite1(c.r) ? c.r : 0.0, finite1(c.g) ? c.g : 0.0, finite1(c.b) ? c.b : 0.0);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  fragColor = vec4(finalColor, length(rgb) * uOpacity);
}`;

export default function Plasma({
  color = "#ffffff",
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      return undefined;
    }

    const gl = renderer.gl;
    if (!gl) return undefined;

    const canvas = gl.canvas;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const customColor = color ? hexToRgb(color) : [1, 1, 1];
    const directionMultiplier = direction === "reverse" ? -1 : 1;
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColor) },
        uUseCustomColor: { value: color ? 1 : 0 },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1 : 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
    };

    const handlePointerMove = (event) => {
      if (!mouseInteractive) return;
      const rect = container.getBoundingClientRect();
      program.uniforms.uMouse.value[0] = event.clientX - rect.left;
      program.uniforms.uMouse.value[1] = rect.height - (event.clientY - rect.top);
    };

    let frame = 0;
    let contextLost = false;
    let visible = true;
    const startedAt = performance.now();
    const loop = (time) => {
      if (contextLost || !visible) return;
      const elapsed = (time - startedAt) * 0.001;
      if (direction === "pingpong") {
        const duration = 10;
        const segment = elapsed % duration;
        const forward = Math.floor(elapsed / duration) % 2 === 0;
        const progress = segment / duration;
        const smooth = progress * progress * (3 - 2 * progress);
        program.uniforms.iTime.value = (forward ? smooth : 1 - smooth) * duration;
      } else {
        program.uniforms.iTime.value = elapsed;
      }
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    const handleContextLost = (event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
    };
    const handleContextRestored = () => {
      contextLost = false;
      if (visible) frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(setSize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (!visible) cancelAnimationFrame(frame);
      if (visible && !wasVisible && !contextLost) frame = requestAnimationFrame(loop);
    });

    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    if (mouseInteractive) container.addEventListener("pointermove", handlePointerMove, { passive: true });
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    setSize();
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (mouseInteractive) container.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [color, direction, mouseInteractive, opacity, scale, speed]);

  return <div ref={containerRef} className={`plasma-container ${className}`.trim()} aria-hidden="true" />;
}
