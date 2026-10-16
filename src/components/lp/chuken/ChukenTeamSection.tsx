import { AxContainer } from "@/components/ui/ax/AxContainer";
import { AxSection } from "@/components/ui/ax/AxSection";
import { AxText } from "@/components/ui/ax/AxText";
import { AxProse } from "@/components/ui/ax/patterns";

const chukenDisplay = "font-[family-name:var(--font-chuken-display),serif]";

export function ChukenTeamSection() {
  return (
    <AxSection id="team" tone="surface" aria-labelledby="chuken-team">
      <AxContainer>
        <AxText role="eyebrow">07 · OUR TEAM</AxText>
        <h2
          id="chuken-team"
          className={`${chukenDisplay} ax-role-section-title text-[var(--ax-text-heading)]`}
        >
          <span className="block">1プロジェクトに対する、</span>
          <span className="block">標準体制</span>
        </h2>
        <AxProse className="mt-4">
          <p>
            大手SIerのような大人数体制ではなく、少数精鋭で進めます。ただし、伴走の濃度を妥協することはありません。
          </p>
        </AxProse>

        <div className="mt-10 rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-muted)] p-5 sm:p-8">
          <p className="mb-4 text-center text-[12px] font-bold tracking-[0.18em] text-[var(--ax-text-supporting)]">
            AXEONの体制構成
          </p>
          <div className="mx-auto max-w-[560px]">
            <svg
              viewBox="0 0 560 420"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto w-full"
              role="img"
              aria-label="代表が直接お客様と対話し、専門メンバーが代表と連携する体制図"
            >
              <circle
                cx="280"
                cy="210"
                r="180"
                fill="none"
                stroke="#e8e0cf"
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity="0.6"
              />
              <circle
                cx="280"
                cy="210"
                r="135"
                fill="none"
                stroke="#e8e0cf"
                strokeWidth="1"
                opacity="0.5"
              />
              <line x1="280" y1="249" x2="280" y2="305" stroke="#1a3a8a" strokeWidth="2" />
              <polygon points="276,300 280,310 284,300" fill="#1a3a8a" />
              <line
                x1="150"
                y1="100"
                x2="240"
                y2="170"
                stroke="#1a3a8a"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="280"
                y1="96"
                x2="280"
                y2="141"
                stroke="#1a3a8a"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="410"
                y1="100"
                x2="320"
                y2="170"
                stroke="#1a3a8a"
                strokeWidth="1"
                opacity="0.6"
              />
              <g>
                <circle cx="150" cy="100" r="38" fill="#fff" stroke="#1a3a8a" strokeWidth="1.5" />
                <text
                  x="150"
                  y="96"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="11"
                  fill="#1a3a8a"
                >
                  専門
                </text>
                <text
                  x="150"
                  y="112"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="11"
                  fill="#1a3a8a"
                >
                  メンバー
                </text>
              </g>
              <g>
                <circle cx="280" cy="58" r="38" fill="#fff" stroke="#1a3a8a" strokeWidth="1.5" />
                <text
                  x="280"
                  y="54"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="11"
                  fill="#1a3a8a"
                >
                  専門
                </text>
                <text
                  x="280"
                  y="70"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="11"
                  fill="#1a3a8a"
                >
                  メンバー
                </text>
              </g>
              <g>
                <circle cx="410" cy="100" r="38" fill="#fff" stroke="#1a3a8a" strokeWidth="1.5" />
                <text
                  x="410"
                  y="96"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="11"
                  fill="#1a3a8a"
                >
                  専門
                </text>
                <text
                  x="410"
                  y="112"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="11"
                  fill="#1a3a8a"
                >
                  メンバー
                </text>
              </g>
              <g>
                <circle cx="280" cy="195" r="64" fill="none" stroke="#c9a86b" strokeWidth="2" />
                <circle cx="280" cy="195" r="54" fill="#1a3a8a" stroke="#1a3a8a" strokeWidth="2" />
                <text
                  x="280"
                  y="192"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="18"
                  fill="#fff"
                  fontWeight="500"
                >
                  代表
                </text>
                <text
                  x="280"
                  y="212"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="9"
                  fill="#c9a86b"
                  letterSpacing="0.2em"
                >
                  YOUR CONTACT
                </text>
              </g>
              <g>
                <rect
                  x="300"
                  y="262"
                  width="80"
                  height="22"
                  fill="#fff"
                  stroke="#1a3a8a"
                  strokeWidth="1"
                />
                <text
                  x="340"
                  y="277"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="12"
                  fill="#1a3a8a"
                >
                  直接対話
                </text>
              </g>
              <g>
                <rect
                  x="180"
                  y="305"
                  width="200"
                  height="60"
                  fill="#f5ede0"
                  stroke="#1a3a8a"
                  strokeWidth="1.5"
                />
                <text
                  x="280"
                  y="328"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="11"
                  fill="#1a3a8a"
                  letterSpacing="0.2em"
                >
                  YOUR COMPANY
                </text>
                <text
                  x="280"
                  y="349"
                  textAnchor="middle"
                  fontFamily="serif"
                  fontSize="14"
                  fill="#1a3a8a"
                  fontWeight="500"
                >
                  あなたの会社
                </text>
              </g>
            </svg>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] p-4">
              <h3 className="ax-role-item-title text-[var(--ax-text-heading)]">代表</h3>
              <p className="ax-role-body mt-2 text-[var(--ax-text-supporting)]">
                戦略設計から実装まで、案件全体に伴走します。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["戦略設計", "経営要件調整", "PM", "課題整理"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--ax-surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ax-text-heading)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] p-4">
              <h3 className="ax-role-item-title text-[var(--ax-text-heading)]">
                専門メンバー
              </h3>
              <p className="ax-role-body mt-2 text-[var(--ax-text-supporting)]">
                案件の規模・難易度に応じて、最適な専門メンバーをアサインします。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["AI実装", "技術選定", "業務設計", "既存システム統合"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--ax-surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ax-text-heading)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-4 text-center text-[13px] font-bold tracking-wide text-[var(--ax-text-heading)]">
            大手SIerとの違い
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[var(--ax-border-subtle)] bg-[var(--ax-surface-card)] p-5">
              <p className="text-[12px] font-bold text-[var(--ax-text-supporting)]">
                一般的な大手SIer
              </p>
              <p className="mt-2 text-[11px] tracking-[0.14em] text-[var(--ax-text-supporting)]">
                CONTACT FLOW
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[var(--ax-text-heading)]">
                お客様 → 営業 → PM → 実装者
              </p>
              <p className="ax-role-body mt-3 text-[var(--ax-text-supporting)]">
                複数階層を経由するため、伝言ゲームになりやすい。意思決定にも時間がかかります。
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--ax-brand-primary)]/30 bg-[color-mix(in_srgb,var(--ax-brand-primary)_6%,#fff)] p-5">
              <p className="text-[12px] font-bold text-[var(--ax-brand-primary)]">AXEON</p>
              <p className="mt-2 text-[11px] tracking-[0.14em] text-[var(--ax-text-supporting)]">
                CONTACT FLOW
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[var(--ax-text-heading)]">
                お客様 ⇄ 代表
              </p>
              <p className="ax-role-body mt-3 text-[var(--ax-text-supporting)]">
                代表が直接対話するので、メッセージが薄まらず、意思決定が早い体制です。
              </p>
            </article>
          </div>
        </div>
      </AxContainer>
    </AxSection>
  );
}
