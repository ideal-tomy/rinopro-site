import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeConsultCtaButton } from "@/components/home/HomeConsultCtaButton";
import {
  homeQuickStartCopy,
  homeSelfServeRowCopy,
} from "@/lib/content/site-copy";

export function HomeQuickStartCards() {
  return (
    <section
      className="container mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20"
      aria-label="相談・体験・料金の入口"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-5 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)]">
          <h3 className="text-[1rem] font-semibold text-text">
            {homeQuickStartCopy.consult.title}
          </h3>
          <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-text-sub">
            {homeQuickStartCopy.consult.body}
          </p>
          <HomeConsultCtaButton label={homeQuickStartCopy.consult.ctaLabel} />
        </div>
        <div className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-5 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)]">
          <h3 className="text-[1rem] font-semibold text-text">
            {homeQuickStartCopy.experience.title}
          </h3>
          <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-text-sub">
            {homeQuickStartCopy.experience.body}
          </p>
          <Button asChild className="mt-5 w-full">
            <Link href={homeQuickStartCopy.experience.ctaHref}>
              {homeQuickStartCopy.experience.ctaLabel}
            </Link>
          </Button>
        </div>
        <div className="flex h-full flex-col rounded-2xl border border-silver/20 bg-base-dark/55 p-5 ring-1 ring-warm/15 ring-inset shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--color-elevated)_12%,transparent)]">
          <h3 className="text-[1rem] font-semibold text-text">
            {homeQuickStartCopy.estimate.title}
          </h3>
          <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-text-sub">
            {homeQuickStartCopy.estimate.body}
          </p>
          <Button asChild className="mt-5 w-full">
            <Link href={homeQuickStartCopy.estimate.ctaHref}>
              {homeQuickStartCopy.estimate.ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
      <p className="mt-5 text-center text-xs text-text-sub md:mt-6">
        <span className="mr-2">{homeSelfServeRowCopy.lead}</span>
        {homeSelfServeRowCopy.links.map((item, index) => (
          <span key={item.href}>
            {index > 0 ? <span className="text-silver/40"> · </span> : null}
            <Link
              href={item.href}
              className="text-accent underline-offset-2 hover:underline"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </p>
    </section>
  );
}
