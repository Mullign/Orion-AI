import { GitHubIcon, OllamaIcon } from "@/components/icons/BrandIcons";
import { MulliganCredit } from "@/components/MulliganCredit";
import { GITHUB_URL, OLLAMA_URL } from "@/lib/links";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
          >
            <GitHubIcon size={18} />
            GitHub
          </a>
          <a
            href={OLLAMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
          >
            <OllamaIcon size={18} />
            Ollama
          </a>
        </div>

        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Orion · Built to run where you run.
        </p>
        <p className="mt-2 text-xs text-muted/70">
          No data left the galaxy.*
        </p>
        <div className="mt-6 flex justify-center">
          <MulliganCredit />
        </div>
      </div>
    </footer>
  );
}
