import type { AiDemo, DemoItem } from "@/lib/sanity/types";

export type DemoCatalogEntry = AiDemo | DemoItem;

let cachedCatalog: DemoCatalogEntry[] | null = null;
let inflight: Promise<DemoCatalogEntry[]> | null = null;

async function fetchDemoCatalogFromApi(): Promise<DemoCatalogEntry[]> {
  const r = await fetch("/api/demos/catalog");
  const data: unknown = await r.json();
  return Array.isArray(data) ? (data as DemoCatalogEntry[]) : [];
}

/**
 * 同一タブ内でカタログを共有し、並行取得は 1 本に束ねる。
 */
export function getDemoCatalogCached(): Promise<DemoCatalogEntry[]> {
  if (cachedCatalog !== null) {
    return Promise.resolve(cachedCatalog);
  }
  if (inflight) return inflight;

  inflight = fetchDemoCatalogFromApi()
    .then((list) => {
      cachedCatalog = list;
      return list;
    })
    .catch(() => {
      cachedCatalog = [];
      return [];
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** FAB ホバー等。失敗は getDemoCatalogCached 側で [] に正規化済み。 */
export function prefetchDemoCatalog(): void {
  void getDemoCatalogCached();
}
