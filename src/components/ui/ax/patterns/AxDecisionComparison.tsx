import { cn } from "@/lib/utils";

export type AxDecisionItem = {
  title: string;
  body: string;
};

export type AxDecisionComparisonProps = {
  items: readonly AxDecisionItem[];
  className?: string;
};

export function AxDecisionComparison({
  items,
  className,
}: AxDecisionComparisonProps) {
  return (
    <ul className={cn("ax-pattern-compare", className)}>
      {items.map((item) => (
        <li key={item.title} className="ax-pattern-compare__item">
          <h3 className="ax-pattern-compare__title">{item.title}</h3>
          <p className="ax-pattern-compare__body">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
