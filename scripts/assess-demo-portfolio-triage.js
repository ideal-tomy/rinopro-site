const fs = require("node:fs");
const path = require("node:path");

const triagePath = path.join(process.cwd(), "docs", "demo-portfolio-triage.md");
let text = fs.readFileSync(triagePath, "utf8");

const track3 = new Set([
  "construction-shadow-foreman",
  "legal-memory-secretary",
  "service-claim-reply-assist",
  "meeting-minutes-auto",
  "photo-inspection-report",
  "civic-counter-reply-outline",
  "helpdesk-similar-ticket-summary",
  "security-suspicion-triage-memo",
  "internal-report-intake-memo",
  "medical-device-visit-report-draft",
]);

const track2 = new Set([
  "property-viewing-memo",
  "retail-floor-voice-handoff",
  "driver-voice-incident-draft",
  "property-exterior-photo-memo",
  "delivery-photo-completion-report",
  "stocktake-photo-variance-memo",
  "damage-photo-incident-draft",
  "site-survey-voice-memo",
  "parent-meeting-voice-summary",
  "voicemail-followup-reply-draft",
  "care-shift-voice-handover",
  "product-label-photo-check-memo",
  "cs-qbr-voice-summary",
  "event-brief-voice-to-quote-memo",
  "field-crop-photo-observation",
  "whiteboard-photo-action-extract",
  "call-monitor-feedback-coaching",
  "clinic-reception-voice-handover",
  "receipt-photo-expense-memo",
  "vm-display-photo-completion-report",
  "gemba-5s-photo-findings-memo",
  "grocery-freshness-voice-waste-log",
  "construction-barrier-photo-safety-round",
  "venue-loadin-voice-timeline",
]);

const holdRankMap = new Map([
  ["loan-interview-business-outline", "A"],
  ["conference-trip-report-outline", "A"],
  ["nonprofit-donor-thanks-letter-draft", "A"],
  ["crowdfunding-milestone-update-draft", "A"],
  ["pet-hotel-handover-voice-memo", "B"],
  ["gallery-exhibit-voice-script-draft", "C"],
  ["parking-violation-photo-contact-memo", "C"],
  ["patent-search-plan-from-memo", "C"],
  ["esg-kpi-draft-from-initiatives", "C"],
  ["oss-attribution-readme-snippet", "D"],
]);

const productMemo = new Map([
  ["construction-shadow-foreman", "現場報告→内勤調整を一元化し、再確認工数を削減"],
  ["legal-memory-secretary", "社内文書検索ボット化で、過去案件確認の一次対応を短縮"],
  ["service-claim-reply-assist", "問い合わせ一次返信を標準化し、対応品質と速度を平準化"],
  ["meeting-minutes-auto", "会議音声→議事録運用を定着化し、記録漏れを削減"],
  ["photo-inspection-report", "現場写真→報告書化の定型運用で、報告の品質差を削減"],
  ["civic-counter-reply-outline", "窓口 FAQ 支援で新人の案内精度を安定化"],
  ["helpdesk-similar-ticket-summary", "過去チケット検索＋返信案で一次切り分けを短縮"],
  ["security-suspicion-triage-memo", "初動トリアージを定型化し、エスカレ判断を高速化"],
  ["internal-report-intake-memo", "内部通報受付フローの文書化を標準化"],
  ["medical-device-visit-report-draft", "訪問記録入力の標準化で営業報告の欠損を削減"],
]);

function fillByTrack(slug) {
  if (holdRankMap.has(slug)) {
    const rank = holdRankMap.get(slug);
    if (rank === "A") {
      return {
        track: "④",
        url: "",
        memo: "",
        rank,
        holdTag: "需要不明",
        demand: "中",
        difficulty: "中",
        clarity: "中",
        note: "文面と対象ユーザーを絞れば①へ昇格可能",
      };
    }
    if (rank === "B") {
      return {
        track: "④",
        url: "",
        memo: "",
        rank,
        holdTag: "需要不明",
        demand: "中",
        difficulty: "中",
        clarity: "中",
        note: "操作導線の体験設計が必要（②候補）",
      };
    }
    if (rank === "C") {
      return {
        track: "④",
        url: "",
        memo: "",
        rank,
        holdTag: "成果物曖昧",
        demand: "低",
        difficulty: "高",
        clarity: "低",
        note: "複数ステップの業務フロー設計が前提",
      };
    }
    return {
      track: "④",
      url: "",
      memo: "",
      rank,
      holdTag: "需要不明/成果物曖昧",
      demand: "低",
      difficulty: "中",
      clarity: "低",
      note: "現時点は削除優先",
    };
  }

  if (track3.has(slug)) {
    return {
      track: "③",
      url: "（体験URL未設定）",
      memo: productMemo.get(slug) || "対象業務を1フローに絞って導入判断まで持っていく",
      rank: "",
      holdTag: "",
      demand: "高",
      difficulty: "高",
      clarity: "高",
      note: "MVP化候補",
    };
  }

  if (track2.has(slug)) {
    return {
      track: "②",
      url: "（体験URL未設定）",
      memo: "",
      rank: "",
      holdTag: "",
      demand: "中",
      difficulty: "中",
      clarity: "中",
      note: "画面体験があると訴求しやすい",
    };
  }

  return {
    track: "①",
    url: "",
    memo: "",
    rank: "",
    holdTag: "",
    demand: "中",
    difficulty: "低",
    clarity: "高",
    note: "文章デモで成立",
  };
}

const rowRegex =
  /^\| (\d+) \| `([^`]+)` \| ([^|]+) \| ([^|]+) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|$/gm;

let counts = { t1: 0, t2: 0, t3: 0, t4: 0, d: 0 };

text = text.replace(rowRegex, (_, no, slug, title) => {
  const v = fillByTrack(slug.trim());
  if (v.track === "①") counts.t1 += 1;
  if (v.track === "②") counts.t2 += 1;
  if (v.track === "③") counts.t3 += 1;
  if (v.track === "④") counts.t4 += 1;
  if (v.rank === "D") counts.d += 1;
  return `| ${no} | \`${slug}\` | ${title.trim()} | ${v.track} | ${v.url} | ${v.memo} | ${v.rank} | ${v.holdTag} | ${v.demand} | ${v.difficulty} | ${v.clarity} | ${v.note} |`;
});

const dList = [...holdRankMap.entries()]
  .filter(([, rank]) => rank === "D")
  .map(([slug]) => `- \`${slug}\``)
  .join("\n");

const summary = `## 査定サマリ（2026-03-22）\n\n- ① 文章デモ: **${counts.t1}本**\n- ② 体験: **${counts.t2}本**\n- ③ プロダクト: **${counts.t3}本**\n- ④ 保留: **${counts.t4}本**（A/B/C/D あり）\n\n> 査定基準: [demo-portfolio-governance.md](demo-portfolio-governance.md)\n\n---\n`;

if (/## 査定サマリ（2026-03-22）[\s\S]*?---\n/.test(text)) {
  text = text.replace(/## 査定サマリ（2026-03-22）[\s\S]*?---\n/, summary);
} else {
  text = text.replace("## マスター（100本）", `${summary}\n## マスター（100本）`);
}

text = text.replace(
  /## 削除候補（Dランク確定）[\s\S]*$/,
  `## 削除候補（Dランク確定）\n\n運用: **D に確定した slug** を下に追記する（実行は governance の削除チェックリストに従う）。\n\n${dList || "- （現時点: なし）"}\n`
);

fs.writeFileSync(triagePath, text, "utf8");
console.log("Updated docs/demo-portfolio-triage.md");
