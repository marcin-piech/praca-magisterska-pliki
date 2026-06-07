import { Bot, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

function formatGenerationTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
            : "bg-chat-ai text-chat-ai-foreground rounded-tl-md"
        )}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <div className={cn(
          "flex items-center gap-2 mt-2 text-xs",
          isUser ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
        )}>
          <time>
            {message.timestamp.toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
          {!isUser && message.generationTime && (
            <span className="flex items-center gap-1 text-primary/70">
              <Zap className="w-3 h-3" />
              {formatGenerationTime(message.generationTime)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
