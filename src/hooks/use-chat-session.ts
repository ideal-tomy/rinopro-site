"use client";

import { useMemo } from "react";
import type { UIMessage } from "ai";

const RALLY_THRESHOLD = 2;
const DEMO_PROMPT =
  "様々なサンプルやdemoを見て、利用可能なdemoや事例が見つかったら、あなたの希望は解決可能です。";

export function useChatSession(messages: UIMessage[]) {
  const userMessageCount = useMemo(() => {
    return messages.filter((m) => m.role === "user").length;
  }, [messages]);

  const shouldShowDemoPrompt = userMessageCount >= RALLY_THRESHOLD;

  return { userMessageCount, shouldShowDemoPrompt, demoPrompt: DEMO_PROMPT };
}
