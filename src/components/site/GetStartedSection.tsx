import { CopyButton } from "@/components/CopyButton";
import {
  DockerIcon,
  GitHubIcon,
  OllamaIcon,
} from "@/components/icons/BrandIcons";
import { TechStackLogos } from "@/components/TechStackLogos";
import { GITHUB_CLONE_CMD, GITHUB_URL } from "@/lib/links";

const tags = [
  { label: "Self-hosted", icon: null },
  { label: "Ollama-powered", icon: <OllamaIcon size={14} /> },
  { label: "Local-first", icon: null },
  { label: "Docker-ready", icon: <DockerIcon size={14} /> },
  { label: "No telemetry", icon: null },
];

export function GetStartedSection() {
  return (
    <section id="get-started" className="border-t border-border px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-3 text-sm text-muted">Get started</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Orion is yours.
        </h2>
        <p className="mt-4 text-muted">
          It&apos;s open source and free. No sales team, no demo request — just
          clone and run.
        </p>

        <div className="terminal mt-10 flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-4 text-left sm:px-5">
          <code className="code-block flex items-center gap-2 overflow-x-auto text-xs leading-6 text-foreground sm:text-sm">
            <GitHubIcon size={16} className="shrink-0 text-muted" />$ {GITHUB_CLONE_CMD}
          </code>
          <CopyButton text={GITHUB_CLONE_CMD} />
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            <GitHubIcon size={18} />
            View on GitHub
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              {tag.icon}
              {tag.label}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <p className="mb-4 text-sm text-muted">Built with</p>
          <TechStackLogos />
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-left">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <OllamaIcon size={16} />
            Quick local setup
          </p>
          <pre className="code-block overflow-x-auto text-xs leading-6 text-muted">
            {`cp .env.example .env
docker compose up -d --build
docker compose logs orion

# Open http://127.0.0.1:7000/login`}
          </pre>
        </div>
      </div>
    </section>
  );
}
