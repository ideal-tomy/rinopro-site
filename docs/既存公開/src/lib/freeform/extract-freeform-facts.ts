import type { FactEnvelope } from "@/lib/facts/canonical-facts";
import { FACT_OWNER_MAP } from "@/lib/facts/canonical-facts";
import type { FreeformInputEnvelope } from "@/lib/freeform/freeform-input";
import { summarizeFreeformMemo } from "@/lib/freeform/freeform-memo";

function pushEnvelope(
  target: FactEnvelope[],
  next: FactEnvelope
): void {
  const exists = target.some(
    (item) => item.key === next.key && item.value === next.value && item.state === next.state
  );
  if (!exists) target.push(next);
}

function createCandidateEnvelope(
  key: FactEnvelope["key"],
  value: string,
  source: string,
  state: FactEnvelope["state"] = "candidate"
): FactEnvelope | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return {
    key,
    state,
    owner: key in FACT_OWNER_MAP ? FACT_OWNER_MAP[key as keyof typeof FACT_OWNER_MAP] : "visitorJourney",
    value: trimmed,
    source,
  };
}

function detectProductCategory(text: string): string | null {
  if (/(ホームページ|webサイト|サイト|lp|採用サイト|ec|ネットショップ)/i.test(text)) {
    return "お客様との接点づくり";
  }
  if (/(顧客管理|crm|案件管理|問い合わせ管理|予約管理|受付管理)/i.test(text)) {
    return "顧客・案件・受付の管理";
  }
  if (/(自動化|効率化|シフト|在庫|日報|勤怠|ワークフロー|承認)/i.test(text)) {
    return "社内作業の効率化";
  }
  if (/(予約|受付|問い合わせ窓口|チャットボット|faq)/i.test(text)) {
    return "予約・受付の自動化";
  }
  if (/(マッチング|新規サービス|アプリ|saas|プラットフォーム)/i.test(text)) {
    return "独自サービス開発";
  }
  return null;
}

function detectProductArchetype(text: string): string | null {
  if (/(問い合わせ|受付).*(自動|効率)/i.test(text) || /(自動|効率).*(問い合わせ|受付)/i.test(text)) {
    return "問い合わせ・受付自動化";
  }
  if (/(予約|予約受付)/i.test(text)) return "予約システム";
  if (/(顧客管理|crm|案件管理)/i.test(text)) return "顧客・案件管理ツール";
  if (/(在庫管理|在庫)/i.test(text)) return "在庫管理システム";
  if (/(シフト|勤怠)/i.test(text)) return "シフト・勤怠管理";
  if (/(社内チャットボット|チャットボット|faqボット)/i.test(text)) return "社内チャットボット";
  if (/(ナレッジ|社内検索|検索|faq|マニュアル)/i.test(text)) return "社内ナレッジ検索";
  if (/(ホームページ|webサイト|サイト|lp|採用サイト)/i.test(text)) return "Webサイト・LP";
  if (/(レポート|報告書|日報).*(自動|作成)/i.test(text) || /(自動|生成).*(レポート|報告書|日報)/i.test(text)) {
    return "レポート自動作成";
  }
  return null;
}

function detectTargetSummary(text: string): string | null {
  const roleMatches = [
    /営業/i.test(text) ? "営業" : "",
    /経理/i.test(text) ? "経理" : "",
    /採用/i.test(text) ? "採用" : "",
    /現場/i.test(text) ? "現場" : "",
    /(顧客|お客様|会員|ユーザー)/i.test(text) ? "顧客対応" : "",
    /(社内|社員|スタッフ)/i.test(text) ? "社内利用" : "",
  ].filter(Boolean);
  if (roleMatches.length === 0) return null;
  return roleMatches.join(" / ");
}

function detectTimeline(text: string): string | null {
  if (/(至急|急ぎ|なるべく早く|すぐ)/i.test(text)) return "できるだけ早く";
  if (/(今月|来月|1ヶ月|一ヶ月)/i.test(text)) return "1ヶ月前後";
  if (/(3ヶ月|三ヶ月|四半期|今期)/i.test(text)) return "3ヶ月前後";
  if (/(半年|6ヶ月|六ヶ月)/i.test(text)) return "半年以内";
  if (/(今年中|年内)/i.test(text)) return "年内";
  return null;
}

