import { Moon, Sun, Trash2, Bot, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AI_MODELS, type ModelId } from "@/types/chat";
import { WebhookSettingsDialog } from "./WebhookSettingsDialog";
import type { WebhookMap } from "@/hooks/useWebhooks";

interface ChatSidebarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  currentModel: ModelId;
  onModelChange: (model: ModelId) => void;
  onClearHistory: () => void;
  messageCount: number;
  webhooks: WebhookMap;
  onSaveWebhooks: (next: WebhookMap) => void;
}

export function ChatSidebar({
  theme,
  onToggleTheme,
  currentModel,
  onModelChange,
  onClearHistory,
  messageCount,
  webhooks,
  onSaveWebhooks,
}: ChatSidebarProps) {
  const selectedModel = AI_MODELS.find((m) => m.id === currentModel);

  return (
    <aside className="w-72 h-full glass border-r border-border/50 flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-primary">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">
              Chatbot Marcin Piech
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by Lovable and n8n
            </p>
          </div>
        </div>
      </div>

      {/* Model Selector */}
      <div className="p-4 border-b border-border/50">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          SYSTEM RAG
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12 bg-secondary/50 border-border/50 hover:bg-secondary"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="text-sm font-medium">
                    {selectedModel?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedModel?.description}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start">
            {AI_MODELS.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className="flex flex-col items-start py-3 cursor-pointer"
              >
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-muted-foreground">
                  {model.description}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="p-4 border-t border-border/50">
        <div className="bg-secondary/30 rounded-lg p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Wiadomości w sesji
          </div>
          <div className="text-2xl font-bold text-foreground">
            {messageCount}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2 border-t border-border/50">
        <WebhookSettingsDialog webhooks={webhooks} onSave={onSaveWebhooks} />
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11 bg-secondary/50 border-border/50 hover:bg-secondary"
          onClick={onToggleTheme}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4" />
              <span>Tryb jasny</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span>Tryb ciemny</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11 bg-secondary/50 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          onClick={onClearHistory}
          disabled={messageCount === 0}
        >
          <Trash2 className="w-4 h-4" />
          <span>Wyczyść historię</span>
        </Button>
      </div>
    </aside>
  );
}
