/**
 * バッチ10: Live Sync（音声→リアルタイム翻訳モック）
 */

export const batch10LiveSyncDemos = [
  {
    _type: "aiDemo" as const,
    title: "Live Sync：音声入力のリアルタイム翻訳",
    slug: { _type: "slug" as const, current: "live-sync-voice-translation" },
    industry: "manufacturing" as const,
    inputType: "audio_text" as const,
    runMode: "mock_preview" as const,
    writingTone: "b2b_ops" as const,
    inputPlaceholder:
      "音声は下の体験画面で操作してください。手入力で試す場合はこちらに文章を入力してください。",
    mockOutputPrimary: `## 1. この体験で見せること

- **左**: Web Speech API で日本語を取得（確定文＋途中認識）。非対応ブラウザでは **モック音声ストリーム** で同じライブ感を再現。
- **右**: 辞書ベースのモック翻訳が **入力に追従して自動更新**（「翻訳」ボタン不要）。
- **ショートカット**: Alt+M で音声入力の開始/停止（対応ブラウザのみ）。

## 2. インタラクティブ体験URL

- パス: \`/experience/live-sync-voice-translation\``,
    mockOutputSecondary: `## 3. 補足（プロトタイプ）

- 翻訳は実APIではなく **決定論的な辞書モック** です。
- 英語以外の言語はラベル付きのモック表記です（将来のAPI差し替え前提）。`,
    systemPrompt:
      "このドキュメントはプロトタイプ説明用です。ユーザーにはインタラクティブ体験（音声入力とライブ翻訳）へ誘導してください。",
    outputStructure:
      "体験の要点、インタラクティブURL、補足の3ブロックで出力すること。",
    sampleData: [
      "明日の会議は誠に恐縮ながら無理です。期限だけ先に教えてください",
      "資料は後ほど送付します。ご確認ください",
      "お手数ですが折り返しお電話いただけますか",
    ],
    ctaTitle: "ライブ同期型の翻訳・要約を業務フローに組み込みたい場合はお問い合わせください。",
    ctaButtonText: "相談する",
    description:
      "話しながら右側が自動で言語切り替わりする「伴走」体験（翻訳モード）。会議・窓口・越境コミュニケーションのイメージに使えます。インタラクティブ体験: /experience/live-sync-voice-translation（Live Sync）。",
    industryTags: ["製造", "SaaS", "物流"],
    functionTags: ["音声入力", "要約"],
    moduleTags: ["Speech", "LLM"],
    oneLiner: "音声入力をリアルタイムでモック翻訳",
    primaryPortfolioTrack: "experience" as const,
  },
];
