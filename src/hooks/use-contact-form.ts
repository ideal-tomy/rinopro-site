"use client";

import { useState, useCallback } from "react";
import { contactSchema, type ContactFormData } from "@/lib/validation/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

export function useContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitError, setSubmitError] = useState("");

  const submit = useCallback(async (data: ContactFormData): Promise<boolean> => {
    const merged = {
      ...data,
      message: (data.message ?? data.problemStatement ?? "").trim(),
    };
    const result = contactSchema.safeParse(merged);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.issues.forEach((e) => {
        const path = e.path[0] as keyof ContactFormData;
        if (path) fieldErrors[path] = e.message;
      });
      setErrors(fieldErrors);
      setSubmitError("");
      return false;
    }

    setErrors({});
    setSubmitError("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
          message?: string;
        } | null;
        const apiMessage =
          typeof payload?.message === "string" && payload.message.trim().length > 0
            ? payload.message.trim()
            : null;
        if (payload?.error === "mail_not_configured") {
          throw new Error(
            apiMessage ??
              "メール送信の設定が完了していません。しばらくしてから再度お試しください。"
          );
        }
        if (res.status === 429) {
          throw new Error("送信回数が多すぎます。しばらくしてから再度お試しください。");
        }
        throw new Error(apiMessage ?? "送信に失敗しました");
      }
      setStatus("success");
      return true;
    } catch (error) {
      setStatus("error");
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "送信に失敗しました。しばらくしてから再度お試しください。"
      );
      return false;
    }
  }, []);

  return { status, errors, submit, submitError };
}
