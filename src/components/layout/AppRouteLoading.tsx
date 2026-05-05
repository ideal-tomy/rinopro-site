/**
 * 共通のルート遷移用スケルトン（Phase E: loading.tsx）。
 * ヘッダー／フッターは layout で残り、本文領域のみ置き換わる想定。
 */
export function AppRouteLoading() {
  return (
    <div
      className="container mx-auto flex min-h-[40vh] max-w-5xl flex-col gap-6 px-4 py-12 md:px-6 md:py-16"
      aria-busy="true"
      aria-label="読み込み中"
    >
      <div className="h-10 w-44 max-w-[60%] animate-pulse rounded-lg bg-white/10" />
      <div className="h-5 w-full max-w-2xl animate-pulse rounded-md bg-white/[0.07]" />
      <div className="h-5 w-full max-w-xl animate-pulse rounded-md bg-white/[0.06]" />
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <div className="h-36 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-36 animate-pulse rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}
