const rows = [
  ["現在の課題", "同じ受注情報を複数のシステムに入力"],
  ["検討した方法", "業務手順の変更・データ連携・システム改修"],
  ["先に行うこと", "既存システムの連携条件を確認"],
  ["次の確認事項", "必要な費用・担当者・運用への影響"],
] as const;

/** 架空の構成例。実績や標準納品物ではない。 */
export function ConsultingResultSample() {
  return (
    <figure className="ax-evidence-paper" aria-label="検討資料の構成例">
      <div className="ax-evidence-paper__header">
        <p>改善案の検討資料</p>
        <p>構成例 / SAMPLE</p>
      </div>
      <p className="ax-evidence-paper__title">受注情報の入力業務</p>
      <p className="ax-evidence-paper__meta">検討対象：営業部門・事務部門</p>
      <dl className="ax-evidence-paper__rows">
        {rows.map(([term, detail]) => (
          <div key={term} className="ax-evidence-paper__row">
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
