const projectId = process.env.SANITY_PROJECT_ID ?? "";
const dataset = process.env.SANITY_DATASET ?? "production";

export async function sanityFetch<T>(query: string): Promise<T> {
  if (!projectId) return [] as T;
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`,
    { next: { revalidate: 60 } }
  );
  const json = await res.json();
  return json.result as T;
}
