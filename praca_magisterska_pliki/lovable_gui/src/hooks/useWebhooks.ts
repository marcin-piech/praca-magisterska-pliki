import { useEffect, useState, useCallback } from "react";
import type { ModelId } from "@/types/chat";

const STORAGE_KEY = "n8n_webhooks_v1";

export type WebhookMap = Record<ModelId, string>;

const defaultMap: WebhookMap = {
  "gpt-scraped-cohere": "",
  "claude-sql": "",
};

function load(): WebhookMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultMap;
    return { ...defaultMap, ...JSON.parse(raw) };
  } catch {
    return defaultMap;
  }
}

export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<WebhookMap>(defaultMap);

  useEffect(() => {
    setWebhooks(load());
  }, []);

  const updateWebhook = useCallback((model: ModelId, url: string) => {
    setWebhooks((prev) => {
      const next = { ...prev, [model]: url };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setAll = useCallback((next: WebhookMap) => {
    setWebhooks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  return { webhooks, updateWebhook, setAll };
}
