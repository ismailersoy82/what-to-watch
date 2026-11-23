// Watchlist model. Pure functions over a plain state object, plus thin localStorage helpers.
// Item shape (normalised, provider-independent):
// { id: "tvmaze:123", kind: "series" | "film", title, year, image, genres[], url, source,
//   status: "want" | "watching" | "done", rating: null | 1–10, notes: "", addedAt, updatedAt }
import { APP_NAME, STORAGE_KEY, EXPORT_FORMAT, STATUSES } from "./config.js";

export const emptyState = () => ({ items: [] });

const now = () => new Date().toISOString();

export function addItem(state, item, at = now()) {
  if (!item?.id || !item.title) throw new TypeError("item needs id and title");
  if (state.items.some((i) => i.id === item.id)) return state; // already in the list
  const entry = { status: "want", rating: null, notes: "", ...item, addedAt: at, updatedAt: at };
  return { ...state, items: [entry, ...state.items] };
}

export function updateItem(state, id, patch, at = now()) {
  if (patch.status != null && !STATUSES.includes(patch.status)) throw new RangeError("bad status");
  if (patch.rating != null && !(Number.isInteger(patch.rating) && patch.rating >= 1 && patch.rating <= 10)) throw new RangeError("rating must be 1–10");
  return { ...state, items: state.items.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: at } : i)) };
}

export function removeItem(state, id) {
  return { ...state, items: state.items.filter((i) => i.id !== id) };
}

export function filterItems(state, { status = "all", kind = "all", text = "" } = {}) {
  const q = text.trim().toLocaleLowerCase("tr");
  return state.items.filter((i) =>
    (status === "all" || i.status === status) &&
    (kind === "all" || i.kind === kind) &&
    (!q || i.title.toLocaleLowerCase("tr").includes(q)));
}

export function exportJson(state, at = now()) {
  return JSON.stringify({ app: APP_NAME, format: EXPORT_FORMAT, exportedAt: at, items: state.items }, null, 2);
}

/**
 * Merge a backup into the current list. Same id → the more recently updated copy wins.
 * Returns { state, added, updated, skipped }.
 */
export function importJson(state, text) {
  let data;
  try { data = JSON.parse(text); } catch { throw new SyntaxError("not a JSON file"); }
  if (data?.app !== APP_NAME || !Array.isArray(data.items)) throw new TypeError("not a WhatToWatch backup");
  if (data.format > EXPORT_FORMAT) throw new RangeError("backup is from a newer version");
  const byId = new Map(state.items.map((i) => [i.id, i]));
  let added = 0, updated = 0, skipped = 0;
  for (const raw of data.items) {
    if (!raw?.id || !raw.title || !STATUSES.includes(raw.status)) { skipped++; continue; }
    const cur = byId.get(raw.id);
    if (!cur) { byId.set(raw.id, raw); added++; }
    else if ((raw.updatedAt || "") > (cur.updatedAt || "")) { byId.set(raw.id, raw); updated++; }
    else skipped++;
  }
  const items = [...byId.values()].sort((a, b) => (b.addedAt || "").localeCompare(a.addedAt || ""));
  return { state: { ...state, items }, added, updated, skipped };
}

export function load(storage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return Array.isArray(data?.items) ? { items: data.items } : emptyState();
  } catch { return emptyState(); }
}

export function save(storage, state) {
  try { storage?.setItem(STORAGE_KEY, JSON.stringify({ items: state.items })); return true; } catch { return false; }
}
