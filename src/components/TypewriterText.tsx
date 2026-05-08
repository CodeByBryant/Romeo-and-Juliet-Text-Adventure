import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  className?: string;
  showCaret?: boolean;
}

export function TypewriterText({
  text,
  className,
  showCaret = false,
}: TypewriterTextProps) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setVisibleText(text);
      return;
    }

    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
      }
    }, 18);

    return () => window.clearInterval(intervalId);
  }, [text]);

  return (
    <p className={className}>
      {visibleText}
      {showCaret ? <span className="type-caret">_</span> : null}
    </p>
  );
}
