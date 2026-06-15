import Image from "next/image";

import { GitHubIcon } from "@/components/icons/BrandIcons";
import { GITHUB_URL } from "@/lib/links";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div
          className="glow-ring mb-8 rounded-full p-2"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <Image
            src="/orion-logo.jpg"
            alt="Orion logo"
            width={120}
            height={120}
            priority
            className="invert"
          />
        </div>

        <p className="mb-6 text-sm text-muted">Yours among the stars.</p>

        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl sm:leading-[1.1]">
          Your own AI workspace,
          <br />
          running on your hardware.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Orion is a self-hosted interface for talking to language models through
          Ollama — chat, local inference, Docker deployment, and more. Local-first,
          privacy-first, and no cloud API keys required.
        </p>

        <p className="mt-4 max-w-xl text-sm leading-7 text-muted/80">
          (Bring your own models. Point it at localhost. Keep your data where it
          belongs.)
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#get-started"
            className="rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Get started
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-medium text-foreground transition hover:bg-accent-soft"
          >
            <GitHubIcon size={18} />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
