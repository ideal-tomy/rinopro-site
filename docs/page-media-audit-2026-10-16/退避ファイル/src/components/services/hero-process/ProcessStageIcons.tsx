import type { JSX, ReactNode } from "react";
import type { ServiceHeroProcessStageId } from "@/lib/content/service-hero-process-stages";

type IconProps = {
  className?: string;
};

const stroke = 2.25;

function IconShell({
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function StrategyIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth={stroke} />
      <circle cx="28" cy="28" r="10" stroke="currentColor" strokeWidth={stroke} />
      <circle cx="28" cy="28" r="3" fill="currentColor" />
      <path
        d="M28 10v6M28 40v6M10 28h6M40 28h6"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </IconShell>
  );
}

function ItConsultingIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <rect
        x="10"
        y="12"
        width="36"
        height="32"
        rx="2"
        stroke="currentColor"
        strokeWidth={stroke}
      />
      <path
        d="M10 20h36M18 12V8M38 12V8"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <path
        d="M16 28h10M16 34h16M30 28l4 4-4 4"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconShell>
  );
}

function DevelopmentIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <rect
        x="8"
        y="14"
        width="40"
        height="28"
        rx="3"
        stroke="currentColor"
        strokeWidth={stroke}
      />
      <path d="M8 22h40" stroke="currentColor" strokeWidth={stroke} />
      <path
        d="M18 32l-4 4 4 4M28 40h8"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconShell>
  );
}

function DeploymentIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path
        d="M28 8l8 14H20L28 8Z"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <rect
        x="20"
        y="22"
        width="16"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth={stroke}
      />
      <path
        d="M20 34l-6 6M36 34l6 6"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <circle cx="28" cy="30" r="3" fill="currentColor" fillOpacity={0.35} />
    </IconShell>
  );
}

function OperationsIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <path
        d="M28 10c-8 4-14 12-14 22v6h28v-6c0-10-6-18-14-22Z"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <path
        d="M22 34l4 4 8-8"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconShell>
  );
}

const ICON_BY_ID: Record<
  ServiceHeroProcessStageId,
  (props: IconProps) => JSX.Element
> = {
  1: StrategyIcon,
  2: ItConsultingIcon,
  3: DevelopmentIcon,
  4: DeploymentIcon,
  5: OperationsIcon,
};

export function ProcessStageIcon({
  stageId,
  className,
}: {
  stageId: ServiceHeroProcessStageId;
  className?: string;
}) {
  const Icon = ICON_BY_ID[stageId];
  return <Icon className={className} />;
}
