// Hand-written fixtures in TVmaze's documented response shape (search/shows, search/people, castcredits?embed=show).
export const showsBreakingBad = [
  { score: 0.9, show: { id: 169, url: "https://www.tvmaze.com/shows/169/breaking-bad", name: "Breaking Bad", language: "English",
    genres: ["Drama", "Crime", "Thriller"], premiered: "2008-01-20", network: { name: "AMC" }, webChannel: null,
    image: { medium: "https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg", original: "x" },
    summary: "<p><b>Breaking Bad</b> follows protagonist Walter White.</p>" } },
  { score: 0.5, show: { id: 99999, url: "https://www.tvmaze.com/shows/99999/x", name: "Breaking Bad: Original Minisodes",
    genres: [], premiered: null, network: null, webChannel: { name: "AMC.com" }, image: null, summary: null } },
];
export const peopleCranston = [
  { score: 0.95, person: { id: 14245, url: "https://www.tvmaze.com/people/14245/bryan-cranston", name: "Bryan Cranston", image: { medium: "https://static.tvmaze.com/p.jpg" } } },
];
export const creditsCranston = [
  { self: true, voice: false, _links: { show: { href: "https://api.tvmaze.com/shows/169" }, character: { href: "https://api.tvmaze.com/characters/1", name: "Walter White" } },
    _embedded: { show: showsBreakingBad[0].show } },
  { self: false, voice: false, _links: { show: { href: "https://api.tvmaze.com/shows/400" }, character: { href: "https://api.tvmaze.com/characters/2", name: "Hal" } },
    _embedded: { show: { id: 400, url: "https://www.tvmaze.com/shows/400/malcolm-in-the-middle", name: "Malcolm in the Middle", genres: ["Comedy", "Family"], premiered: "2000-01-09", network: { name: "FOX" }, image: null, summary: "" } } },
  { self: false, voice: false, _links: { show: { href: "https://api.tvmaze.com/shows/400" }, character: { href: "https://api.tvmaze.com/characters/3", name: "Hal (older)" } },
    _embedded: { show: { id: 400, url: "https://www.tvmaze.com/shows/400/malcolm-in-the-middle", name: "Malcolm in the Middle", genres: ["Comedy", "Family"], premiered: "2000-01-09", network: { name: "FOX" }, image: null, summary: "" } } },
];
