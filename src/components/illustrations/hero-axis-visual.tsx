export function HeroAxisVisual() {
  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      className="illus-hero-svg pointer-events-none h-[min(55vw,380px)] w-[min(85vw,520px)] select-none opacity-[0.14] sm:opacity-[0.18] md:h-[420px] md:w-[520px] md:opacity-[0.22]"
      fill="none"
      aria-hidden
    >
      <line
        x1="300"
        y1="120"
        x2="300"
        y2="480"
        stroke="var(--color-accent-primary)"
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="300"
          y1={420 - i * 52}
          x2={340 + i * 36}
          y2={320 - i * 48}
          stroke="var(--color-accent-primary)"
          strokeWidth="1"
          strokeOpacity={0.12 + i * 0.05}
          className="illus-hero-line"
          style={{ animationDelay: `${0.15 + i * 0.08}s` }}
        />
      ))}
      <circle
        cx="300"
        cy="300"
        r="3"
        fill="var(--color-warm)"
        className="illus-hero-pulse"
      />
    </svg>
  );
}
