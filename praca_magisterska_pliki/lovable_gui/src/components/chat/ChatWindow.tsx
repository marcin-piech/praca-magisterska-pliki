import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "@/types/chat";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export function ChatWindow({ messages, isLoading, onSendMessage }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 glow-primary">
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Rozpocznij rozmowę
              </h2>
              <p className="text-muted-foreground max-w-md">
                Napisz wiadomość poniżej, aby rozpocząć rozmowę z AI.
                Możesz zadać dowolne pytanie lub poprosić o pomoc.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}
