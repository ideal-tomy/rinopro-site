import styles from "./enablement-pre-support-diagrams.module.css";

function PersonAtDesk({ accent = "blue" }: { accent?: "blue" | "orange" }) {
  const fill = accent === "orange" ? "var(--ps-orange)" : "var(--ps-blue)";
  return (
    <svg className={styles.personDesk} viewBox="0 0 56 52" aria-hidden>
      <rect x="8" y="28" width="40" height="6" rx="1" fill="var(--ps-blue-dark)" opacity="0.15" />
      <rect x="14" y="20" width="28" height="16" rx="2" fill="var(--ps-blue-pale)" stroke="var(--ps-blue)" strokeWidth="1.2" />
      <circle cx="28" cy="12" r="7" fill={fill} />
      <path d="M18 22h20v8H18z" fill={fill} opacity="0.9" />
    </svg>
  );
}

function PersonIcon({ accent = "blue" }: { accent?: "blue" | "orange" }) {
  const fill = accent === "orange" ? "var(--ps-orange)" : "var(--ps-blue)";
  return (
    <svg className={styles.personIcon} viewBox="0 0 32 40" aria-hidden>
      <circle cx="16" cy="10" r="7" fill={fill} />
      <path d="M6 38c2-8 8-12 10-12s8 4 10 12" fill={fill} />
    </svg>
  );
}

function PersonGroup({ accent = "blue" }: { accent?: "blue" | "orange" }) {
  return (
    <div className={styles.personGroup} aria-hidden>
      <PersonIcon accent={accent} />
      <PersonIcon accent={accent} />
      <PersonIcon accent={accent} />
    </div>
  );
}

export function PreSupportDiagramScope() {
  return (
    <div className={styles.diagram} aria-hidden>
      <div className={styles.split}>
        <div className={styles.panelBlue}>
          <p className={styles.panelLabel}>社内</p>
          <PersonAtDesk />
          <ul className={styles.panelList}>
            <li>日々の操作</li>
            <li>設定変更</li>
          </ul>
        </div>
        <div className={styles.panelOrange}>
          <p className={styles.panelLabel}>外部</p>
          <PersonAtDesk accent="orange" />
          <ul className={styles.panelList}>
            <li>システム開発</li>
            <li>機能追加</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PreSupportDiagramTime() {
  return (
    <div className={styles.diagram} aria-hidden>
      <div className={styles.timeRow}>
        <div className={styles.timeCol}>
          <div className={styles.timeIconSlot}>
            <PersonIcon />
          </div>
          <p className={styles.caption}>担当者</p>
        </div>
        <div className={styles.timeCol}>
          <div className={styles.timeIconSlot}>
            <svg className={styles.clock} viewBox="0 0 52 52" aria-hidden>
            <circle cx="26" cy="26" r="22" fill="#fff" stroke="var(--ps-blue)" strokeWidth="2" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
              const x1 = 26 + Math.cos(a) * 16;
              const y1 = 26 + Math.sin(a) * 16;
              const x2 = 26 + Math.cos(a) * 19;
              const y2 = 26 + Math.sin(a) * 19;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--ps-blue)"
                  strokeWidth="1.2"
                />
              );
            })}
            <line x1="26" y1="26" x2="26" y2="14" stroke="var(--ps-blue)" strokeWidth="2" />
            <line x1="26" y1="26" x2="34" y2="30" stroke="var(--ps-orange)" strokeWidth="2" />
          </svg>
          </div>
          <p className={styles.caption}>使える時間</p>
        </div>
      </div>
    </div>
  );
}

export function PreSupportDiagramKnowledge() {
  return (
    <div className={styles.diagram} aria-hidden>
      <div className={styles.knowledge}>
        <div className={styles.manual}>
          <p className={styles.manualTitle}>操作マニュアル</p>
          <div className={styles.manualLines}>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.knowledgeArrows} aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.knowledgePeople}>
          <div>
            <PersonIcon />
            <p className={styles.caption}>担当者</p>
          </div>
          <div>
            <PersonIcon accent="orange" />
            <p className={styles.caption}>他の担当者</p>
          </div>
          <div>
            <PersonIcon />
            <p className={styles.caption}>運用担当</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreSupportDiagramEnvironment() {
  return (
    <div className={styles.diagram} aria-hidden>
      <div className={styles.envRow}>
        <div className={styles.monitorWrap}>
          <svg className={styles.monitor} viewBox="0 0 72 58" aria-hidden>
            <rect x="4" y="4" width="64" height="40" rx="3" fill="var(--ps-blue)" />
            <rect x="8" y="8" width="56" height="32" rx="2" fill="var(--ps-blue-pale)" />
            <rect x="28" y="46" width="16" height="4" rx="1" fill="var(--ps-blue-dark)" opacity="0.25" />
            <rect x="22" y="50" width="28" height="3" rx="1" fill="var(--ps-blue-dark)" opacity="0.2" />
          </svg>
          <span className={styles.monitorScreenLabel}>システム</span>
        </div>
        <svg className={styles.envArrow} viewBox="0 0 24 12" aria-hidden>
          <path d="M2 6h16m-4-4 4 4-4 4" fill="none" stroke="var(--ps-blue)" strokeWidth="1.6" />
        </svg>
        <div className={styles.dbWrap}>
          <svg className={styles.database} viewBox="0 0 40 48" aria-hidden>
            <ellipse cx="20" cy="10" rx="16" ry="6" fill="var(--ps-blue)" />
            <path d="M4 10v12c0 3.3 7.2 6 16 6s16-2.7 16-6V10" fill="var(--ps-blue-pale)" stroke="var(--ps-blue)" strokeWidth="1.2" />
            <path d="M4 22v12c0 3.3 7.2 6 16 6s16-2.7 16-6V22" fill="var(--ps-blue-pale)" stroke="var(--ps-blue)" strokeWidth="1.2" />
          </svg>
          <p className={styles.caption}>データベース</p>
        </div>
      </div>
    </div>
  );
}

export function PreSupportDiagramVendorSplit() {
  return (
    <div className={styles.diagram} aria-hidden>
      <div className={styles.split}>
        <div className={styles.panelBlue}>
          <p className={styles.panelLabel}>自社</p>
          <PersonGroup accent="blue" />
          <ul className={styles.panelList}>
            <li>業務の確認</li>
            <li>社内の判断</li>
          </ul>
        </div>
        <div className={styles.panelOrange}>
          <p className={styles.panelLabel}>開発会社</p>
          <PersonGroup accent="orange" />
          <ul className={styles.panelList}>
            <li>設計・開発</li>
            <li>技術対応</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
