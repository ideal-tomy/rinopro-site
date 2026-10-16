import { z } from "zod";

export const freeformInputSourceSchema = z.enum([
  "typed",
  "voice",
  "wizard_other",
  "draft_injection",
]);

export type FreeformInputSource = z.infer<typeof freeformInputSourceSchema>;

export const freeformInputEnvelopeSchema = z.object({
  source: freeformInputSourceSchema,
  rawText: z.string().min(1).max(4000),
  normalizedText: z.string().min(1).max(4000),
});

export type FreeformInputEnvelope = z.infer<typeof freeformInputEnvelopeSchema>;

export function normalizeFreeformText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function createFreeformInputEnvelope(args: {
  source: FreeformInputSource;
  rawText: string;
  normalizedText?: string;
}): FreeformInputEnvelope | null {
  const rawText = normalizeFreeformText(args.rawText);
  const normalizedText = normalizeFreeformText(args.normalizedText ?? args.rawText);
  if (!rawText || !normalizedText) return null;
  return {
    source: args.source,
    rawText,
    normalizedText,
  };
}

export function createPlainFreeformInput(
  source: Exclude<FreeformInputSource, "voice">,
  text: string
): FreeformInputEnvelope | null {
  return createFreeformInputEnvelope({
    source,
    rawText: text,
  });
}
