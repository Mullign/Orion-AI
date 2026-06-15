"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TerminalState = "open" | "minimized" | "closed";

const ORIGIN_PROMPT =
  "make a local AI workspace that runs on my hardware, keeps everything private, and looks like outer space";

const TYPE_MS = 40;
const HOLD_MS = 4000;

export function SetupTerminalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const [terminalState, setTerminalState] = useState<TerminalState>("open");
  const [typedText, setTypedText] = useState("");
  const [cursorOn, setCursorOn] = useState(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTypewriter = useCallback(() => {
    clearTimer();
    setTypedText("");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setTypedText(ORIGIN_PROMPT);
      return;
    }

    let index = 0;

    const typeNext = () => {
      if (index <= ORIGIN_PROMPT.length) {
        setTypedText(ORIGIN_PROMPT.slice(0, index));
        index += 1;
        timerRef.current = window.setTimeout(typeNext, TYPE_MS);
        return;
      }

      timerRef.current = window.setTimeout(() => {
        startTypewriter();
      }, HOLD_MS);
    };

    typeNext();
  }, [clearTimer]);

  useEffect(() => {
    if (terminalState !== "open") return;

    const blink = window.setInterval(() => setCursorOn((v) => !v), 530);
    return () => window.clearInterval(blink);
  }, [terminalState]);

  useEffect(() => {
    if (terminalState !== "open") {
      clearTimer();
      return;
    }

    const node = sectionRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      startTypewriter();
      return () => clearTimer();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startTypewriter();
        });
      },
      { threshold: 0.45 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [terminalState, startTypewriter, clearTimer]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-border px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm leading-7 text-muted">
          Orion was built from a carefully crafted one-shot AI prompt:
        </p>

        {terminalState === "closed" ? (
          <button
            type="button"
            onClick={() => setTerminalState("open")}
            className="term-reopen mt-8"
          >
            ✕ reopen terminal
          </button>
        ) : (
          <div
            className={`terminal-window mx-auto mt-8 max-w-2xl text-left ${
              terminalState === "minimized" ? "terminal-minimized" : ""
            }`}
          >
            <div className="terminal-titlebar">
              <span className="code-block text-xs text-muted">user@orion:~</span>
              <div className="terminal-winbtns">
                <button
                  type="button"
                  className="terminal-winbtn"
                  aria-label="Minimize terminal"
                  onClick={() =>
                    setTerminalState((state) =>
                      state === "minimized" ? "open" : "minimized",
                    )
                  }
                >
                  –
                </button>
                <button
                  type="button"
                  className="terminal-winbtn terminal-winbtn-close"
                  aria-label="Close terminal"
                  onClick={() => setTerminalState("closed")}
                >
                  ✕
                </button>
              </div>
            </div>

            {terminalState === "open" && (
              <pre className="terminal-body code-block">
                <span className="text-accent">{"> "}</span>
                {typedText}
                <span
                  className={`terminal-cursor ${cursorOn ? "opacity-100" : "opacity-0"}`}
                >
                  |
                </span>
              </pre>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
