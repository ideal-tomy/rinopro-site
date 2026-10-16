import { cn } from "@/lib/utils";

export type AxBeforeAfterProps = {
  beforeItems: readonly string[];
  afterItems: readonly string[];
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

export function AxBeforeAfter({
  beforeItems,
  afterItems,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  className,
}: AxBeforeAfterProps) {
  return (
    <div className={cn("ax-pattern-ba", className)}>
      <div className="ax-pattern-ba__col ax-pattern-ba__col--before">
        <span className="ax-pattern-ba__tag">{beforeLabel}</span>
        <ul className="ax-pattern-ba__list">
          {beforeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="ax-pattern-ba__mid" aria-hidden="true">
        →
      </div>
      <div className="ax-pattern-ba__col ax-pattern-ba__col--after">
        <span className="ax-pattern-ba__tag">{afterLabel}</span>
        <ul className="ax-pattern-ba__list">
          {afterItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
