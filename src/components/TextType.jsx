import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function TextType({
  text = "",
  texts,
  active = true,
  typingSpeed = 32,
  startDelay = 0,
  showCursor = true,
  cursorCharacter = "_",
  cursorBlinkDuration = 0.5,
  className = "",
}) {
  const reduceMotion = useReducedMotion();
  const content = useMemo(() => {
    if (typeof text === "string" && text) return text;
    if (Array.isArray(text)) return text[0] ?? "";
    if (Array.isArray(texts)) return texts[0] ?? "";
    return "";
  }, [text, texts]);
  const characters = useMemo(() => Array.from(content), [content]);
  const [visibleCount, setVisibleCount] = useState(reduceMotion ? characters.length : 0);
  const [status, setStatus] = useState(reduceMotion ? "complete" : "waiting");

  useEffect(() => {
    if (reduceMotion) {
      setVisibleCount(characters.length);
      setStatus("complete");
      return undefined;
    }

    setVisibleCount(0);
    setStatus("waiting");
    if (!active) return undefined;

    let typingTimer = 0;
    const startTimer = window.setTimeout(() => {
      if (characters.length === 0) {
        setStatus("complete");
        return;
      }

      setStatus("typing");
      let nextCount = 0;
      const typeNextCharacter = () => {
        nextCount += 1;
        setVisibleCount(nextCount);

        if (nextCount >= characters.length) {
          setStatus("complete");
          return;
        }

        typingTimer = window.setTimeout(typeNextCharacter, typingSpeed);
      };

      typeNextCharacter();
    }, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(typingTimer);
    };
  }, [active, characters, reduceMotion, startDelay, typingSpeed]);

  const displayedText = characters.slice(0, visibleCount).join("");
  const cursorVisible = showCursor && status === "typing";

  return (
    <span
      className={`text-type${className ? ` ${className}` : ""}`}
      aria-label={content}
    >
      <span className="text-type-reserve" aria-hidden="true">{content}</span>
      <span className="text-type-output" aria-hidden="true">
        {displayedText}
        {cursorVisible && (
          <span
            className="text-type-cursor"
            style={{ "--text-type-cursor-duration": `${cursorBlinkDuration}s` }}
          >
            {cursorCharacter}
          </span>
        )}
      </span>
    </span>
  );
}
