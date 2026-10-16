"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_STEP_MS = 500;

export function useDemoProcess(stepMs = DEFAULT_STEP_MS) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const reset = useCallback(() => {
    clearTimeouts();
    setLogs([]);
    setIsProcessing(false);
    setIsComplete(false);
  }, [clearTimeouts]);

  const start = useCallback(
    (steps: string[]) => {
      clearTimeouts();
      setLogs([]);
      setIsProcessing(true);
      setIsComplete(false);

      steps.forEach((step, index) => {
        const timeout = setTimeout(() => {
          setLogs((prev) => [...prev, step]);
          if (index === steps.length - 1) {
            setIsProcessing(false);
            setIsComplete(true);
          }
        }, (index + 1) * stepMs);
        timeoutRefs.current.push(timeout);
      });
    },
    [clearTimeouts, stepMs]
  );

  return { logs, isProcessing, isComplete, start, reset };
}
