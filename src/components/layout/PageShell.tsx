import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn(
        // モバイルは 100dvh（アドレスバー等と整合）。md 以上は従来どおり 100vh で PC 表示を変えない。
        "flex min-h-[calc(100dvh-4rem)] flex-1 flex-col md:min-h-[calc(100vh-4rem)]",
        className
      )}
      role="main"
    >
      {children}
    </main>
  );
}
