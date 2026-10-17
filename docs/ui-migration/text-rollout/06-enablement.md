# 06 — `/services/insourcing-enablement`

実装: [`EnablementPage.tsx`](../../../src/components/services/EnablementPage.tsx) / [`EnablementExternalItSections.tsx`](../../../src/components/services/EnablementExternalItSections.tsx) / [`EnablementPreSupportCards.tsx`](../../../src/components/services/EnablementPreSupportCards.tsx) / [`service-landing-shared.module.css`](../../../src/components/services/service-landing-shared.module.css)（このページ専用）

## 構成表

| 順 | セクション | 読者の疑問 | 伝える要点 | 型 | 次へのつながり |
|----|------------|------------|------------|----|----------------|
| 1 | Hero | 何を任せられるか | 社内で雇わず外部の IT 担当に | A + 図 | 始める前の確認 |
| 2 | 支援を始める前に | 何を確認されるか | 担当範囲・人と時間・環境など5項目 | E（カード） | 外部契約という方法 |
| 3 | 採用する前に | なぜ外部契約か | 採用に頼らない・専門知識・見直し | B + C | 担当範囲 |
| 4 | ITの相談先を | 具体的に何をするか | 6つの担当例 | C | 比較 |
| 5 | 何が違うのか | 採用と比べてどうか | 4観点の比較表 | D | 進め方 |
| 6 | 任せる仕事を決めて | どう始まるか | 4段階 | C（工程） | 役割分担 |
| 7 | ITの判断を | 判断は誰がするか | 判断はお客様、技術は AXEON | B | お問い合わせ |
| 8 | お問い合わせ | 相談してよいか | 兼任でも手いっぱいでも | A | `/contact` |

## 今回の変更（文言変更なし）

| 箇所 | 変更 |
|------|------|
| 共有 CSS（本文・項目本文・注記） | SP 14px → 15px（本文 15px 未満を解消）。行間 1.5 → 本文 1.75 / 項目・注記 1.7、`text-wrap: pretty` |
| Hero リード | 1文ずつ block、文中は句単位（SP 14px → 15px） |
| 支援を始める前に | リードとカード本文を句単位（SP「確認しま／す。」を解消）。カード本文は flex の中なので句を `span` で包む |
| 各セクションのリード・本文 | 句単位（「始められ／ます。」「AXEON／は」「ま／す。」などを解消） |
| 項目本文（理由3件・担当例6件・工程4件） | 句単位（PC「対／応方法」「調／整」「な／ど」を解消） |
| 比較表のセル | 句単位（SP「運用す／る」を解消） |
| 注記2件・問い合わせ帯 | 句単位（「従い／ます。」「手いっ／ぱい」を解消） |

## 確認

| 幅 | 結果 |
|----|------|
| 390 | 全8セクションで語の途中の折り返し・1〜2字の行末落ちなし。横はみ出しなし |
| 1280 | 2列・3列・4列の項目本文が句単位で2行に収まる。比較表は各セル1行 |
