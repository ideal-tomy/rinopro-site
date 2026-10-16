import { cn } from "@/lib/utils";

function SkeletonShimmer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-silver/20",
        className
      )}
      {...props}
    />
  );
}

export { SkeletonShimmer };
