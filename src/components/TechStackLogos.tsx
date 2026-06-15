import type { ReactNode } from "react";

import {
  DockerIcon,
  GitHubIcon,
  NextJsIcon,
  NpmIcon,
  OllamaIcon,
  ReactIcon,
  TypeScriptIcon,
} from "@/components/icons/BrandIcons";
import {
  DOCKER_URL,
  GITHUB_URL,
  NEXTJS_URL,
  OLLAMA_URL,
} from "@/lib/links";

type TechLogo = {
  name: string;
  href: string;
  icon: ReactNode;
};

const techLogos: TechLogo[] = [
  {
    name: "GitHub",
    href: GITHUB_URL,
    icon: <GitHubIcon size={22} />,
  },
  {
    name: "Ollama",
    href: OLLAMA_URL,
    icon: <OllamaIcon size={22} />,
  },
  {
    name: "Docker",
    href: DOCKER_URL,
    icon: <DockerIcon size={22} />,
  },
  {
    name: "Next.js",
    href: NEXTJS_URL,
    icon: <NextJsIcon size={22} />,
  },
  {
    name: "React",
    href: "https://react.dev",
    icon: <ReactIcon size={22} />,
  },
  {
    name: "TypeScript",
    href: "https://www.typescriptlang.org",
    icon: <TypeScriptIcon size={22} />,
  },
  {
    name: "npm",
    href: "https://www.npmjs.com",
    icon: <NpmIcon size={22} />,
  },
];

export function TechStackLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {techLogos.map((logo) => (
        <a
          key={logo.name}
          href={logo.href}
          target="_blank"
          rel="noopener noreferrer"
          title={logo.name}
          aria-label={logo.name}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted transition hover:border-accent/40 hover:text-foreground"
        >
          {logo.icon}
          <span>{logo.name}</span>
        </a>
      ))}
    </div>
  );
}
