"use client";

import { useMemo } from "react";
import type { UIMessage } from "ai";

const RALLY_THRESHOLD = 2;
const DEMO_PROMPT =
  "ツールdemoや体験ページで近いものが見つかれば、あなたの希望は実現しやすくなります。まずは触ってイメージを合わせてみてください。";

export function useChatSession(messages: UIMessage[]) {
  const userMessageCount = useMemo(() => {
    return messages.filter((m) => m.role === "user").length;
  }, [messages]);

  const shouldShowDemoPrompt = userMessageCount >= RALLY_THRESHOLD;

  return { userMessageCount, shouldShowDemoPrompt, demoPrompt: DEMO_PROMPT };
}
