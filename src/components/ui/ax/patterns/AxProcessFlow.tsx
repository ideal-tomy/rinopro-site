import { cn } from "@/lib/utils";

export type AxProcessFlowStep = {
  label: string;
  title: string;
  body: string;
};

export type AxProcessFlowProps = {
  steps: readonly AxProcessFlowStep[];
  layout?: "horizontal" | "stack";
  className?: string;
};

export function AxProcessFlow({
  steps,
  layout = "horizontal",
  className,
}: AxProcessFlowProps) {
  return (
    <ol
      className={cn(
        "ax-pattern-flow",
        layout === "horizontal" && "ax-pattern-flow--horizontal",
        className
      )}
    >
      {steps.map((step) => (
        <li key={step.label} className="ax-pattern-flow__step">
          <p className="ax-pattern-flow__label">{step.label}</p>
          <h3 className="ax-pattern-flow__title">{step.title}</h3>
          <p className="ax-pattern-flow__body">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
