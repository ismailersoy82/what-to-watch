// Run: node --test src/tests/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyState, addItem, updateItem, removeItem, filterItems, exportJson, importJson, load, save } from "../store.js";
import { STORAGE_KEY } from "../config.js";

const it1 = { id: "tvmaze:169", kind: "series", title: "Breaking Bad", year: 2008 };
const it2 = { id: "manual:1", kind: "film", title: "Kış Uykusu", year: 2014 };

test("add / update / remove; duplicates ignored; defaults applied", () => {
  let s = addItem(emptyState(), it1, "2026-01-01T00:00:00Z");
  s = addItem(s, it1, "2026-01-02T00:00:00Z");
  assert.equal(s.items.length, 1);
  assert.equal(s.items[0].status, "want");
  s = updateItem(s, "tvmaze:169", { status: "done", rating: 9 }, "2026-01-03T00:00:00Z");
  assert.equal(s.items[0].rating, 9);
  assert.equal(s.items[0].updatedAt, "2026-01-03T00:00:00Z");
  assert.throws(() => updateItem(s, "tvmaze:169", { rating: 11 }), RangeError);
  assert.throws(() => updateItem(s, "tvmaze:169", { status: "dropped" }), RangeError);
  assert.equal(removeItem(s, "tvmaze:169").items.length, 0);
});

test("filter by status, kind and Turkish-aware text", () => {
  let s = addItem(addItem(emptyState(), it1), it2);
  s = updateItem(s, "manual:1", { status: "watching" });
  assert.deepEqual(filterItems(s, { kind: "film" }).map((i) => i.id), ["manual:1"]);
  assert.deepEqual(filterItems(s, { status: "want" }).map((i) => i.id), ["tvmaze:169"]);
  assert.deepEqual(filterItems(s, { text: "KIŞ" }).map((i) => i.id), ["manual:1"]); // İ/ı-aware lower-casing
});

test("export → import round-trip; newer copy wins; junk rows skipped; wrong files rejected", () => {
  let a = addItem(emptyState(), it1, "2026-01-01T00:00:00Z");
  a = updateItem(a, "tvmaze:169", { rating: 7 }, "2026-02-01T00:00:00Z");
  const backup = exportJson(a, "2026-02-02T00:00:00Z");
  let b = addItem(emptyState(), it1, "2026-01-01T00:00:00Z"); // older copy, no rating
  b = addItem(b, it2, "2026-01-05T00:00:00Z");
  const r = importJson(b, backup);
  assert.deepEqual([r.added, r.updated, r.skipped], [0, 1, 0]);
  assert.equal(r.state.items.find((i) => i.id === "tvmaze:169").rating, 7);
  assert.equal(r.state.items.length, 2);
  const junk = JSON.stringify({ app: "WhatToWatch", format: 1, items: [{ id: "x" }, { ...it2, id: "manual:2", status: "want" }] });
  assert.deepEqual([importJson(emptyState(), junk).added, importJson(emptyState(), junk).skipped], [1, 1]);
  assert.throws(() => importJson(b, "{not json"), SyntaxError);
  assert.throws(() => importJson(b, JSON.stringify({ app: "Other", items: [] })), /not a WhatToWatch backup/);
  assert.throws(() => importJson(b, JSON.stringify({ app: "WhatToWatch", format: 99, items: [] })), /newer version/);
});

test("persistence survives broken or missing storage", () => {
  const mem = new Map();
  const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  const s = addItem(emptyState(), it1);
  assert.equal(save(storage, s), true);
  assert.equal(load(storage).items.length, 1);
  mem.set(STORAGE_KEY, "{corrupt");
  assert.deepEqual(load(storage), emptyState());
  assert.deepEqual(load(null), emptyState());
  assert.equal(save({ setItem() { throw new Error("quota"); } }, s), false);
});
