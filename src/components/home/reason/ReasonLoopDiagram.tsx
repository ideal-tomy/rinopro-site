/**
 * 真円がタブの下を通り、4タブの中心が円周に載るサイクル図。
 * ideal ReasonLoopDiagram の移植。
 */
import styles from "./ReasonLoopDiagram.module.css";

const VB = 560;
const CX = 280;
const CY = 280;
const R = 200;

export function ReasonLoopDiagram() {
  return (
    <div
      className={styles.diagram}
      role="img"
      aria-label="デモ公開、現場の反応、改善、運用に定着を回しながら土台を作るサイクル"
    >
      <svg
        className={styles.cycleSvg}
        viewBox={`0 0 ${VB} ${VB}`}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="reason-loop-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CX} cy={CY} r={R} className={styles.orbitBase} />
        <circle cx={CX} cy={CY} r={R} className={styles.orbitFlow} />
      </svg>

      <div className={`${styles.node} ${styles.topNode}`}>デモ公開</div>
      <div className={`${styles.node} ${styles.rightNode}`}>現場の反応</div>
      <div className={`${styles.node} ${styles.bottomNode}`}>改善</div>
      <div className={`${styles.node} ${styles.leftNode}`}>運用に定着</div>

      <div className={styles.center}>
        <strong className={styles.centerLabel}>土台を作る</strong>
      </div>
    </div>
  );
}
