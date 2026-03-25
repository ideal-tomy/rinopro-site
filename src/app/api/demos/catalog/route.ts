import { NextResponse } from "next/server";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

/**
 * クライアントの demo 推奨（intelligent-concierge）用。一覧ページと同一データソース。
 */
export async function GET() {
  try {
    const demos = await fetchDemosForDisplay();
    return NextResponse.json(demos);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
