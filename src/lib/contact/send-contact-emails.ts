import { Resend } from "resend";
import {
  buildAdminContactEmail,
  buildCustomerContactEmail,
  type ContactMailContext,
} from "@/lib/contact/mail-templates";

export type CustomerReplyStatus = "sent" | "skipped" | "failed";

export type SendContactEmailsResult =
  | { ok: true; mode: "sent" | "dev_logged"; customerReply: CustomerReplyStatus }
  | { ok: false; code: "mail_not_configured" | "send_failed"; message: string };

function previewAttachmentLog(content: string, max = 200): string {
  const oneLine = content.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max)}…`;
}

/** 未設定時は自動返信を送る。`false` のときだけ管理者通知のみにする。 */
export function isCustomerAutoReplyEnabled(): boolean {
  return process.env.CONTACT_CUSTOMER_AUTOREPLY?.trim().toLowerCase() !== "false";
}

/** Resend のエラー文には宛先アドレスが入り得るため、名前だけを残す */
function resendErrorSummary(error: { name?: string } | null) {
  return error ? { name: error.name } : null;
}

export async function sendContactEmails(
  ctx: ContactMailContext
): Promise<SendContactEmailsResult> {
  const adminMail = buildAdminContactEmail(ctx);
  const customerMail = buildCustomerContactEmail(ctx);
  const autoReplyEnabled = isCustomerAutoReplyEnabled();

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const adminTo = process.env.CONTACT_ADMIN_EMAIL?.trim();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[Contact] RESEND_API_KEY is not set in production");
      return {
        ok: false,
        code: "mail_not_configured",
        message: "メール送信が設定されていません。",
      };
    }
    // 下書き全文はローカル開発のログだけに出す
    if (process.env.NODE_ENV === "development") {
      console.info("[Contact] dev mode (no RESEND_API_KEY) — mail drafts:");
      console.info(
        "[Contact] admin mail draft\n--- subject:",
        adminMail.subject,
        "\n",
        adminMail.textBody
      );
      if (adminMail.attachments.length > 0) {
        console.info("[Contact] admin attachments:");
        for (const att of adminMail.attachments) {
          console.info(
            `  - ${att.filename} (${att.content.length} chars) preview:`,
            previewAttachmentLog(att.content)
          );
        }
      }
      if (autoReplyEnabled) {
        console.info(
          "[Contact] customer mail draft\n--- subject:",
          customerMail.subject,
          "\n",
          customerMail.textBody
        );
      } else {
        console.info("[Contact] customer auto-reply disabled (CONTACT_CUSTOMER_AUTOREPLY=false)");
      }
    }
    return {
      ok: true,
      mode: "dev_logged",
      customerReply: autoReplyEnabled ? "sent" : "skipped",
    };
  }

  if (!from || !adminTo) {
    console.error("[Contact] CONTACT_FROM_EMAIL or CONTACT_ADMIN_EMAIL is missing");
    return {
      ok: false,
      code: "mail_not_configured",
      message: "メール送信の宛先が設定されていません。",
    };
  }

  const resend = new Resend(apiKey);

  const adminAttachments =
    adminMail.attachments.length > 0
      ? adminMail.attachments.map((att) => ({
          filename: att.filename,
          content: Buffer.from(att.content, "utf-8"),
        }))
      : undefined;

  // 管理者通知が届かないときは自動返信も送らない（第三者宛だけが出る・再送で重複する、を防ぐ）
  try {
    const adminResult = await resend.emails.send({
      from,
      to: [adminTo],
      replyTo: ctx.email,
      subject: adminMail.subject,
      text: adminMail.textBody,
      attachments: adminAttachments,
    });
    if (adminResult.error) {
      console.error("[Contact] Resend admin error", resendErrorSummary(adminResult.error));
      return {
        ok: false,
        code: "send_failed",
        message: "メールの送信に失敗しました。",
      };
    }
  } catch (error) {
    console.error("[Contact] admin send exception", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      ok: false,
      code: "send_failed",
      message: "メールの送信に失敗しました。",
    };
  }

  if (!autoReplyEnabled) {
    return { ok: true, mode: "sent", customerReply: "skipped" };
  }

  try {
    const customerResult = await resend.emails.send({
      from,
      to: [ctx.email],
      subject: customerMail.subject,
      text: customerMail.textBody,
    });
    if (customerResult.error) {
      console.error(
        "[Contact] Resend customer auto-reply error",
        resendErrorSummary(customerResult.error)
      );
      return { ok: true, mode: "sent", customerReply: "failed" };
    }
  } catch (error) {
    console.error("[Contact] customer auto-reply exception", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return { ok: true, mode: "sent", customerReply: "failed" };
  }

  return { ok: true, mode: "sent", customerReply: "sent" };
}
