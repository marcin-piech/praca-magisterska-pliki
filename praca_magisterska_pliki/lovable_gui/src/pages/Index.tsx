import { useState, useCallback } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useTheme } from "@/hooks/useTheme";
import { useWebhooks } from "@/hooks/useWebhooks";
import type { Message, ModelId } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

const SESSION_ID = (() => {
  const key = "n8n_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
})();

async function callWebhook(url: string, payload: Record<string, unknown>): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Webhook ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  }

  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const data = await res.json();
    if (typeof data === "string") return data;
    if (Array.isArray(data) && data.length) {
      const first = data[0];
      return (
        first?.output ?? first?.reply ?? first?.text ?? first?.message ?? JSON.stringify(first)
      );
    }
    return (
      data?.output ??
      data?.reply ??
      data?.text ??
      data?.message ??
      data?.response ??
      JSON.stringify(data)
    );
  }
  return await res.text();
}

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const { webhooks, setAll } = useWebhooks();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelId>("gpt-scraped-cohere");

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const startTime = performance.now();
      const url = webhooks[currentModel];

      try {
        if (!url) {
          throw new Error(
            "Brak skonfigurowanego webhooka dla tego systemu. Otwórz 'Webhooki n8n' w panelu bocznym."
          );
        }

        const reply = await callWebhook(url, {
          message: content,
          sessionId: SESSION_ID,
          model: currentModel,
        });

        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply || "(pusta odpowiedź)",
          timestamp: new Date(),
          generationTime: Math.round(performance.now() - startTime),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        toast({
          title: "Błąd webhooka",
          description: error instanceof Error ? error.message : "Nie udało się wysłać wiadomości.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, webhooks, currentModel]
  );

  const handleClearHistory = () => {
    setMessages([]);
    toast({
      title: "Historia wyczyszczona",
      description: "Wszystkie wiadomości zostały usunięte.",
    });
  };

  const handleModelChange = (model: ModelId) => {
    setCurrentModel(model);
    toast({
      title: "Model zmieniony",
      description: `Przełączono na: ${model}`,
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden chat-gradient">
      <ChatSidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        currentModel={currentModel}
        onModelChange={handleModelChange}
        onClearHistory={handleClearHistory}
        messageCount={messages.length}
        webhooks={webhooks}
        onSaveWebhooks={(next) => {
          setAll(next);
          toast({ title: "Zapisano", description: "Webhooki zostały zaktualizowane." });
        }}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Index;
