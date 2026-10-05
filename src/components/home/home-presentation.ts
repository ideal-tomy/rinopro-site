/**
 * トップのコンテナ・余白・文字・CTAの管理。スマートフォンの読みやすさを優先し、PC指定は維持。
 * 各セクションの差は意図的に残す。カード内部・図解・デモ再生は各部品が担当。
 * 共通見出しは旧トップ部品も利用するため、変更時は利用元を確認する。
 * サイト共用CTAは lib/ui/landing-cta-styles.ts が担当する。
 */

export const HOME_FIRST_VIEW_STYLES = {
  "panel": "w-full max-w-none rounded-sm bg-black/40 px-5 py-6 shadow-[0_8px_32px_rgb(0_0_0_/_0.18)] backdrop-blur-[2px] md:max-w-xl md:rounded-2xl md:px-9 md:py-9",
  "overlay": "pointer-events-none absolute inset-0 z-10 flex items-end px-4 pb-14 pt-8 md:items-center md:px-8 md:py-10 lg:px-12",
  "eyebrow": "mb-6 flex items-center gap-3 text-sm font-bold tracking-[0.08em] text-white md:text-[1rem]",
  "heading": "text-balance text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.18] tracking-tight text-white md:leading-[1.15]",
  "lead": "mt-6 max-w-[36ch] text-[17px] font-medium leading-[1.8] text-white md:mt-8 md:text-[18px]",
  "body": "mt-6 max-w-[40ch] whitespace-pre-line text-[16px] leading-[1.8] text-white md:mt-8 md:text-[17px]"
} as const;

export const HOME_BRAND_STORY_STYLES = {
  "container": "relative mx-auto max-w-4xl px-5 py-14 text-center md:px-12 md:py-20",
  "heading": "text-balance text-[clamp(1.375rem,4.6vw,3rem)] font-bold leading-[1.18] tracking-tight text-white md:text-[clamp(2rem,4vw,3rem)]",
  "underline": "mx-auto mt-6 h-[3px] w-14 rounded-full bg-white/90 md:mt-7",
  "body": "mt-8 space-y-6 text-left text-[16px] leading-[1.9] text-white md:mt-12 md:text-center md:text-[17px]",
  "closing": "pt-2 text-[18px] font-semibold text-white md:text-[20px]"
} as const;

export const HOME_DEMO_SHOWCASE_STYLES = {
  "section": "home-demo-first bg-[var(--df-bg-blue)] py-[clamp(40px,8vw,64px)] md:py-20",
  "container": "container mx-auto max-w-6xl px-5 md:px-6",
  "heading": "mb-4 text-[clamp(26px,5.6vw,40px)] leading-[1.5] font-bold text-[var(--df-text)] md:mb-6",
  "body": "mb-6 max-w-[640px] text-[16px] leading-[1.75] text-[var(--df-text-muted)] md:mb-8 md:text-[17px]",
  "ctaContainer": "container mx-auto mt-8 flex max-w-6xl justify-center px-4 md:mt-10 md:px-6",
  "cta": "inline-flex items-center gap-2.5 rounded-xl border border-[var(--site-border)] bg-[var(--df-bg)] px-7 py-3.5 font-bold text-[var(--df-text)] transition-colors hover:border-[var(--df-primary)]/45 hover:text-[var(--df-primary)]"
} as const;

export const HOME_INDUSTRY_STYLES = {
  "section": "container mx-auto max-w-6xl scroll-mt-32 px-5 py-16 md:px-6 md:py-[120px]"
} as const;

export const HOME_VALUES_STYLES = {
  "section": "relative scroll-mt-28 overflow-hidden bg-[#eaf3fb] py-[clamp(56px,12vw,96px)] md:py-[clamp(80px,14vw,120px)]",
  "container": "relative mx-auto w-[min(100%-2.5rem,1080px)] md:w-[min(100%-3rem,1080px)]",
  "heading": "whitespace-pre-line text-balance text-[clamp(26px,6.2vw,44px)] font-black leading-[1.35]",
  "itemHeading": "mb-4 text-[clamp(20px,3.2vw,28px)] font-black leading-[1.4]",
  "body": "max-w-[34rem] text-[16px] leading-[1.8]",
  "primaryCta": "inline-flex items-center gap-2 rounded-xl bg-[#26418e] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#1c356f]",
  "secondaryCta": "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-bold transition-colors hover:border-[#26418e]/50 hover:text-[#26418e]"
} as const;

export const HOME_CEO_STYLES = {
  "section": "container mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-[120px] scroll-mt-28",
  "role": "text-sm font-semibold tracking-wide text-[var(--color-accent-primary)]",
  "name": "text-2xl font-bold text-[var(--color-text-primary)]",
  "heading": "text-[28px] font-bold leading-tight text-[var(--color-text-primary)]",
  "body": "mt-4 space-y-5 text-[16px] leading-[1.9] text-[var(--color-text-secondary)] md:text-[17px]"
} as const;

export const HOME_FAQ_STYLES = {
  "section": "container mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-[120px] scroll-mt-32",
  "list": "mx-auto mt-4 max-w-3xl list-none space-y-4",
  "question": "cursor-pointer list-none rounded-xl px-5 py-5 text-[17px] font-semibold leading-[1.8] text-[var(--color-text-primary)] text-balance marker:content-none [&::-webkit-details-marker]:hidden md:px-6 md:py-5 md:text-[18px]",
  "chevron": "mt-0.5 shrink-0 text-[var(--color-accent-primary)] transition group-open:rotate-180",
  "answer": "border-t border-[var(--color-border-light)] px-5 py-5 text-[16px] leading-[1.8] text-[var(--color-text-secondary)] md:px-6 md:text-[17px]"
} as const;

export const HOME_CLOSING_CTA_STYLES = {
  "section": "border-t border-[var(--color-border-light)] bg-[var(--color-bg-pure)] py-[clamp(56px,12vw,88px)] text-center text-[var(--color-text-primary)] md:py-[clamp(72px,12vw,112px)]",
  "container": "container mx-auto max-w-3xl px-5 md:px-6",
  "heading": "mb-6 text-[clamp(24px,6.2vw,44px)] leading-[1.35] font-bold text-[var(--color-text-primary)]",
  "body": "mx-auto mb-8 max-w-[560px] text-left text-[16px] leading-[1.8] md:mb-10 md:text-center md:text-[17px] text-[var(--color-text-secondary)]",
  "primaryCta": "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl sm:w-auto bg-[var(--color-accent-primary)] px-8 py-4 text-lg font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-accent-primary-hover)]",
  "estimateLink": "text-sm font-bold text-[var(--color-accent-primary)] underline-offset-4 hover:underline"
} as const;

export const HOME_SECTION_HEADING_STYLES = {
  "container": "mx-auto mb-10 max-w-4xl text-center md:mb-20",
  "title": "whitespace-pre-line text-balance text-[clamp(1.75rem,4.6vw,3rem)] font-bold leading-[1.18] tracking-tight text-[var(--color-text-primary)] md:text-[clamp(2rem,4vw,3rem)] lg:text-[clamp(2.25rem,3.6vw,3rem)]",
  "description": "mx-auto mt-8 max-w-[40ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:mt-10 md:text-[18px]"
} as const;
