import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function BaseIcon({ className, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function CaseStudyArrowRight({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </BaseIcon>
  );
}

export function CaseStudyArrowDown({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M12 5v14M7 14l5 5 5-5" />
    </BaseIcon>
  );
}

export function CaseStudyExternal({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M14 5h5v5M10 14 19 5M19 10v9H5V5h9" />
    </BaseIcon>
  );
}

export function CaseStudyArrowUpRight({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </BaseIcon>
  );
}

export function CaseStudyCheck({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </BaseIcon>
  );
}

export function CaseStudyPlay({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M7 5v14l12-7z" />
    </BaseIcon>
  );
}

export function CaseStudySpark({ className, ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </BaseIcon>
  );
}
