import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import LightRays from "./LightRays";

const title = "进入作品集";

export default function EntryTransition({ active, onComplete }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!active || !rootRef.current) return undefined;

    const root = rootRef.current;
    const characters = root.querySelectorAll(".entry-transition-char");
    const english = root.querySelector(".entry-transition-en");
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete });
      timeline
        .fromTo(root, { yPercent: 100 }, { yPercent: 0, duration: 0.26, ease: "power3.inOut" })
        .fromTo(
          characters,
          { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: "50% 0%" },
          { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, duration: 0.38, ease: "back.out(1.35)", stagger: 0.035 },
          "-=0.16",
        )
        .fromTo(english, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, "-=0.16");
    }, root);

    return () => context.revert();
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div ref={rootRef} className="entry-transition" role="status" aria-live="polite" aria-label="进入作品集">
      <div className="entry-transition-background" aria-hidden="true">
        <LightRays
          className="entry-transition-rays"
          raysOrigin="top-center"
          raysColor="#e6ff1a"
          raysSpeed={1.5}
          lightSpread={2.8}
          rayLength={5}
          pulsating
          fadeDistance={2}
          saturation={1.2}
          followMouse
          mouseInfluence={0.22}
          noiseAmount={0.5}
          distortion={0}
        />
      </div>
      <div className="entry-transition-glass" aria-hidden="true" />
      <div className="entry-transition-title" aria-hidden="true">
        {[...title].map((character, index) => (
          <span className="entry-transition-char" key={`${character}-${index}`}>{character}</span>
        ))}
      </div>
      <p className="entry-transition-en">ENTER PORTFOLIO</p>
    </div>
  );
}
