import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { getLanguageModel, getSystemPrompt } from "@/lib/ai/get-model";
import {
  DEFAULT_PROVIDER,
  getConfiguredProviders,
  type ProviderId,
} from "@/lib/ai/providers-config";

export const maxDuration = 60;

type ChatRequestBody = {
  messages: UIMessage[];
  provider?: ProviderId;
  model?: string;
};

function isProviderId(value: string): value is ProviderId {
  return getConfiguredProviders().some((provider) => provider.id === value);
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const { messages, model } = body;
  const provider = body.provider ?? DEFAULT_PROVIDER;

  if (!isProviderId(provider)) {
    return Response.json(
      { error: `Provider "${provider}" is not available. Add the required API key.` },
      { status: 400 },
    );
  }

  try {
    const system = getSystemPrompt();
    const result = streamText({
      model: getLanguageModel(provider, model),
      system,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate a response.";

    return Response.json({ error: message }, { status: 500 });
  }
}
