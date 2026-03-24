import { NextResponse } from "next/server";
import {
  buildAdminContactEmail,
  buildCustomerContactEmail,
} from "@/lib/contact/mail-templates";
import { contactSchema } from "@/lib/validation/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, message, triedExperience, estimateSnapshot } = result.data;

    const adminMail = buildAdminContactEmail({
      name,
      email,
      message,
      triedExperience,
      estimateSnapshot: estimateSnapshot ?? null,
    });
    const customerMail = buildCustomerContactEmail({
      name,
      email,
      message,
      triedExperience,
      estimateSnapshot: estimateSnapshot ?? null,
    });

    // TODO: Resend / SendGrid 等で送信。現状はログで運用側が把握できる形にする。
    console.info("[Contact] inbound", {
      name,
      email,
      messageLength: message.length,
      triedExperience: triedExperience ?? null,
      hasEstimateSnapshot: Boolean(estimateSnapshot),
    });
    console.info("[Contact] admin mail draft\n--- subject:", adminMail.subject, "\n", adminMail.textBody);
    console.info(
      "[Contact] customer mail draft\n--- subject:",
      customerMail.subject,
      "\n",
      customerMail.textBody
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
