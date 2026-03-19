import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn(
        "flex min-h-[calc(100vh-4rem)] flex-1 flex-col",
        className
      )}
      role="main"
    >
      {children}
    </main>
  );
}
