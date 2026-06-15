"use client";

import { useState } from "react";

import {
  DockerIcon,
  NpmIcon,
  OllamaIcon,
} from "@/components/icons/BrandIcons";

const panels = [
  {
    id: "chat",
    label: "Chat",
    icon: <OllamaIcon size={16} />,
    title: "Local chat",
    description:
      "Talk to any Ollama model in a clean interface built for long conversations.",
    preview: (
      <div className="space-y-3 p-4 text-xs">
        <div className="ml-auto max-w-[85%] rounded-lg bg-accent/20 px-3 py-2 text-foreground">
          Summarize this README for me.
        </div>
        <div className="max-w-[85%] rounded-lg border border-border bg-background/60 px-3 py-2 text-muted">
          Orion connects to Ollama on your machine and streams the response locally…
        </div>
      </div>
    ),
  },
  {
    id: "models",
    label: "Models",
    icon: <OllamaIcon size={16} />,
    title: "Bring your own models",
    description:
      "Pull models with Ollama and switch by changing one environment variable.",
    preview: (
      <pre className="code-block overflow-x-auto p-4 text-xs leading-6 text-foreground/90">
        {`ollama pull llama3.2
ollama pull codellama

OLLAMA_MODEL=llama3.2`}
      </pre>
    ),
  },
  {
    id: "docker",
    label: "Docker",
    icon: <DockerIcon size={16} />,
    title: "Container-ready stack",
    description: "Spin up Orion and Ollama together with Docker Compose.",
    preview: (
      <pre className="code-block overflow-x-auto p-4 text-xs leading-6 text-foreground/90">
        {`cp .env.example .env
docker compose up -d --build
docker compose logs orion`}
      </pre>
    ),
  },
  {
    id: "setup",
    label: "Setup",
    icon: <NpmIcon size={16} />,
    title: "Clone and run",
    description:
      "Initialize Orion from your terminal — clone, install, and start locally or with Docker.",
    preview: (
      <pre className="code-block overflow-x-auto p-4 text-xs leading-6 text-foreground/90">
        {`git clone https://github.com/Mullign/Orion-AI.git
cd Orion-AI
cp .env.example .env
docker compose up -d --build`}
      </pre>
    ),
  },
  {
    id: "providers",
    label: "Providers",
    icon: <OllamaIcon size={16} />,
    title: "Ollama or cloud APIs",
    description:
      "Run models locally with Ollama, or bring your own keys for OpenAI, Anthropic, and Google.",
    preview: (
      <pre className="code-block overflow-x-auto p-4 text-xs leading-6 text-foreground/90">
        {`AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.2

# Optional cloud keys
OPENAI_API_KEY=
ANTHROPIC_API_KEY=`}
      </pre>
    ),
  },
];

export function PreviewSection() {
  const [activeId, setActiveId] = useState(panels[0].id);
  const active = panels.find((panel) => panel.id === activeId) ?? panels[0];

  return (
    <section id="preview" className="border-t border-border px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3 text-sm text-muted">See it in action</p>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Hover or tap to take a closer look
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Each panel highlights part of the Orion experience. Swipe through on
          mobile.
        </p>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {panels.map((panel) => (
            <button
              key={panel.id}
              type="button"
              onMouseEnter={() => setActiveId(panel.id)}
              onFocus={() => setActiveId(panel.id)}
              onClick={() => setActiveId(panel.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                activeId === panel.id
                  ? "border-accent bg-accent-soft text-foreground"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {panel.icon}
              {panel.label}
            </button>
          ))}
        </div>

        <article className="panel-card mt-6 overflow-hidden rounded-2xl border border-border">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-[220px] border-b border-border bg-background/40 lg:min-h-[280px] lg:border-b-0 lg:border-r">
              {active.preview}
            </div>
            <div className="p-8">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                {active.icon}
              </div>
              <h3 className="text-xl font-medium text-foreground">{active.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{active.description}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