function detectIntegration(text: string): string | null {
  const tools = [
    /line/i.test(text) ? "LINE" : "",
    /slack/i.test(text) ? "Slack" : "",
    /chatwork/i.test(text) ? "Chatwork" : "",
    /notion/i.test(text) ? "Notion" : "",
    /kintone/i.test(text) ? "kintone" : "",
    /salesforce/i.test(text) ? "Salesforce" : "",
    /freee/i.test(text) ? "freee" : "",
    /(spreadsheet|スプレッドシート)/i.test(text) ? "スプレッドシート" : "",
    /excel/i.test(text) ? "Excel" : "",
    /csv/i.test(text) ? "CSV" : "",
    /api/i.test(text) ? "API" : "",
  ].filter(Boolean);
  if (tools.length === 0) return null;
  return tools.join(" / ");
}

function detectUsageSurface(text: string): string | null {
  if (/(line)/i.test(text)) return "LINE";
  if (/(スマホ|モバイル|アプリ)/i.test(text)) return "スマホ中心";
  if (/(サイト|web|ブラウザ)/i.test(text)) return "Webブラウザ";
  if (/(社内|バックオフィス|管理画面)/i.test(text)) return "社内Web";
  return null;
}

function detectAudienceScope(text: string): string | null {
  if (/(顧客|お客様|会員|ユーザー|外部)/i.test(text)) return "外部あり";
  if (/(社内|社員|スタッフ|現場|管理者)/i.test(text)) return "社内中心";
  return null;
}

function detectDataSensitivity(text: string): string | null {
  if (/(個人情報|顧客情報|住所|電話番号|メールアドレス|会員情報)/i.test(text)) {
    return "個人情報あり";
  }
  return null;
}

export function extractFreeformFactEnvelopes(
  input: Pick<FreeformInputEnvelope, "source" | "rawText" | "normalizedText">
): FactEnvelope[] {
  const text = input.normalizedText.trim();
  if (!text) return [];

  const source = `freeform:${input.source}`;
  const envelopes: FactEnvelope[] = [];

  const memo = summarizeFreeformMemo(text);
  const freeformMemo = createCandidateEnvelope("freeformMemo", memo, source, "candidate");
  if (freeformMemo) pushEnvelope(envelopes, freeformMemo);

  const problem = createCandidateEnvelope("problemSummary", text, source, "candidate");
  if (problem) pushEnvelope(envelopes, problem);

  const productCategory = detectProductCategory(text);
  if (productCategory) {
    const envelope = createCandidateEnvelope("productCategory", productCategory, source, "candidate");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  const productArchetype = detectProductArchetype(text);
  if (productArchetype) {
    const envelope = createCandidateEnvelope("productArchetype", productArchetype, source, "candidate");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  const targetSummary = detectTargetSummary(text);
  if (targetSummary) {
    const envelope = createCandidateEnvelope("targetSummary", targetSummary, source, "candidate");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  const timeline = detectTimeline(text);
  if (timeline) {
    const envelope = createCandidateEnvelope("timeline", timeline, source, "approx");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  const integration = detectIntegration(text);
  if (integration) {
    const envelope = createCandidateEnvelope("integration", integration, source, "approx");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  const usageSurface = detectUsageSurface(text);
  if (usageSurface) {
    const envelope = createCandidateEnvelope("usageSurface", usageSurface, source, "approx");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  const audienceScope = detectAudienceScope(text);
  if (audienceScope) {
    const envelope = createCandidateEnvelope("audienceScope", audienceScope, source, "approx");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  const dataSensitivity = detectDataSensitivity(text);
  if (dataSensitivity) {
    const envelope = createCandidateEnvelope("dataSensitivity", dataSensitivity, source, "approx");
    if (envelope) pushEnvelope(envelopes, envelope);
  }

  return envelopes;
}
