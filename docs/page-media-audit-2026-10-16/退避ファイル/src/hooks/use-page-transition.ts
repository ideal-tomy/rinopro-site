"use client";

import { useState, useEffect } from "react";

export function usePageTransition() {
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsEntering(false);
  }, []);

  return { isEntering, isExiting, setIsExiting };
}
