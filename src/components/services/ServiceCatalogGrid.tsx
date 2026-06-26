import Link from "next/link";
import { homeLandingCopy } from "@/lib/content/home-landing";

const { solutions } = homeLandingCopy;

export function ServiceCatalogGrid() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <h2 className="text-center text-[clamp(1.25rem,2.8vw,1.65rem)] font-bold text-text">
        提供サービス
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-[16px] leading-[1.8] text-text-sub md:text-[17px]">
        {solutions.intro}
      </p>
      <ul className="mt-10 grid list-none gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
        {solutions.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="interactive-card group block h-full rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)] transition-colors hover:border-[var(--color-accent-primary)] md:p-7"
            >
              <h3 className="text-[20px] font-semibold leading-snug text-text">
                {item.title}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.8] text-text-sub">
                {item.body}
              </p>
              <p className="mt-5 text-[15px] font-semibold text-[var(--color-accent-primary)] underline-offset-4 group-hover:underline">
                詳しく見る
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
