export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  generationTime?: number; // czas generowania w ms (tylko dla assistant)
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  model: string;
}

export const AI_MODELS = [
  { id: "gpt-scraped-cohere", name: "gpt-scraped-cohere", description: "Dla danych nieustrukturyzowanych" },
  { id: "claude-sql", name: "claude-sql", description: "Dla danych ustrukturyzowanych" },
] as const;

export type ModelId = (typeof AI_MODELS)[number]["id"];
