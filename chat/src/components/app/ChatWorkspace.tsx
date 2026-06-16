"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  getActiveModel,
  ProviderPanel,
  type ProviderInfo,
} from "@/components/app/ProviderPanel";
import {
  formatConversationTime,
  storedMessagesToUi,
  uiMessagesToStored,
} from "@/lib/conversations/messages";
import type { ConversationSummary, StoredMessage } from "@/lib/conversations/types";

const quickPrompts = [
  "Explain Orion in one paragraph.",
  "Write a bash script to check if Ollama is running.",
  "What are the benefits of local AI?",
  "Help me pick an Ollama model for coding.",
];

function getMessageText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

export function ChatWorkspace() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [provider, setProvider] = useState("ollama");
  const [model, setModel] = useState("llama3.2");
  const [customModel, setCustomModel] = useState("");
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const skipSaveRef = useRef(false);

  const { messages, sendMessage, setMessages, status, error, stop } = useChat();

  const isLoading = status === "submitted" || status === "streaming";
  const activeModel = getActiveModel(provider, model, customModel);

  const refreshConversations = useCallback(async () => {
    const response = await fetch("/api/conversations");
    if (!response.ok) return [];

    const data = (await response.json()) as {
      conversations: ConversationSummary[];
    };

    setConversations(data.conversations);
    return data.conversations;
  }, []);

  const loadConversation = useCallback(
    async (id: string) => {
      skipSaveRef.current = true;
      const response = await fetch(`/api/conversations/${id}`);

      if (!response.ok) {
        skipSaveRef.current = false;
        return;
      }

      const data = (await response.json()) as {
        conversation: {
          id: string;
          provider: string;
          model: string;
          customModel: string;
          messages: StoredMessage[];
        };
      };

      setConversationId(data.conversation.id);
      setProvider(data.conversation.provider);
      setModel(data.conversation.model);
      setCustomModel(data.conversation.customModel);
      setMessages(storedMessagesToUi(data.conversation.messages));
      window.setTimeout(() => {
        skipSaveRef.current = false;
      }, 0);
    },
    [setMessages],
  );

  const createConversation = useCallback(async () => {
    skipSaveRef.current = true;
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, model, customModel }),
    });

    if (!response.ok) {
      skipSaveRef.current = false;
      return null;
    }

    const data = (await response.json()) as {
      conversation: { id: string };
    };

    setConversationId(data.conversation.id);
    setMessages([]);
    await refreshConversations();
    window.setTimeout(() => {
      skipSaveRef.current = false;
    }, 0);

    return data.conversation.id;
  }, [customModel, model, provider, refreshConversations, setMessages]);

  useEffect(() => {
    fetch("/api/providers")
      .then((response) => response.json())
      .then((data: { providers: ProviderInfo[] }) => {
        setProviders(data.providers);

        if (data.providers.length > 0) {
          setProvider(data.providers[0].id);
          setModel(data.providers[0].defaultModel);
        }
      })
      .catch(() => {
        setProviders([
          {
            id: "ollama",
            name: "Ollama",
            models: ["llama3.2"],
            defaultModel: "llama3.2",
          },
        ]);
      });
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      setHistoryLoading(true);
      const items = await refreshConversations();

      if (!active) return;

      if (items.length > 0) {
        await loadConversation(items[0].id);
      } else {
        skipSaveRef.current = true;
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data = (await response.json()) as {
            conversation: { id: string };
          };
          setConversationId(data.conversation.id);
          setMessages([]);
          await refreshConversations();
        }

        skipSaveRef.current = false;
      }

      if (active) setHistoryLoading(false);
    })();

    return () => {
      active = false;
    };
    // Load saved history once on sign-in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProviderChange = (nextProvider: string) => {
    setProvider(nextProvider);
    const next = providers.find((item) => item.id === nextProvider);
    if (next) {
      setModel(next.defaultModel);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!conversationId || skipSaveRef.current || isLoading) return;

    const timer = window.setTimeout(async () => {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: uiMessagesToStored(messages),
          provider,
          model,
          customModel,
        }),
      });

      await refreshConversations();
    }, 600);

    return () => window.clearTimeout(timer);
  }, [
    conversationId,
    customModel,
    isLoading,
    messages,
    model,
    provider,
    refreshConversations,
  ]);

  const submitMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || !conversationId) return;

    sendMessage(
      { text: trimmed },
      { body: { provider, model: activeModel } },
    );
    setInput("");
  };

  const handleNewChat = async () => {
    await createConversation();
  };

  const handleSelectConversation = async (id: string) => {
    if (id === conversationId) return;
    await loadConversation(id);
  };

  const handleDeleteConversation = async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    const items = await refreshConversations();

    if (conversationId === id) {
      if (items.length > 0) {
        await loadConversation(items[0].id);
      } else {
        await createConversation();
      }
    }
  };

  return (
    <div className="grid flex-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <ProviderPanel
        providers={providers}
        provider={provider}
        model={model}
        customModel={customModel}
        onProviderChange={handleProviderChange}
        onModelChange={setModel}
        onCustomModelChange={setCustomModel}
        onNewChat={handleNewChat}
        messageCount={messages.length}
        conversations={conversations}
        activeConversationId={conversationId}
        historyLoading={historyLoading}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        formatConversationTime={formatConversationTime}
      />

      <div className="flex min-h-[70vh] flex-col gap-4">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Orion Chat</p>
              <p className="text-xs text-muted">
                {provider} · {activeModel}
                {historyLoading ? " · loading history…" : " · saved locally"}
              </p>
            </div>
            {isLoading ? (
              <button
                type="button"
                onClick={() => stop()}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
              >
                Stop
              </button>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center gap-6 py-8">
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">
                    What are we exploring today?
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Chats save to your machine and reload when you sign back in.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => submitMessage(prompt)}
                      className="rounded-full border border-border px-4 py-2 text-xs text-muted transition hover:border-accent/40 hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const text = getMessageText(message.parts);
                const isAssistant = message.role === "assistant";
                const isStreamingEmpty =
                  isAssistant && isLoading && text.length === 0;

                return (
                  <div
                    key={message.id}
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-7 whitespace-pre-wrap ${
                      message.role === "user"
                        ? "ml-auto border border-border bg-background/50 text-foreground"
                        : "mr-auto bg-accent/15 text-foreground"
                    }`}
                  >
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-accent">
                      {message.role === "user" ? "You" : "Orion"}
                    </p>
                    {isStreamingEmpty ? (
                      <p className="animate-pulse text-muted">Thinking…</p>
                    ) : (
                      text
                    )}
                  </div>
                );
              })
            )}

            {error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error.message.includes("fetch")
                  ? "Could not reach the chat API. Check your provider configuration and that the dev server is running."
                  : error.message}
              </p>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="border-t border-border p-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage(input);
            }}
          >
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent/50"
                value={input}
                placeholder="Transmit a message..."
                onChange={(event) => setInput(event.target.value)}
                disabled={isLoading || historyLoading}
              />
              <button
                type="submit"
                disabled={isLoading || historyLoading || !input.trim()}
                className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
