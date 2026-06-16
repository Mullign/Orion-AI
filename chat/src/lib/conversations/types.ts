export type StoredMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};

export type StoredConversation = {
  id: string;
  title: string;
  provider: string;
  model: string;
  customModel: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
};

export type ConversationSummary = {
  id: string;
  title: string;
  provider: string;
  model: string;
  updatedAt: string;
  messageCount: number;
};
