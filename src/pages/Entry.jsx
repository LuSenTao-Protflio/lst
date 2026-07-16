import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EntryTransition from "../components/EntryTransition";
import InteractiveCover from "../components/InteractiveCover";

export default function Entry() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [transitioning, setTransitioning] = useState(false);
  const transitionLock = useRef(false);
  const destinationRef = useRef("/portfolio");

  const finishEntry = useCallback(() => {
    navigate(destinationRef.current);
  }, [navigate]);

  const beginEntry = useCallback((destination = "/portfolio") => {
    if (transitionLock.current) return;
    transitionLock.current = true;
    destinationRef.current = destination;

    if (reduceMotion) {
      finishEntry();
      return;
    }

    setTransitioning(true);
  }, [finishEntry, reduceMotion]);

  return (
    <main className="entry-page">
      <InteractiveCover onEnter={beginEntry} />
      <EntryTransition active={transitioning} onComplete={finishEntry} />
    </main>
  );
}
