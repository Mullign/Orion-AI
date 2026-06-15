export type ProviderId = "ollama" | "openai" | "anthropic" | "google";

export type ProviderDefinition = {
  id: ProviderId;
  name: string;
  models: string[];
  defaultModel: string;
  apiKeyEnv?: string;
};

export const PROVIDER_DEFINITIONS: ProviderDefinition[] = [
  {
    id: "ollama",
    name: "Ollama",
    models: ["llama3.2", "mistral", "codellama", "qwen2.5", "phi4"],
    defaultModel: "llama3.2",
  },
  {
    id: "openai",
    name: "OpenAI",
    apiKeyEnv: "OPENAI_API_KEY",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o3-mini"],
    defaultModel: "gpt-4o-mini",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    models: [
      "claude-sonnet-4-20250514",
      "claude-3-5-haiku-20241022",
      "claude-3-5-sonnet-20241022",
    ],
    defaultModel: "claude-sonnet-4-20250514",
  },
  {
    id: "google",
    name: "Google",
    apiKeyEnv: "GOOGLE_GENERATIVE_AI_API_KEY",
    models: ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro"],
    defaultModel: "gemini-2.0-flash",
  },
];

export const DEFAULT_PROVIDER: ProviderId =
  process.env.AI_PROVIDER === "openai" ||
  process.env.AI_PROVIDER === "anthropic" ||
  process.env.AI_PROVIDER === "google" ||
  process.env.AI_PROVIDER === "ollama"
    ? process.env.AI_PROVIDER
    : "ollama";

export function getDefaultModelForProvider(providerId: ProviderId): string {
  const fromEnv = {
    ollama: process.env.OLLAMA_MODEL,
    openai: process.env.OPENAI_MODEL,
    anthropic: process.env.ANTHROPIC_MODEL,
    google: process.env.GOOGLE_MODEL,
  }[providerId];

  const definition = PROVIDER_DEFINITIONS.find(
    (provider) => provider.id === providerId,
  );

  return fromEnv ?? definition?.defaultModel ?? "llama3.2";
}

export function isProviderConfigured(provider: ProviderDefinition): boolean {
  if (!provider.apiKeyEnv) return true;
  return Boolean(process.env[provider.apiKeyEnv]?.trim());
}

export function getConfiguredProviders() {
  return PROVIDER_DEFINITIONS.filter(isProviderConfigured).map((provider) => ({
    id: provider.id,
    name: provider.name,
    models: provider.models,
    defaultModel: getDefaultModelForProvider(provider.id),
  }));
}
