import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { createOllama } from "ai-sdk-ollama";

import {
  DEFAULT_PROVIDER,
  getDefaultModelForProvider,
  type ProviderId,
} from "@/lib/ai/providers-config";

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
});

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return createOpenAI({ apiKey });
}

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  return createAnthropic({ apiKey });
}

function getGoogle() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured.");
  }

  return createGoogleGenerativeAI({ apiKey });
}

export function getLanguageModel(
  providerId: ProviderId = DEFAULT_PROVIDER,
  modelId?: string,
): LanguageModel {
  const model = modelId ?? getDefaultModelForProvider(providerId);

  switch (providerId) {
    case "openai":
      return getOpenAI()(model);
    case "anthropic":
      return getAnthropic()(model);
    case "google":
      return getGoogle()(model);
    case "ollama":
    default:
      return ollama(model);
  }
}

export function getSystemPrompt(): string | undefined {
  const prompt = process.env.ORION_SYSTEM_PROMPT?.trim();
  return prompt || undefined;
}
