"use client";

import { useState, useCallback } from "react";
import { contactSchema, type ContactFormData } from "@/lib/validation/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

export function useContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const submit = useCallback(async (data: ContactFormData): Promise<boolean> => {
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((e) => {
        const path = e.path[0] as keyof ContactFormData;
        if (path) fieldErrors[path] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("送信に失敗しました");
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      setErrors({ message: "送信に失敗しました。しばらくしてから再度お試しください。" });
      return false;
    }
  }, []);

  return { status, errors, submit };
}
