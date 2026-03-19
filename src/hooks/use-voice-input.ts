"use client";

import { useState, useCallback } from "react";

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [enabled, setEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
    if (enabled && isListening) {
      setIsListening(false);
    }
  }, [enabled, isListening]);

  const startListening = useCallback(() => {
    if (!enabled) return;
    setIsListening(true);
    // Deepgram WebSocket integration - placeholder for Phase 7-4
    // Requires DEEPGRAM_API_KEY and browser MediaRecorder/WebSocket
  }, [enabled]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    enabled,
    isListening,
    toggle,
    startListening,
    stopListening,
  };
}
