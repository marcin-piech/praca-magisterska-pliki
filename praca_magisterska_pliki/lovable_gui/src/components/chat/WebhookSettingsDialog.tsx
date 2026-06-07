import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AI_MODELS, type ModelId } from "@/types/chat";
import type { WebhookMap } from "@/hooks/useWebhooks";

interface WebhookSettingsDialogProps {
  webhooks: WebhookMap;
  onSave: (next: WebhookMap) => void;
}

export function WebhookSettingsDialog({ webhooks, onSave }: WebhookSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<WebhookMap>(webhooks);

  useEffect(() => {
    if (open) setDraft(webhooks);
  }, [open, webhooks]);

  const handleSave = () => {
    onSave(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11 bg-secondary/50 border-border/50 hover:bg-secondary"
        >
          <Settings className="w-4 h-4" />
          <span>Webhooki n8n</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Konfiguracja webhooków n8n</DialogTitle>
          <DialogDescription>
            Wklej URL webhooka n8n dla każdego systemu RAG. Webhook musi akceptować POST z JSON
            <code className="mx-1 px-1 rounded bg-muted">{`{ message, sessionId, model }`}</code>
            i zwracać tekst lub JSON z polem <code className="px-1 rounded bg-muted">output</code>/<code className="px-1 rounded bg-muted">reply</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {AI_MODELS.map((m) => (
            <div key={m.id} className="space-y-2">
              <Label htmlFor={`wh-${m.id}`} className="text-sm">
                {m.name}
                <span className="ml-2 text-xs text-muted-foreground">{m.description}</span>
              </Label>
              <Input
                id={`wh-${m.id}`}
                type="url"
                placeholder="https://twoja-instancja.n8n.cloud/webhook/..."
                value={draft[m.id as ModelId] ?? ""}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, [m.id]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button onClick={handleSave}>Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
