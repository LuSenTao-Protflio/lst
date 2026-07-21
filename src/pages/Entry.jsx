import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EntryTransition from "../components/EntryTransition";
import InteractiveCover from "../components/InteractiveCover";
import usePortfolioReducedMotion from "../hooks/usePortfolioReducedMotion";

export default function Entry() {
  const navigate = useNavigate();
  const reduceMotion = usePortfolioReducedMotion();
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
      <InteractiveCover onEnter={beginEntry} isExiting={transitioning} />
      <EntryTransition active={transitioning} onComplete={finishEntry} />
    </main>
  );
}
