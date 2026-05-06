import {
  FileText,
  FolderTree,
  Handshake,
  Lightbulb,
  MessageCircle,
  Minimize2,
  Scale,
  Search,
  Settings,
} from "lucide-react";

const LEFT = [
  { icon: Settings, label: "定型業務" },
  { icon: FileText, label: "転記作業" },
  { icon: Search, label: "検索" },
  { icon: Minimize2, label: "要約" },
  { icon: FolderTree, label: "整理" },
] as const;

const RIGHT = [
  { icon: Lightbulb, label: "創造" },
  { icon: Scale, label: "判断" },
  { icon: Handshake, label: "関係構築" },
  { icon: MessageCircle, label: "本質的な議論" },
] as const;

function ArrowSvg() {
  return (
    <svg viewBox="0 0 80 48" width="80" height="48" aria-hidden className="shrink-0">
      <line
        x1="4"
        y1="24"
        x2="62"
        y2="24"
        stroke="var(--color-accent-primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon points="62,16 76,24 62,32" fill="var(--color-accent-primary)" />
    </svg>
  );
}

export function MissionContrastDiagram() {
  return (
    <div
      className="mission-contrast-grid mx-auto grid max-w-[900px] grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8"
      role="img"
      aria-label="AIに任せる業務と人が集中する業務の対比"
    >
      <div className="contrast-card rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] p-6 md:p-8">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-[var(--color-text-tertiary)]">
          AI に任せる
        </p>
        <ul className="mt-4 list-none space-y-0 p-0">
          {LEFT.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 border-b border-[var(--color-border-light)] py-3 text-[15px] text-[var(--color-text-secondary)] last:border-b-0 md:text-[16px]"
            >
              <Icon className="size-5 shrink-0 text-[var(--color-text-tertiary)]" strokeWidth={1.5} />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 md:flex-col">
        <div className="rotate-90 md:rotate-0">
          <ArrowSvg />
        </div>
        <span className="max-w-[10rem] text-center text-[12px] font-semibold leading-snug tracking-[0.04em] text-[var(--color-accent-primary)] md:text-[13px]">
          AI で解放する
        </span>
      </div>

      <div className="contrast-card rounded-xl border border-[color-mix(in_srgb,var(--color-warm)_35%,var(--color-border-light))] bg-[var(--color-bg-warm)] p-6 md:p-8">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-[var(--color-text-tertiary)]">
          人が集中する
        </p>
        <ul className="mt-4 list-none space-y-0 p-0">
          {RIGHT.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 border-b border-[color-mix(in_srgb,var(--color-warm)_45%,transparent)] py-3 text-[15px] font-medium text-[var(--color-text-primary)] last:border-b-0 md:text-[16px]"
            >
              <Icon className="size-5 shrink-0 text-[var(--color-accent-primary)]" strokeWidth={1.5} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
