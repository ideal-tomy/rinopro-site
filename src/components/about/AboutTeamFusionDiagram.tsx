import { Compass, Cpu } from "lucide-react";
import { aboutReading } from "@/lib/ui/about-reading-styles";
import { cn } from "@/lib/utils";

type TeamLead = {
  title: string;
  bullets: readonly string[];
};

type TeamModel = {
  fusionLabel: string;
  strategyLead: TeamLead;
  aiEngineeringLead: TeamLead;
};

type AboutTeamFusionDiagramProps = {
  teamModel: TeamModel;
};

function FusionHub({ label, compact = false }: { label: string; compact?: boolean }) {
  const size = compact ? "size-[4.5rem]" : "size-[11rem] md:size-[8.5rem]";
  const fontSize = compact ? "22" : "28";

  const labelDesktop = (
    <p className="mt-4 hidden text-center text-[13px] font-semibold tracking-[0.12em] text-[var(--color-accent-primary)] md:block">
      {label}
    </p>
  );

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center",
        compact ? "px-2 py-2" : "border-y border-[var(--color-border-light)] px-4 py-7 md:border-y-0 md:py-0 md:min-h-[14rem]"
      )}
      aria-hidden
    >
      {!compact ? (
        <div className="absolute inset-y-6 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-accent-primary)]/25 to-transparent md:block" />
      ) : null}
      <div className={cn("relative shrink-0", size)}>
        <svg viewBox="0 0 120 120" className="size-full text-[var(--color-accent-primary)]">
        <circle
          className="fusion-hub-ripple fusion-hub-ripple--1"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          className="fusion-hub-ripple fusion-hub-ripple--2"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <circle
          className="fusion-hub-ripple fusion-hub-ripple--3"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="60" cy="60" r="42" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
        <circle
          cx="60"
          cy="60"
          r="30"
          fill="var(--color-bg-pure)"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
        <circle
          className="fusion-hub-core-glow"
          cx="60"
          cy="60"
          r="22"
          fill="var(--color-accent-primary-light)"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <text
          x="60"
          y="66"
          textAnchor="middle"
          fill="var(--color-accent-primary)"
          fontSize={fontSize}
          fontWeight="300"
          className="max-md:opacity-0"
        >
          ×
        </text>
      </svg>
        {!compact ? (
          <p
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center whitespace-nowrap text-center text-[18px] font-bold tracking-wide text-[var(--color-accent-primary)] [text-shadow:0_0_10px_var(--color-bg-pure),0_0_18px_var(--color-bg-pure)] md:hidden"
          >
            {label}
          </p>
        ) : null}
      </div>
      {!compact ? labelDesktop : null}
    </div>
  );
}

type RoleHeaderProps = {
  eyebrow: string;
  caption: string;
  title: string;
  icon: typeof Compass;
  connector?: "left" | "right";
};

function RoleHeader({ eyebrow, caption, title, icon: Icon, connector }: RoleHeaderProps) {
  return (
    <div className="relative flex flex-col items-center px-6 py-8 md:px-8 md:py-9">
      <div className="relative flex w-full items-center justify-center">
        {connector === "right" ? (
          <span
            className="absolute left-[calc(50%+2.5rem)] top-1/2 hidden h-px w-[min(3.5rem,10vw)] -translate-y-1/2 bg-gradient-to-r from-[var(--color-accent-primary)]/45 to-transparent md:block"
            aria-hidden
          />
        ) : null}
        <div className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-[var(--color-accent-primary)]/18 bg-[var(--color-accent-primary-light)]/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
          <Icon className="size-7 text-[var(--color-accent-primary)]" strokeWidth={1.5} aria-hidden />
        </div>
        {connector === "left" ? (
          <span
            className="absolute right-[calc(50%+2.5rem)] top-1/2 hidden h-px w-[min(3.5rem,10vw)] -translate-y-1/2 bg-gradient-to-l from-[var(--color-accent-primary)]/45 to-transparent md:block"
            aria-hidden
          />
        ) : null}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-primary)]">
        {eyebrow}
      </p>
      <p className="mt-1 text-[15px] font-semibold text-[var(--color-text-primary)] md:text-[16px]">{caption}</p>
      <h3 className="mt-2 text-center text-lg font-bold tracking-tight text-[var(--color-text-primary)] md:text-xl">
        {title}
      </h3>
    </div>
  );
}

function PairedCapabilityRows({
  strategyBullets,
  engineeringBullets,
}: {
  strategyBullets: readonly string[];
  engineeringBullets: readonly string[];
}) {
  const rowCount = Math.max(strategyBullets.length, engineeringBullets.length);

  return (
    <div className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]/35">
      <p className="border-b border-[var(--color-border-light)] px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-sub)] md:px-8">
        担当領域
      </p>
      <div className="divide-y divide-[var(--color-border-light)]">
        {Array.from({ length: rowCount }, (_, index) => (
          <div
            key={index}
            className="grid min-h-[4.25rem] grid-cols-1 md:min-h-[3.75rem] md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)]"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border-light)] px-6 py-4 md:border-b-0 md:border-r md:px-8 md:py-5">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-primary)]/10 text-[11px] font-bold text-[var(--color-accent-primary)]"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={cn(aboutReading.body, "!mt-0 text-[15px] md:text-[16px]")}>
                {strategyBullets[index] ?? ""}
              </span>
            </div>
            <div
              className="hidden items-center justify-center border-[var(--color-border-light)] md:flex md:border-r"
              aria-hidden
            >
              <span className="size-1.5 rounded-full bg-[var(--color-accent-primary)]/50" />
            </div>
            <div className="flex items-center gap-3 px-6 py-4 md:px-8 md:py-5">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-primary)]/10 text-[11px] font-bold text-[var(--color-accent-primary)]"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={cn(aboutReading.body, "!mt-0 text-[15px] md:text-[16px]")}>
                {engineeringBullets[index] ?? ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutTeamFusionDiagram({ teamModel }: AboutTeamFusionDiagramProps) {
  return (
    <div className="relative mx-auto mt-12 max-w-5xl md:mt-16">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] shadow-[0_24px_64px_-36px_rgba(38,65,142,0.32)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: `
              linear-gradient(to right, color-mix(in srgb, var(--color-accent-primary) 7%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in srgb, var(--color-accent-primary) 7%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-accent-primary-light)]/20 via-transparent to-transparent"
          aria-hidden
        />

        {/* 上段：図解のみ（テキスト量に左右されない対称ゾーン） */}
        <div className="relative grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <RoleHeader
            eyebrow="Strategy"
            caption="経営・戦略の視点"
            title={teamModel.strategyLead.title}
            icon={Compass}
            connector="right"
          />
          <FusionHub label={teamModel.fusionLabel} />
          <RoleHeader
            eyebrow="Engineering"
            caption="実装・技術の視点"
            title={teamModel.aiEngineeringLead.title}
            icon={Cpu}
            connector="left"
          />
        </div>

        {/* 下段：行ペアで横並び（文字数が違っても行の高さで揃う） */}
        <PairedCapabilityRows
          strategyBullets={teamModel.strategyLead.bullets}
          engineeringBullets={teamModel.aiEngineeringLead.bullets}
        />
      </div>
    </div>
  );
}
