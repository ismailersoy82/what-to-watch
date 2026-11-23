import { test } from "node:test";
import assert from "node:assert/strict";
import { searchShows, searchPeople, personShows, normaliseShow } from "../sources/tvmaze.js";
import { showsBreakingBad, peopleCranston, creditsCranston } from "./fixtures/tvmaze.mjs";

const fakeFetch = (routes, calls = []) => async (url) => {
  calls.push(url);
  const hit = Object.entries(routes).find(([k]) => url.includes(k));
  if (!hit) return { ok: false, status: 404, json: async () => ({}) };
  const [, body] = hit;
  if (body === 429) return { ok: false, status: 429, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => body };
};

test("show search normalises to the app item shape (HTML stripped, nulls tolerated)", async () => {
  const calls = [];
  const r = await searchShows("  breaking bad ", fakeFetch({ "/search/shows?q=breaking%20bad": showsBreakingBad }, calls));
  assert.equal(calls[0], "https://api.tvmaze.com/search/shows?q=breaking%20bad");
  assert.deepEqual(r[0], {
    id: "tvmaze:169", kind: "series", title: "Breaking Bad", year: 2008,
    image: "https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg", genres: ["Drama", "Crime", "Thriller"],
    network: "AMC", summary: "Breaking Bad follows protagonist Walter White.", url: "https://www.tvmaze.com/shows/169/breaking-bad", source: "TVmaze",
  });
  assert.equal(r[1].year, null);
  assert.equal(r[1].image, null);
  assert.equal(r[1].network, "AMC.com");
  assert.deepEqual(await searchShows("   ", fakeFetch({})), []);
});

test("actor search → series they appear in, one entry per show with all character names, newest first", async () => {
  const f = fakeFetch({ "/search/people?q=bryan%20cranston": peopleCranston, "/people/14245/castcredits?embed=show": creditsCranston });
  const people = await searchPeople("bryan cranston", f);
  assert.deepEqual(people[0], { id: "tvmaze-person:14245", tvmazeId: 14245, name: "Bryan Cranston", image: "https://static.tvmaze.com/p.jpg", url: "https://www.tvmaze.com/people/14245/bryan-cranston", source: "TVmaze" });
  const shows = await personShows(14245, f);
  assert.deepEqual(shows.map((s) => s.title), ["Breaking Bad", "Malcolm in the Middle"]);
  assert.deepEqual(shows[1].characters, ["Hal", "Hal (older)"]);
});

test("rate limit and HTTP errors surface as errors", async () => {
  await assert.rejects(searchShows("x", fakeFetch({ "/search/shows": 429 })), /rate-limited/);
  await assert.rejects(searchShows("x", fakeFetch({})), /TVmaze 404/);
  assert.equal(normaliseShow({ id: 1, name: "A" }).genres.length, 0);
});
