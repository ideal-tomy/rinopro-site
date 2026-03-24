import { estimateDetailedCopy } from "@/lib/content/site-copy";
import type { EstimateDetailedAiOutput } from "@/lib/estimate/estimate-snapshot";

const copy = estimateDetailedCopy;

export function EstimateDetailedResultBody({
  result,
}: {
  result: EstimateDetailedAiOutput;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-silver/25 bg-base-dark/50 p-4">
        <p className="text-sm font-medium text-text">やさしい要約</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text-sub">
          {result.plainCustomerSummary}
        </p>
      </div>

      <h3 className="text-base font-semibold text-text">{result.requirementTitle}</h3>
      <div className="space-y-5 text-sm text-text">
        {result.requirementSections.map((s) => (
          <div key={s.heading}>
            <h4 className="mb-2 font-semibold text-text">{s.heading}</h4>
            <ul className="list-inside list-disc space-y-1 pl-0.5 text-text-sub">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-silver/20 bg-base-dark/50 p-4">
        <p className="mb-2 text-xs font-medium text-text-sub">{copy.assumptionsTitle}</p>
        <ul className="list-inside list-disc text-sm text-text-sub">
          {result.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      {result.openQuestions.length > 0 ? (
        <div className="rounded-lg border border-silver/20 bg-base-dark/50 p-4">
          <p className="mb-2 text-xs font-medium text-text-sub">{copy.openQuestionsTitle}</p>
          <ul className="list-inside list-disc text-sm text-text-sub">
            {result.openQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-lg border border-silver/20 bg-base-dark/50 p-4">
        <p className="mb-2 text-xs font-medium text-text-sub">{copy.risksTitle}</p>
        <ul className="list-inside list-disc text-sm text-text-sub">
          {result.risks.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
