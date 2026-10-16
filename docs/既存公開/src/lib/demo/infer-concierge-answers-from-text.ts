/**
 * フリーテキスト → intelligent-concierge の4軸（ルールのみ・LLMなし）。
 * CMS の issueTags / functionTags 等が整うほど pickRecommendedDemos の結果が安定する。
 */

import type {
  AiDemoAudienceRole,
  AiDemoAutomationDepth,
  AiDemoIssueTag,
} from "@/lib/sanity/types";
import type { ConciergeAnswers, ConciergeDomainId } from "@/lib/demo/intelligent-concierge";

const DEMO_INTENT_PATTERN =
  /demo|デモ|体験|おすすめ|ツール|効率|業務|書類|文書|帳票|契約|自動|要約|検索|問い合わせ|顧客|クレーム|報告|議事録|手間|削減|楽に|まとめ|ナレッジ|ワークフロー|承認|ダッシュボード|見える化/i;

/** この API／UI を起動してよいか（短すぎる・無関係そうな文を除外） */
export function shouldAttemptDemoRecommendFromText(text: string): boolean {
  const t = text.trim();
  if (t.length < 6) return false;
  if (t.length >= 18) return true;
  return DEMO_INTENT_PATTERN.test(t);
}

/**
 * ユーザー文から ConciergeAnswers を推定。未判定軸はバランスの取れた既定値。
 */
export function inferConciergeAnswersFromText(raw: string): ConciergeAnswers {
  const t = raw.trim();

  let domain: ConciergeDomainId = "other";
  if (/建設|インフラ|工事|施工|現場.*建/.test(t)) domain = "construction";
  else if (/士業|法律|弁護|会計|税理|行政書士/.test(t)) domain = "legal";
  else if (/製造|メーカー|工場|プラント/.test(t)) domain = "manufacturing";
  else if (/物流|倉庫|配送|トラック|在庫/.test(t)) domain = "distribution";
  else if (
    /小売|医療|飲食|介護|ec|eコマース|サービス業|店舗|ホテル|人材|不動産|保険/.test(t)
  ) {
    domain = "services";
  }

  let audienceRole: AiDemoAudienceRole = "management";
  if (/現場|外勤|ドライバー|店舗.*スタッフ|巡回/.test(t)) audienceRole = "field";
  else if (/経営|役員|ceo|cto|意思決定|経営会議/.test(t)) audienceRole = "executive";

  let issue: AiDemoIssueTag = "search";
  if (/書類|文書|契約|帳票|ドラフト|下書き|作成.*楽|ひな形|テンプレ/.test(t)) {
    issue = "document_work";
  } else if (/問い合わせ|顧客|クレーム|一次対応|サポート窓口/.test(t)) {
    issue = "customer_response";
  } else if (/報告|議事録|記録|日報|巡回報告|メモ.*まとめ/.test(t)) {
    issue = "reporting";
  } else if (/調整|オペ|品質|安全|在庫|生産管理|スケジュール/.test(t)) {
    issue = "coordination";
  } else if (/探す|検索|要約|ナレッジ|情報.*散らば|探し/.test(t)) {
    issue = "search";
  } else if (/効率|業務|手間|自動化|定型|繰り返し/.test(t)) {
    issue = "search";
  }

  let automationDepth: AiDemoAutomationDepth = "semi_auto";
  if (/フル.?自動|自動で完結|無人|丸ごと自動/.test(t)) automationDepth = "full_auto";
  else if (/見える化|ダッシュボード|一元|ポータル|集約|可視化/.test(t)) {
    automationDepth = "centralized";
  } else if (/下書き|半自動|人が仕上げ|ドラフト/.test(t)) automationDepth = "semi_auto";

  return {
    domain,
    audienceRole,
    issue,
    automationDepth,
  };
}
