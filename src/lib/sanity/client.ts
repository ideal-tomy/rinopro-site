const projectId = process.env.SANITY_PROJECT_ID ?? "";
const dataset = process.env.SANITY_DATASET ?? "production";
const baseUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`;

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  if (!projectId) return [] as T;
  const options: RequestInit = {
    next: { revalidate: 60 },
  };
  let url: string;
  if (params && Object.keys(params).length > 0) {
    options.method = "POST";
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify({ query, params });
    url = baseUrl;
  } else {
    url = `${baseUrl}?query=${encodeURIComponent(query)}`;
  }
  const res = await fetch(url, options);
  const json = await res.json();
  return json.result as T;
}
