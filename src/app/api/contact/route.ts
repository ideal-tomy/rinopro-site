import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      { status: 429 }
    );
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

    const { name, email, message, triedExperience } = result.data;

    // TODO: メール送信 or Supabase保存
    // 現時点ではログのみ（本番ではResend, SendGrid, Supabase等に接続）
    console.info("[Contact]", {
      name,
      email,
      messageLength: message.length,
      triedExperience: triedExperience ?? null,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
