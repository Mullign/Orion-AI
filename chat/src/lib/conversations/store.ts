import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { getDataDir, sanitizeUsername } from "@/lib/data-dir";

import type {
  ConversationSummary,
  StoredConversation,
  StoredMessage,
} from "./types";

function getUserConversationsDir(username: string): string {
  return path.join(
    getDataDir(),
    "users",
    sanitizeUsername(username),
    "conversations",
  );
}

function getConversationPath(username: string, id: string): string {
  return path.join(getUserConversationsDir(username), `${id}.json`);
}

function readConversationFile(
  username: string,
  id: string,
): StoredConversation | null {
  const filePath = getConversationPath(username, id);
  if (!existsSync(filePath)) return null;

  return JSON.parse(readFileSync(filePath, "utf8")) as StoredConversation;
}

export function listConversations(username: string): ConversationSummary[] {
  const dir = getUserConversationsDir(username);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const conversation = JSON.parse(
        readFileSync(path.join(dir, file), "utf8"),
      ) as StoredConversation;

      return {
        id: conversation.id,
        title: conversation.title,
        provider: conversation.provider,
        model: conversation.model,
        updatedAt: conversation.updatedAt,
        messageCount: conversation.messages.length,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function getConversation(
  username: string,
  id: string,
): StoredConversation | null {
  return readConversationFile(username, id);
}

export function createConversation(
  username: string,
  input?: Partial<
    Pick<StoredConversation, "provider" | "model" | "customModel" | "title">
  >,
): StoredConversation {
  const now = new Date().toISOString();
  const conversation: StoredConversation = {
    id: randomUUID(),
    title: input?.title ?? "New chat",
    provider: input?.provider ?? "ollama",
    model: input?.model ?? "llama3.2",
    customModel: input?.customModel ?? "",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };

  saveConversation(username, conversation);
  return conversation;
}

export function deriveTitle(messages: StoredMessage[]): string {
  const firstUser = messages.find((message) => message.role === "user");
  if (!firstUser?.text.trim()) return "New chat";

  const text = firstUser.text.trim().replace(/\s+/g, " ");
  return text.length > 48 ? `${text.slice(0, 48)}…` : text;
}

export function saveConversation(
  username: string,
  conversation: StoredConversation,
): StoredConversation {
  const dir = getUserConversationsDir(username);
  mkdirSync(dir, { recursive: true });

  const next: StoredConversation = {
    ...conversation,
    title:
      conversation.title === "New chat" && conversation.messages.length > 0
        ? deriveTitle(conversation.messages)
        : conversation.title,
    updatedAt: new Date().toISOString(),
  };

  writeFileSync(getConversationPath(username, next.id), JSON.stringify(next, null, 2));
  return next;
}

export function updateConversation(
  username: string,
  id: string,
  input: {
    messages: StoredMessage[];
    provider?: string;
    model?: string;
    customModel?: string;
    title?: string;
  },
): StoredConversation | null {
  const existing = readConversationFile(username, id);
  if (!existing) return null;

  return saveConversation(username, {
    ...existing,
    messages: input.messages,
    provider: input.provider ?? existing.provider,
    model: input.model ?? existing.model,
    customModel: input.customModel ?? existing.customModel,
    title: input.title ?? existing.title,
  });
}

export function deleteConversation(username: string, id: string): boolean {
  const filePath = getConversationPath(username, id);
  if (!existsSync(filePath)) return false;

  rmSync(filePath);
  return true;
}
