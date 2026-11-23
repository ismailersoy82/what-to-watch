// TVmaze adapter (series + people). No API key; CORS-enabled; ~20 requests / 10 s per IP.
// Licence: CC BY-SA — TVmaze must be credited and linked (see the app footer and each item's url).
const BASE = "https://api.tvmaze.com";

const stripHtml = (s) => (s || "").replace(/<[^>]*>/g, "").trim();

/** Normalise a TVmaze show object to the app's item shape. */
export function normaliseShow(show) {
  return {
    id: `tvmaze:${show.id}`,
    kind: "series",
    title: show.name,
    year: show.premiered ? Number(show.premiered.slice(0, 4)) : null,
    image: show.image?.medium || null,
    genres: show.genres || [],
    network: show.network?.name || show.webChannel?.name || null,
    summary: stripHtml(show.summary).slice(0, 300),
    url: show.url || null,
    source: "TVmaze",
  };
}

async function getJson(fetchFn, path) {
  const res = await fetchFn(BASE + path);
  if (res.status === 429) throw new Error("rate-limited");
  if (!res.ok) throw new Error(`TVmaze ${res.status}`);
  return res.json();
}

export async function searchShows(query, fetchFn = fetch) {
  const q = query.trim();
  if (!q) return [];
  const data = await getJson(fetchFn, `/search/shows?q=${encodeURIComponent(q)}`);
  return data.map((r) => normaliseShow(r.show));
}

export async function searchPeople(query, fetchFn = fetch) {
  const q = query.trim();
  if (!q) return [];
  const data = await getJson(fetchFn, `/search/people?q=${encodeURIComponent(q)}`);
  return data.map(({ person }) => ({
    id: `tvmaze-person:${person.id}`, tvmazeId: person.id, name: person.name,
    image: person.image?.medium || null, url: person.url || null, source: "TVmaze",
  }));
}

/** Series a person appears in as cast, newest first, one entry per show (with character names). */
export async function personShows(tvmazeId, fetchFn = fetch) {
  const data = await getJson(fetchFn, `/people/${tvmazeId}/castcredits?embed=show`);
  const byShow = new Map();
  for (const credit of data) {
    const show = credit._embedded?.show;
    if (!show) continue;
    const item = byShow.get(show.id) || { ...normaliseShow(show), characters: [] };
    const ch = credit._links?.character?.name;
    if (ch && !item.characters.includes(ch)) item.characters.push(ch);
    byShow.set(show.id, item);
  }
  return [...byShow.values()].sort((a, b) => (b.year || 0) - (a.year || 0));
}
