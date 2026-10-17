import {
  SERVICE_HERO_PROCESS_STAGES,
  type ServiceHeroProcessStageId,
} from "@/lib/content/service-hero-process-stages";
import { cn } from "@/lib/utils";
import styles from "./service-flow-diagram.module.css";

/** 参考 SVG と同じヘッダ行分割（枠デザイン固定） */
const HEADER_LINES: readonly (readonly string[])[] = [
  ["①戦略", "コンサルティング"],
  ["②IT", "コンサルティング"],
  ["③システム開発"],
  ["④導入・展開"],
  ["⑤運用・保守"],
];

const FONT_FAMILY =
  '"Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif';

const VIEWBOX_WIDTH = 1206;
const VIEWBOX_HEIGHT = 508;

type ServiceFlowDiagramProps = {
  highlightedStageIds?: readonly ServiceHeroProcessStageId[];
  /** ヒーロー2カラム右など。親幅に合わせず図は設計幅＋横スクロール */
  layout?: "default" | "hero";
};

export function ServiceFlowDiagram({
  highlightedStageIds = [1, 2],
  layout = "hero",
}: ServiceFlowDiagramProps) {
  const highlight = new Set(highlightedStageIds);

  return (
    <div
      className={cn(styles.wrap, layout === "hero" && styles.wrapInColumn)}
      role="region"
      aria-label="支援の5工程。狭い画面では横にスクロールできます"
      tabIndex={0}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="①戦略コンサルティング、②ITコンサルティング、③システム開発、④導入・展開、⑤運用・保守。各工程の下に代表的な業務例。強調工程は濃い青。"
        className={styles.svg}
      >
        <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="#f9f9f8" />
        {SERVICE_HERO_PROCESS_STAGES.map((stage, index) => {
          const lines = HEADER_LINES[index] ?? [stage.title];
          const x = 80 + index * 209;
          const emphasized = highlight.has(stage.id);
          const points =
            index === 0
              ? `${x},23 ${x + 197},23 ${x + 222},69 ${x + 197},115 ${x},115`
              : `${x},23 ${x + 197},23 ${x + 222},69 ${x + 197},115 ${x},115 ${x + 26},69`;

          const contentClass = emphasized
            ? `${styles.contentBox} ${styles.contentBoxEmphasized}`
            : styles.contentBox;

          return (
            <g key={stage.id}>
              <polygon
                points={points}
                fill={emphasized ? "#205f9e" : "#d7e7f8"}
              />
              <text
                x={x + 103}
                textAnchor="middle"
                fill={emphasized ? "#ffffff" : "#194b72"}
                fontFamily={FONT_FAMILY}
                fontSize="18"
                fontWeight="500"
              >
                {lines.map((line, row) => (
                  <tspan
                    key={line}
                    x={x + 103}
                    y={lines.length === 1 ? 75 : 60 + row * 30}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
              <rect
                x={x + 6}
                y="140"
                width="194"
                height="353"
                rx="6"
                fill="#ffffff"
                stroke={emphasized ? "#286491" : "#dae7f4"}
                strokeWidth="2.3"
              />
              <foreignObject x={x + 6} y="140" width="194" height="353">
                <div className={contentClass}>
                  <p className={styles.stageTitle}>{stage.title}</p>
                  <p className={styles.sectionHeading}>代表的な業務例</p>
                  <ul className={styles.list}>
                    {stage.detail.whatWeDo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
