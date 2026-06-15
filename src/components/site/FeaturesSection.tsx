import type { ReactNode } from "react";

import {
  DockerIcon,
  NextJsIcon,
  NpmIcon,
  OllamaIcon,
} from "@/components/icons/BrandIcons";

const features: {
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    title: "Local chat",
    icon: <OllamaIcon size={22} className="text-accent" />,
    description:
      "Multi-turn conversations streamed from models running on your machine through Ollama.",
  },
  {
    title: "Model flexibility",
    icon: <OllamaIcon size={22} className="text-accent" />,
    description:
      "Switch between Llama, Mistral, Qwen, CodeLlama, and any model you pull into Ollama.",
  },
  {
    title: "Docker stack",
    icon: <DockerIcon size={22} className="text-accent" />,
    description:
      "Run Orion and Ollama together in containers for a consistent setup anywhere.",
  },
  {
    title: "Private by default",
    icon: <OllamaIcon size={22} className="text-accent" />,
    description:
      "Runs against your own endpoints. No telemetry, no subscription, no data leaving your network.",
  },
  {
    title: "Simple install",
    icon: <NpmIcon size={22} className="text-accent" />,
    description:
      "Clone, copy .env, and run docker compose up — Orion handles the rest.",
  },
  {
    title: "Multi-provider",
    icon: <NextJsIcon size={22} className="text-accent" />,
    description:
      "Use Ollama locally or connect cloud providers with your own API keys when you need them.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3 text-sm text-muted">Everything, self-hosted</p>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          One app, focused capabilities
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Started as a local AI chat. Built into a clean workspace around Ollama.
          Each piece runs on hardware you control.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="panel-card rounded-2xl border border-border p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-7 text-muted">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
