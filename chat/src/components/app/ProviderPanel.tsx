"use client";

import type { ReactNode } from "react";

import { DockerIcon, OllamaIcon } from "@/components/icons/BrandIcons";
import type { ProviderId } from "@/lib/ai/providers-config";

export type ProviderInfo = {
  id: ProviderId;
  name: string;
  models: string[];
  defaultModel: string;
};

type ProviderPanelProps = {
  providers: ProviderInfo[];
  provider: string;
  model: string;
  customModel: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onCustomModelChange: (model: string) => void;
  onNewChat: () => void;
  messageCount: number;
};

const providerIcons: Record<string, ReactNode> = {
  ollama: <OllamaIcon size={16} />,
  openai: <span className="text-xs font-bold">AI</span>,
  anthropic: <span className="text-xs font-bold">A</span>,
  google: <span className="text-xs font-bold">G</span>,
};

export function ProviderPanel({
  providers,
  provider,
  model,
  customModel,
  onProviderChange,
  onModelChange,
  onCustomModelChange,
  onNewChat,
  messageCount,
}: ProviderPanelProps) {
  const activeProvider = providers.find((item) => item.id === provider);
  const useCustomModel = provider === "ollama" && customModel.trim().length > 0;

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Mission control
        </p>
        <p className="mt-1 text-sm text-muted">
          {messageCount === 0
            ? "Ready for launch"
            : `${messageCount} message${messageCount === 1 ? "" : "s"} in thread`}
        </p>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/40 hover:bg-accent-soft"
      >
        New chat
      </button>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Provider</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-accent">
            {providerIcons[provider] ?? <DockerIcon size={16} />}
          </span>
          <select
            value={provider}
            onChange={(event) => onProviderChange(event.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 py-2.5 pl-10 pr-3 text-foreground outline-none focus:border-accent/50"
          >
            {providers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Model</span>
        <select
          value={model}
          onChange={(event) => onModelChange(event.target.value)}
          className="rounded-xl border border-border bg-background/50 px-3 py-2.5 text-foreground outline-none focus:border-accent/50"
        >
          {(activeProvider?.models ?? [model]).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      {provider === "ollama" ? (
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted">Custom Ollama model (optional)</span>
          <input
            value={customModel}
            onChange={(event) => onCustomModelChange(event.target.value)}
            placeholder="e.g. llama3.2:latest"
            className="rounded-xl border border-border bg-background/50 px-3 py-2.5 text-foreground outline-none placeholder:text-muted focus:border-accent/50"
          />
        </label>
      ) : null}

      <div className="mt-auto rounded-xl border border-border bg-background/40 p-3 text-xs leading-6 text-muted">
        <p className="font-medium text-foreground">Active route</p>
        <p className="mt-1">
          {activeProvider?.name ?? provider} ·{" "}
          {useCustomModel ? customModel.trim() : model}
        </p>
        <p className="mt-2">
          Cloud keys live in <code className="text-foreground">.env.local</code>
          .
        </p>
      </div>
    </aside>
  );
}

export function getActiveModel(
  provider: string,
  model: string,
  customModel: string,
) {
  if (provider === "ollama" && customModel.trim()) {
    return customModel.trim();
  }

  return model;
}
