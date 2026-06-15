"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
};

const reviews: Review[] = [
  {
    id: "generic-dev",
    quote:
      "I asked Orion to explain my Dockerfile at 2am. It did. My therapist asked why I was whispering to a llama. Worth it.",
    name: "Generic Dev Person",
    role: "Sr. Engineer, Probably Fine LLC",
    rating: 5,
  },
  {
    id: "karen",
    quote:
      "Finally, an AI that can't leak my stand-up notes to the cloud. My manager still found them, but that was a me problem.",
    name: "Karen From Engineering",
    role: "VP of Tabs vs Spaces, Tabs Inc.",
    rating: 5,
  },
  {
    id: "astronaut",
    quote:
      "Ran it on a laptop older than the Hubble. Slow? Yes. Private? Also yes. I felt like mission control anyway.",
    name: "Budget Astronaut",
    role: "Part-time Explorer, Garage NASA",
    rating: 4,
  },
  {
    id: "startup-chad",
    quote:
      "Switched from cloud API to Ollama mid-sprint. Saved money. Lost sleep. Gained the ability to say 'it's running locally' in meetings.",
    name: "Startup Chad",
    role: "Chief Vibes Officer, Stealth Mode Co.",
    rating: 5,
  },
  {
    id: "intern",
    quote: "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
    name: "Confused Intern",
    role: "Intern, First Week Anywhere",
    rating: 1,
  },
  {
    id: "chad-corporate",
    quote:
      "Anyway, as I was saying — best-in-class for talking to models on your own machine without sending API keys to the void.",
    name: "Chad Corporate",
    role: "Chief Executive Officer",
    rating: 5,
  },
  {
    id: "remote-worker",
    quote:
      "Used Orion to draft an out-of-office message. It suggested 'gone to low Earth orbit.' HR had questions. 10/10 would orbit again.",
    name: "Remote Worker #7",
    role: "Professional Email Avoider",
    rating: 5,
  },
  {
    id: "real-human",
    quote:
      "I'm a real person. This is a real testimonial. By a real person who definitely exists and loves local inference.",
    name: "Totally Real Human",
    role: "Verified Carbon Unit",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <p
      className="text-sm tracking-widest text-accent"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, starIndex) => (
        <span key={starIndex}>{starIndex < rating ? "★" : "☆"}</span>
      ))}
    </p>
  );
}

function AlienSpaceship() {
  return (
    <div aria-hidden className="ufo-ship pointer-events-none z-20">
      <svg width="56" height="32" viewBox="0 0 56 32" fill="none">
        <ellipse cx="28" cy="20" rx="22" ry="8" fill="#8b9cf6" opacity="0.9" />
        <path
          d="M12 18c6-10 26-10 32 0"
          stroke="#e8edf5"
          strokeWidth="2"
          fill="rgba(139,156,246,0.35)"
        />
        <circle cx="20" cy="16" r="2" fill="#e8edf5" />
        <circle cx="28" cy="14" r="2.5" fill="#e8edf5" />
        <circle cx="36" cy="16" r="2" fill="#e8edf5" />
        <ellipse cx="28" cy="28" rx="8" ry="3" fill="#56d4fa" opacity="0.45" />
      </svg>
    </div>
  );
}

export function ReviewsSection() {
  const [index, setIndex] = useState(0);
  const [ufoActive, setUfoActive] = useState(false);
  const review = reviews[index];
  const isIntern = review.id === "intern";
  const isRealHuman = review.id === "real-human";

  const goTo = (nextIndex: number) => {
    setIndex((nextIndex + reviews.length) % reviews.length);
  };

  const launchUfo = () => {
    setUfoActive(true);
  };

  useEffect(() => {
    if (!ufoActive) return;

    const timeout = window.setTimeout(() => setUfoActive(false), 7000);
    return () => window.clearTimeout(timeout);
  }, [ufoActive]);

  return (
    <section id="reviews" className="border-t border-border px-6 py-20 sm:py-28">
      <div className="relative mx-auto max-w-4xl overflow-visible">
        <p className="eyebrow mb-3 text-sm text-muted">Loved across the galaxy</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What our users are saying
        </h2>
        <p className="mt-4 text-sm text-muted">
          Completely real testimonials from entirely fictional people.*
        </p>

        {ufoActive ? (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
            <div className="ufo-orbit-track">
              <AlienSpaceship />
            </div>
          </div>
        ) : null}

        <article
          className={`panel-card relative mt-12 rounded-2xl border border-border p-8 sm:p-10 ${
            isIntern ? "review-panic-shake" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="rounded-full border border-border px-3 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
              aria-label="Previous review"
            >
              ‹
            </button>
            <span className="text-xs uppercase tracking-[0.2em] text-muted">
              {index + 1} / {reviews.length}
            </span>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="rounded-full border border-border px-3 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
              aria-label="Next review"
            >
              ›
            </button>
          </div>

          <blockquote
            className={`mt-8 text-lg leading-8 text-foreground sm:text-xl ${
              isIntern ? "review-text-shake" : ""
            }`}
          >
            &ldquo;{review.quote}&rdquo;
          </blockquote>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Stars rating={review.rating} />
              {isRealHuman ? (
                <button
                  type="button"
                  onClick={launchUfo}
                  className="mt-3 block text-left font-medium text-foreground underline decoration-accent/50 underline-offset-4 transition hover:text-accent"
                >
                  {review.name} 👽
                </button>
              ) : (
                <p className="mt-3 font-medium text-foreground">{review.name}</p>
              )}
              <p className="text-sm text-muted">{review.role}</p>
              {isRealHuman ? (
                <p className="mt-2 text-xs text-accent/80">
                  (Psst… click the name. Totally normal.)
                </p>
              ) : null}
              {isIntern ? (
                <p className="mt-2 text-xs text-red-400/80">
                  Intern status: panicking
                </p>
              ) : null}
            </div>
          </div>
        </article>

        <p className="mt-6 text-center text-xs text-muted">
          Swipe or tap the arrows for the next satisfied (or confused) user →
        </p>
      </div>
    </section>
  );
}
