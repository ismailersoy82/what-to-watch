import { APP_NAME, STATUSES } from "./config.js";
import { emptyState, addItem, updateItem, removeItem, filterItems, exportJson, importJson, load, save } from "./store.js";
import { searchShows, searchPeople, personShows } from "./sources/tvmaze.js";

const $ = (id) => document.getElementById(id);
const storage = (() => { try { return window.localStorage; } catch { return null; } })();
const STATUS_LABEL = { want: "İzlenecek", watching: "İzleniyor", done: "İzlendi" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let state = load(storage) || emptyState();
let mode = "series";

function commit(next) {
  state = next;
  if (!save(storage, state)) setStatus("Uyarı: tarayıcı kaydetmeye izin vermiyor; yedek almayı unutma.");
  renderList();
}

function setStatus(msg) { $("status").textContent = msg || ""; }

function itemCard(it, { inList }) {
  const meta = [it.kind === "film" ? "Film" : "Dizi", it.year, it.network, (it.genres || []).slice(0, 2).join(", ")].filter(Boolean).join(" · ");
  const chars = it.characters?.length ? `<p class="muted small">Rol: ${esc(it.characters.join(", "))}</p>` : "";
  const img = it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy" width="60" height="85">` : `<div class="noimg" aria-hidden="true">${esc(it.title[0] || "?")}</div>`;
  const link = it.url ? ` <a href="${esc(it.url)}" target="_blank" rel="noopener" class="src">${esc(it.source)}</a>` : "";
  const right = inList
    ? `<div class="edit">
        <select data-act="status" aria-label="Durum">${STATUSES.map((s) => `<option value="${s}"${s === it.status ? " selected" : ""}>${STATUS_LABEL[s]}</option>`).join("")}</select>
        <select data-act="rating" aria-label="Puan"><option value="">Puan</option>${Array.from({ length: 10 }, (_, i) => i + 1).map((n) => `<option${n === it.rating ? " selected" : ""}>${n}</option>`).join("")}</select>
        <button type="button" data-act="remove" class="ghost danger" aria-label="Sil">Sil</button>
      </div>
      <textarea data-act="notes" rows="1" placeholder="Not">${esc(it.notes)}</textarea>`
    : state.items.some((x) => x.id === it.id)
      ? `<span class="added">Listende</span>`
      : `<button type="button" data-act="add">Ekle</button>`;
  return `<li data-id="${esc(it.id)}">${img}<div class="body"><strong>${esc(it.title)}</strong>${link}<p class="muted small">${esc(meta)}</p>${chars}${right}</div></li>`;
}

let lastResults = [];
function renderResults(items) {
  lastResults = items;
  $("results").innerHTML = items.map((it) => itemCard(it, { inList: false })).join("");
}

function renderPeople(people) {
  $("results").innerHTML = people.map((p) =>
    `<li class="person" data-person="${p.tvmazeId}">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy" width="60" height="85">` : `<div class="noimg">${esc(p.name[0])}</div>`}
     <div class="body"><strong>${esc(p.name)}</strong><p class="muted small">Oynadığı dizileri göster</p>
     <button type="button" data-act="credits">Dizileri</button></div></li>`).join("");
}

function renderList() {
  const items = filterItems(state, { status: $("fStatus").value, kind: $("fKind").value, text: $("fText").value });
  $("list").innerHTML = items.map((it) => itemCard(it, { inList: true })).join("");
  $("count").textContent = `(${state.items.length})`;
  $("empty").hidden = state.items.length > 0;
  if (lastResults.length) renderResults(lastResults); // refresh "Listende" badges
}

async function runSearch(q) {
  setStatus("Aranıyor…");
  try {
    if (mode === "series") {
      const r = await searchShows(q);
      renderResults(r);
      setStatus(r.length ? `${r.length} dizi bulundu.` : "Sonuç yok.");
    } else {
      const p = await searchPeople(q);
      renderPeople(p);
      setStatus(p.length ? `${p.length} kişi bulundu. Birini seç.` : "Sonuç yok.");
    }
  } catch (e) {
    setStatus(e.message === "rate-limited" ? "Çok hızlı arama yapıldı; birkaç saniye bekleyip tekrar dene." : "Arama yapılamadı. İnternet bağlantını kontrol et.");
  }
}

function setMode(m) {
  mode = m;
  document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.mode === m)));
  $("searchForm").hidden = m === "manual";
  $("manualForm").hidden = m !== "manual";
  $("q").placeholder = m === "person" ? "Oyuncu adı" : "Dizi adı";
  $("results").innerHTML = ""; lastResults = []; setStatus("");
}

async function showBuild() {
  try {
    const text = await (await fetch(new URL("../VERSION.md", import.meta.url))).text();
    const meta = JSON.parse(text.match(/<!--\s*(\{.*?\})\s*-->/)[1]);
    $("build").textContent = `v${meta.version} · ROOT:${String(meta.root).padStart(2, "0")}`;
  } catch { /* version is informational */ }
}

function init() {
  document.title = APP_NAME;
  $("appName").textContent = APP_NAME;
  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $("searchForm").addEventListener("submit", (e) => { e.preventDefault(); runSearch($("q").value); });
  $("manualForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = $("mTitle").value.trim();
    if (!title) return;
    const year = Number($("mYear").value) || null;
    commit(addItem(state, { id: `manual:${Date.now()}`, kind: $("mKind").value, title, year, image: null, genres: [], url: null, source: "Elle" }));
    $("manualForm").reset(); setStatus(`"${title}" listene eklendi.`);
  });
  $("results").addEventListener("click", async (e) => {
    const li = e.target.closest("li");
    if (e.target.dataset.act === "add") {
      const it = lastResults.find((x) => x.id === li.dataset.id);
      if (it) { commit(addItem(state, it)); setStatus(`"${it.title}" listene eklendi.`); }
    } else if (e.target.dataset.act === "credits") {
      setStatus("Diziler getiriliyor…");
      try {
        const r = await personShows(Number(li.dataset.person));
        renderResults(r);
        setStatus(r.length ? `${li.querySelector("strong").textContent}: ${r.length} dizi.` : "Bu kişinin kayıtlı dizisi yok.");
      } catch { setStatus("Diziler getirilemedi."); }
    }
  });
  $("list").addEventListener("change", (e) => {
    const id = e.target.closest("li")?.dataset.id; const act = e.target.dataset.act;
    if (act === "status") commit(updateItem(state, id, { status: e.target.value }));
    if (act === "rating") commit(updateItem(state, id, { rating: e.target.value ? Number(e.target.value) : null }));
    if (act === "notes") commit(updateItem(state, id, { notes: e.target.value }));
  });
  $("list").addEventListener("click", (e) => {
    if (e.target.dataset.act !== "remove") return;
    const id = e.target.closest("li").dataset.id;
    const it = state.items.find((x) => x.id === id);
    commit(removeItem(state, id)); setStatus(`"${it?.title}" listeden çıkarıldı.`);
  });
  for (const id of ["fStatus", "fKind", "fText"]) $(id).addEventListener("input", renderList);
  $("exportBtn").addEventListener("click", () => {
    const blob = new Blob([exportJson(state)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `whattowatch-yedek-${new Date().toISOString().slice(0, 10)}.json` });
    a.click(); URL.revokeObjectURL(a.href);
  });
  $("importFile").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const r = importJson(state, await f.text());
      commit(r.state); setStatus(`Yedek yüklendi: ${r.added} yeni, ${r.updated} güncellendi, ${r.skipped} atlandı.`);
    } catch (err) { setStatus(`Yedek yüklenemedi: ${err.message}`); }
    e.target.value = "";
  });
  renderList();
  showBuild();
}

init();
