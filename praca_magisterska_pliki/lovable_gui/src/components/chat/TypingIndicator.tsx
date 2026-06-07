import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="w-9 h-9 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-chat-ai rounded-2xl rounded-tl-md px-4 py-4">
        <div className="typing-indicator flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground rounded-full" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full" />
          <span className="w-2 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </div>
  );
}
