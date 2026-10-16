const steps = [
  ["①戦略", "コンサルティング"],
  ["②IT", "コンサルティング"],
  ["③システム開発"],
  ["④導入・展開"],
  ["⑤運用・保守"],
];

/** Next.js App Router対応。画像・外部ライブラリ・Client Component指定は不要です。 */
export default function ServiceFlowDiagram() {
  return (
    <div
      role="region"
      aria-label="支援の5工程。狭い画面では横にスクロールできます"
      tabIndex={0}
      style={{ width: "100%", maxWidth: 1206, marginInline: "auto", overflowX: "auto" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1206 508"
        role="img"
        aria-label="①戦略コンサルティング、②ITコンサルティング、③システム開発、④導入・展開、⑤運用・保守。各工程の下に内容欄。最初の2工程を濃い青で強調。"
        style={{ display: "block", width: "100%", minWidth: 900, height: "auto" }}
      >
        <rect width="1206" height="508" fill="#f9f9f8" />
        {steps.map((lines, index) => {
          const x = 80 + index * 209;
          const emphasized = index < 2;
          const points = index === 0
            ? `${x},23 ${x + 197},23 ${x + 222},69 ${x + 197},115 ${x},115`
            : `${x},23 ${x + 197},23 ${x + 222},69 ${x + 197},115 ${x},115 ${x + 26},69`;

          return (
            <g key={lines[0]}>
              <polygon points={points} fill={emphasized ? "#205f9e" : "#d7e7f8"} />
              <text
                x={x + 103}
                textAnchor="middle"
                fill={emphasized ? "#ffffff" : "#194b72"}
                fontFamily='"Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif'
                fontSize="18"
                fontWeight="500"
              >
                {lines.map((line, row) => (
                  <tspan key={line} x={x + 103} y={lines.length === 1 ? 75 : 60 + row * 30}>
                    {line}
                  </tspan>
                ))}
              </text>
              <rect
                x={x + 6} y="140" width="194" height="353" rx="6"
                fill="#ffffff"
                stroke={emphasized ? "#286491" : "#dae7f4"}
                strokeWidth="2.3"
              />
              <text
                x={x + 103} y="186" textAnchor="middle"
                fontFamily='"Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif'
                fontSize="18" fontWeight="400"
                fill={emphasized ? "#286491" : "#8ab0d2"}
              >内容</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
