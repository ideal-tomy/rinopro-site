import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";
import { isContactSyntheticEstimateSnapshot } from "@/lib/contact/build-contact-synthetic-snapshot";

export type ContactMailAttachment = {
  filename: string;
  content: string;
};

function safeFilenamePart(title: string, maxLen = 36): string {
  const cleaned = title
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, maxLen);
  return cleaned || "案件";
}

function formatDateYmd(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  }
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

/** 管理者メール用添付（要件定義 MD + スナップショット JSON） */
export function buildAdminContactAttachments(
  snapshot: EstimateSnapshot | null | undefined
): ContactMailAttachment[] {
  if (!snapshot || isContactSyntheticEstimateSnapshot(snapshot)) {
    return [];
  }

  const titlePart = safeFilenamePart(snapshot.ai.requirementTitle);
  const datePart = formatDateYmd(snapshot.createdAt);

  return [
    {
      filename: `要件定義_${titlePart}.md`,
      content: snapshot.requirementDocMarkdown,
    },
    {
      filename: `見積スナップショット_${datePart}.json`,
      content: JSON.stringify(snapshot, null, 2),
    },
  ];
}

export function formatAttachmentListForBody(
  attachments: ContactMailAttachment[]
): string {
  if (attachments.length === 0) {
    return "（添付なし）";
  }
  return attachments.map((a) => `・${a.filename}`).join("\n");
}
