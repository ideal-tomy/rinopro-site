import { Resend } from "resend";
import {
  buildAdminContactEmail,
  buildCustomerContactEmail,
  type ContactMailContext,
} from "@/lib/contact/mail-templates";

export type SendContactEmailsResult =
  | { ok: true; mode: "sent" | "dev_logged" }
  | { ok: false; code: "mail_not_configured" | "send_failed"; message: string };

export async function sendContactEmails(
  ctx: ContactMailContext
): Promise<SendContactEmailsResult> {
  const adminMail = buildAdminContactEmail(ctx);
  const customerMail = buildCustomerContactEmail(ctx);

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
    console.info("[Contact] dev mode (no RESEND_API_KEY) — mail drafts:");
    console.info(
      "[Contact] admin mail draft\n--- subject:",
      adminMail.subject,
      "\n",
      adminMail.textBody
    );
    console.info(
      "[Contact] customer mail draft\n--- subject:",
      customerMail.subject,
      "\n",
      customerMail.textBody
    );
    return { ok: true, mode: "dev_logged" };
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

  try {
    const [adminResult, customerResult] = await Promise.all([
      resend.emails.send({
        from,
        to: [adminTo],
        replyTo: ctx.email,
        subject: adminMail.subject,
        text: adminMail.textBody,
      }),
      resend.emails.send({
        from,
        to: [ctx.email],
        subject: customerMail.subject,
        text: customerMail.textBody,
      }),
    ]);

    if (adminResult.error || customerResult.error) {
      console.error("[Contact] Resend error", {
        admin: adminResult.error,
        customer: customerResult.error,
      });
      return {
        ok: false,
        code: "send_failed",
        message: "メールの送信に失敗しました。",
      };
    }

    return { ok: true, mode: "sent" };
  } catch (error) {
    console.error("[Contact] send exception", error);
    return {
      ok: false,
      code: "send_failed",
      message: "メールの送信に失敗しました。",
    };
  }
}
