import { GitHubIcon } from "@/components/icons/BrandIcons";

const MULLIGAN_URL = "https://github.com/Mullign";

type MulliganCreditProps = {
  className?: string;
  compact?: boolean;
};

export function MulliganCredit({
  className = "",
  compact = false,
}: MulliganCreditProps) {
  return (
    <p className={`inline-flex items-center gap-2 text-sm text-muted ${className}`}>
      {compact ? (
        <>
          Built & designed by{" "}
          <a
            href={MULLIGAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition hover:text-accent"
          >
            <GitHubIcon size={14} />
            Mulligan
          </a>
        </>
      ) : (
        <>
          Website and application built and designed by{" "}
          <a
            href={MULLIGAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition hover:text-accent"
          >
            <GitHubIcon size={14} />
            Mulligan
          </a>
        </>
      )}
    </p>
  );
}
