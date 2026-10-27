// Troll du mois (locost.fr) : vote des 7 derniers jours du mois, révélation dès le 1er, historique des mois passés.
// Les stats de chaque mois sont figées à l'ouverture du vote (donnees/AAAA-MM.json, exportées par lol-report/troll_du_mois.py).
// Les votes vivent dans Supabase (table votes) ; les règles côté serveur font foi pour la fenêtre de vote et la visibilité.
"use strict";

const BASE = "/qui-ma-troll/troll-du-mois/";
const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
const tactile = matchMedia("(hover: none)").matches;
const $ = id => document.getElementById(id);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const fmt = (x, d = 1) => Number(x).toFixed(d).replace(".", ",");
const memoire = {
  lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sans mémoire locale */ } },
};

// ---------- Heure de Paris (même calendrier que les règles Supabase) ----------
function decalageParis(date) {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const p = Object.fromEntries(f.formatToParts(date).map(x => [x.type, Number(x.value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - date.getTime();
}
function minuitParis(annee, mois0, jour) {
  const t = Date.UTC(annee, mois0, jour);
  return new Date(t - decalageParis(new Date(t)));
}
const decouper = m => m.split("-").map(Number);
const finVote = m => { const [a, mo] = decouper(m); return minuitParis(a, mo, 1); };           // 1er du mois suivant
const debutVote = m => { const [a, mo] = decouper(m); return minuitParis(a, mo, 1 - 7); };     // 7 derniers jours
function moisParis(date) {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" });
  return f.format(date).slice(0, 7);
}
const titreMois = m => { const [a, mo] = decouper(m); return `${MOIS_FR[mo - 1]} ${a}`; };
const de = t => (/^[aeiouéèh]/i.test(t) ? "d'" : "de ") + t;   // « d'octobre », « de novembre »
const dateCourte = d => d.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long" });

// ---------- État ----------
const cfg = window.TROLL_CONFIG || {};
const sb = cfg.supabaseUrl && cfg.supabaseCle && window.supabase ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseCle) : null;
let session = null, monVote = null, monMotif = "", nbVotants = null;
let M = moisParis(new Date());       // mois en cours (heure de Paris)
let D = null, J = [], i = -1, enCours = false, smin = 0, smax = 1;
let indexMois = [];
const cacheMois = {}, cacheVotes = {};

async function donneesMois(m) {
  if (!(m in cacheMois)) {
    cacheMois[m] = fetch(`${BASE}donnees/${m}.json`, { cache: "no-cache" }).then(r => r.ok ? r.json() : null).catch(() => null);
  }
  return cacheMois[m];
}
async function votesMois(m) {
  if (!sb) return null;
  if (!(m in cacheVotes)) {
    cacheVotes[m] = sb.from("votes").select("votant, votant_nom, cible, motif").eq("mois", m)
      .then(({ data, error }) => error ? null : data).catch(() => null);
  }
  return cacheVotes[m];
}
const enVote = () => Date.now() >= debutVote(M).getTime() && Date.now() < finVote(M).getTime();
const moiId = () => session?.user?.id || null;
const monNom = () => { const u = session?.user?.user_metadata || {}; return u.custom_claims?.global_name || u.full_name || u.name || "toi"; };

// ---------- Pluie de sel (révélation du gagnant) ----------
const toile = $("sel"), ctx = toile.getContext("2d");
let grains = [], sources = [], boucle = null;
function taille() { const r = devicePixelRatio || 1; toile.width = innerWidth * r; toile.height = innerHeight * r; ctx.setTransform(r, 0, 0, r, 0, 0); }
addEventListener("resize", taille); taille();
function verser(x, y, largeur, ms, debit) {
  if (calme) return;
  sources.push({ x, y, largeur, debit, fin: performance.now() + ms });
  if (!boucle) boucle = requestAnimationFrame(tic);
}
function tic(t) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  sources = sources.filter(s => t < s.fin);
  for (const s of sources) for (let k = 0; k < s.debit; k++)
    grains.push({ x: s.x + (Math.random() - .5) * s.largeur, y: -10 - Math.random() * 260, vx: (Math.random() - .5) * 1.4,
      vy: Math.random() * 4 + .5, r: Math.random() * 2 + .8, a: .55 + Math.random() * .45 });
  for (const g of grains) { g.vy += .14; g.x += g.vx; g.y += g.vy; }
  grains = grains.filter(g => g.y < innerHeight + 10);
  for (const g of grains) { ctx.fillStyle = `rgba(246, 249, 252, ${g.a})`; ctx.fillRect(g.x, g.y, g.r, g.r); }
  boucle = grains.length || sources.length ? requestAnimationFrame(tic) : null;
}
function arreterSel() { sources = []; }

// ---------- Connexion Discord ----------
const LOGO_DISCORD = '<svg viewBox="0 0 71 55" aria-hidden="true"><path fill="currentColor" d="M60.1 4.9A58.5 58.5 0 0 0 45.6.4a40 40 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A40 40 0 0 0 25.8.4 58.4 58.4 0 0 0 11.3 4.9C2.1 18.6-.4 32 .8 45.2a58.9 58.9 0 0 0 18 9.1 43 43 0 0 0 3.8-6.2 38 38 0 0 1-6-2.9l1.5-1.1a42 42 0 0 0 35.8 0l1.5 1.1a38 38 0 0 1-6 2.9 43 43 0 0 0 3.8 6.2 58.7 58.7 0 0 0 18-9.1c1.5-15.3-2.5-28.6-10.6-40.3ZM23.7 37.1c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.3 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.3 6.4 7.2c0 4-2.8 7.2-6.4 7.2Z"/></svg>';
async function connexion(apresCle) {
  if (!sb) return;
  if (apresCle) try { sessionStorage.setItem("troll-designer", apresCle); } catch (e) { /* tant pis */ }
  await sb.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: location.origin + location.pathname } });
}
function rendreCompte() {
  const c = $("compte"); c.replaceChildren();
  if (!sb) return;
  if (session) {
    const q = el("span", "qui"); q.append("Connecté : ", el("b", null, monNom()));
    const s = el("button", "lien-discret", "Déconnexion"); s.type = "button";
    s.addEventListener("click", async () => { await sb.auth.signOut(); });
    c.append(q, s);
  } else {
    const b = el("button", "bouton-discord"); b.type = "button"; b.innerHTML = LOGO_DISCORD; b.append("Se connecter avec Discord");
    b.addEventListener("click", () => connexion()); c.append(b);
  }
}

// ---------- Bandeau : compte à rebours et bouton de révélation ----------
function decompte(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const j = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), mn = Math.floor(s % 3600 / 60), sec = s % 60;
  const out = el("span", "decompte");
  const bout = (n, u) => { out.append(String(n).padStart(2, "0")); out.append(el("small", null, u)); };
  if (j) bout(j, "j"); bout(h, "h"); bout(mn, "min"); if (!j) bout(sec, "s");
  return out;
}
let modePrecedent = null;
function rendreBandeau() {
  const b = $("bandeau"); b.replaceChildren();
  const gauche = el("div");
  if (enVote()) {
    const n = nbVotants;
    gauche.append(el("div", "etiquette", `Vote ouvert · ${n == null ? "" : `${n} votant${n > 1 ? "s" : ""} · `}révélation dans`), decompte(finVote(M) - Date.now()));
    const r = el("button", "reveler", "Révéler"); r.type = "button"; r.disabled = true;
    r.title = `Disponible le 1er ${MOIS_FR[decouper(M)[1] % 12]} à minuit`;
    b.append(gauche, r);
  } else {
    gauche.append(el("div", "etiquette", `Prochain vote, ${titreMois(M)}, dans`), decompte(debutVote(M) - Date.now()));
    b.append(gauche);   // la révélation du mois écoulé est dans la vue « dernier Troll »
  }
}
setInterval(() => {
  M = moisParis(new Date());
  const mode = enVote();
  if (modePrecedent !== null && mode !== modePrecedent) { location.reload(); return; }  // ouverture ou clôture pendant la visite
  modePrecedent = mode;
  rendreBandeau();
}, 1000);

// ---------- Vue de vote : un joueur à la fois ----------
function scene(stage, j, sens, anime, pleure, tampon) {
  for (const old of stage.querySelectorAll(".joueur:not(.sort)")) {
    if (anime && !calme) { old.style.setProperty("--sens", sens); old.classList.add("sort"); setTimeout(() => old.remove(), 460); }
    else old.remove();
  }
  const w = el("div", "joueur" + (anime && !calme ? " entre" : ""));
  w.style.setProperty("--sens", sens);
  const t = el("div", "tilt"), f = el("div", "flotte");
  if (j.avatar) { const img = el("img"); img.src = pleure && j.pleure ? j.pleure : j.avatar; img.alt = j.nom; img.draggable = false; f.append(img); }
  else f.append(el("span", "initiale", j.nom[0].toUpperCase()));
  t.append(f);
  w.append(el("div", "aura"), el("div", "anneau"), t, el("div", "ombre"));
  if (tampon) w.append(el("div", "tampon", "Désigné"));
  stage.append(w);
  $("app").style.setProperty("--halo", j.halo || "#c8aa6e");
}
const sceneVote = (j, sens, anime) => { const mien = monVote === j.cle; scene($("stage"), j, sens, anime, mien, mien); };

function effetDesigne(j) {
  const w = $("stage").querySelector(".joueur:not(.sort)"); if (!w) return;
  const img = w.querySelector(".flotte img"); if (img && j.pleure) img.src = j.pleure;
  w.querySelector(".tampon")?.remove();
  w.append(el("div", "tampon" + (calme ? "" : " frappe"), "Désigné"));
  if (calme) return;
  $("app").classList.remove("tremble"); void $("app").offsetWidth; $("app").classList.add("tremble");
}

function compte(node, fin, dec = 0) {
  if (calme) { node.textContent = fmt(fin, dec); return; }
  const t0 = performance.now(), dur = 700;
  const pas = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    node.textContent = fmt(fin * e, dec); if (p < 1) requestAnimationFrame(pas); };
  node.textContent = fmt(0, dec);
  requestAnimationFrame(pas);
}

function fiche(j, anime) {
  const f = $("fiche"); f.replaceChildren();
  let n = 0; const a = e => { if (anime) { e.classList.add("anim"); e.style.setProperty("--i", n++); } return e; };
  const tete = el("div"); tete.append(el("h1", "nom", j.nom)); f.append(a(tete));
  const tu = el("div", "tuiles");
  const g = el("div", "tuile"); const gv = el("span", "val"); g.append(el("span", "lib", "Games"), gv);
  const vic = j.parties - j.defaites;
  const barre = el("div", "barre"); const bv = el("span", "v"), bd = el("span", "d");
  bv.style.width = (100 * vic / j.parties) + "%"; bd.style.width = (100 * j.defaites / j.parties) + "%"; barre.append(bv, bd);
  g.append(barre, el("span", "sous", `${vic} victoires · ${j.defaites} défaites`));
  const s = el("div", "tuile"); const sv = el("span", "val"); s.append(el("span", "lib", "Score de troll"), sv);
  const jauge = el("div", "jauge"); const pt = el("i"); pt.style.left = "50%"; jauge.append(pt);
  const jl = el("div", "jauge-lib"); jl.append(el("span", null, "propre"), el("span", null, "catastrophe"));
  s.append(jauge, jl);
  const k = el("div", "tuile"); const kd = el("div", "kda");
  kd.append(el("span", null, fmt(j.k)), el("i", null, "/"), el("span", "m", fmt(j.d)), el("i", null, "/"), el("span", null, fmt(j.a)));
  k.append(el("span", "lib", "KDA moyen"), kd, el("span", "sous", "kills / morts / assists par game"));
  const p = el("div", "tuile"); const pv = el("span", "val"); p.append(el("span", "lib", "Pire du groupe"), pv);
  p.append(el("span", "sous", `${Math.round(100 * j.pire_du_groupe / j.parties)} % de ses games`));
  tu.append(a(g), a(s), a(k), a(p));
  f.append(tu);
  if (j.verdict) f.append(a(el("p", "verdict", j.verdict)));
  const b = el("button", "designer"); b.type = "button"; b.id = "designer";
  b.addEventListener("click", () => session ? voter(j.cle) : connexion(j.cle));
  f.append(a(b));
  const z = el("div", "motif"); z.id = "zone-motif"; z.hidden = true; f.append(z);
  bouton(); rendreMotif();
  const gvN = el("span"); gv.append(gvN); compte(gvN, j.parties);
  const svN = el("span"); sv.append(svN, el("small", null, "/100")); compte(svN, j.score, 1);
  const pvN = el("span"); pv.append(pvN, el("small", null, "fois")); compte(pvN, j.pire_du_groupe);
  requestAnimationFrame(() => requestAnimationFrame(() => { pt.style.left = Math.max(0, Math.min(100, 100 * (j.score - smin) / (smax - smin))) + "%"; }));
}

function bouton() {
  const b = $("designer"); if (!b || i < 0) return;
  const j = J[i], mien = monVote === j.cle;
  b.classList.toggle("moi", mien);
  b.textContent = !sb ? "Vote bientôt disponible" : !session ? "Se connecter avec Discord pour voter" : mien ? "Désigné par toi" : `Désigner ${j.nom}`;
  b.disabled = !sb || mien;
}

function rendreMotif() {
  const z = $("zone-motif"); if (!z || i < 0) return;
  const j = J[i];
  if (monVote !== j.cle) { z.replaceChildren(); z.hidden = true; delete z.dataset.cle; return; }
  z.hidden = false;
  if (z.dataset.cle === j.cle) return;
  z.dataset.cle = j.cle; z.replaceChildren();
  const lib = el("label", "lib", "Motif de l'accusation"); lib.htmlFor = "motif-texte";
  const champ = el("input"); champ.id = "motif-texte"; champ.maxLength = 80; champ.placeholder = "Pourquoi lui ? En une phrase"; champ.value = monMotif;
  const ok = el("button", "motif-ok", "Enregistrer"); ok.type = "button";
  ok.addEventListener("click", () => enregistrerMotif(champ.value));
  champ.addEventListener("keydown", e => { if (e.key === "Enter") enregistrerMotif(champ.value); e.stopPropagation(); });
  const ligne = el("div", "motif-ligne"); ligne.append(champ, ok);
  const etat = el("span", "motif-etat", monMotif ? "Motif enregistré, révélé le 1er." : ""); etat.id = "motif-etat";
  z.append(lib, ligne, etat);
}

function erreur(t) { $("message").textContent = t; $("message").hidden = !t; }
async function voter(cle) {
  if (!sb || !session || enCours || monVote === cle) return;
  if (!enVote()) { erreur("Le vote est fermé."); return; }
  enCours = true; erreur("");
  const avant = monVote;
  if (J[i].cle === cle) effetDesigne(J[i]);
  const { error } = await sb.from("votes").upsert({ mois: M, cible: cle, motif: null }, { onConflict: "mois,votant" });
  enCours = false;
  if (error) {
    monVote = avant; sceneVote(J[i], 1, false);
    erreur("Le vote n'est pas passé, réessayer dans un instant.");
    return;
  }
  monVote = cle; monMotif = "";
  bouton(); rendreMotif(); points(); compterVotants();
}
async function enregistrerMotif(texte) {
  texte = texte.trim().slice(0, 80);
  if (!sb || !session || !monVote || !texte) return;
  $("motif-etat").textContent = "Enregistrement…";
  const { error } = await sb.from("votes").upsert({ mois: M, cible: monVote, motif: texte }, { onConflict: "mois,votant" });
  if (error) { $("motif-etat").textContent = "Le motif n'est pas passé, réessayer."; return; }
  monMotif = texte; $("motif-etat").textContent = "Motif enregistré, révélé le 1er.";
}
async function compterVotants() {
  if (!sb) return;
  const { data, error } = await sb.rpc("nb_votants", { m: M });
  if (!error) { nbVotants = data; rendreBandeau(); }
}

function aller(k, sens) {
  const n = J.length; k = ((k % n) + n) % n;
  if (k === i) return;
  if (sens == null) sens = k > i ? 1 : -1;
  const anime = i >= 0;
  i = k;
  sceneVote(J[i], sens, anime);
  fiche(J[i], anime);
  $("compteur").replaceChildren(el("b", null, String(i + 1).padStart(2, "0")), ` / ${String(n).padStart(2, "0")}`);
  [...$("points").children].forEach((b, x) => { b.classList.toggle("actif", x === i); b.setAttribute("aria-current", x === i); });
  points();
}
function points() {
  [...$("points").children].forEach((b, x) => b.classList.toggle("vote", x !== i && monVote === J[x].cle));
}

function brancherNavigation() {
  $("prec").addEventListener("click", () => aller(i - 1, -1));
  $("suiv").addEventListener("click", () => aller(i + 1, 1));
  let x0 = null, y0 = null;
  $("scene").addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") { x0 = e.clientX; y0 = e.clientY; } });
  $("scene").addEventListener("pointerup", e => {
    if (x0 == null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) aller(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  let derniere = 0, cumul = 0;
  $("stage").addEventListener("wheel", e => {
    e.preventDefault();
    cumul += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const t = performance.now();
    if (Math.abs(cumul) > 40 && t - derniere > 650) { const s = cumul > 0 ? 1 : -1; aller(i + s, s); derniere = t; cumul = 0; }
  }, { passive: false });
}
// Légère inclinaison qui suit la souris (vote et dernier troll)
for (const id of ["stage", "stage-dernier"]) {
  const st = $(id);
  st.addEventListener("pointermove", e => {
    if (calme || e.pointerType !== "mouse") return;
    const r = st.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    const t = st.querySelector(".joueur:not(.sort) .tilt");
    if (t) { t.style.setProperty("--ry", (px * 18) + "deg"); t.style.setProperty("--rx", (-py * 12) + "deg"); }
  });
  st.addEventListener("pointerleave", () => {
    const t = st.querySelector(".joueur:not(.sort) .tilt");
    if (t) { t.style.setProperty("--ry", "0deg"); t.style.setProperty("--rx", "0deg"); }
  });
}
addEventListener("keydown", e => {
  if (!$("revelation").hidden) {
    if (["ArrowRight", " ", "Enter"].includes(e.key) && !$("rev-actions").hidden) { suite(); e.preventDefault(); }
    if (e.key === "Escape") fermerRevelation();
    return;
  }
  if (e.target.closest?.("input") || $("vue-vote").hidden) return;
  if (e.key === "ArrowRight") { aller(i + 1, 1); e.preventDefault(); }
  if (e.key === "ArrowLeft") { aller(i - 1, -1); e.preventDefault(); }
});

// ---------- Dépouillement et révélation ----------
function depouiller(d, votes) {
  const c = {}, qui = {};
  for (const v of votes || []) {
    if (!d.joueurs.some(j => j.cle === v.cible)) continue;
    c[v.cible] = (c[v.cible] || 0) + 1; (qui[v.cible] ||= []).push(v);
  }
  const tri = d.joueurs.filter(j => c[j.cle]).sort((a, b) => c[b.cle] - c[a.cle] || b.score - a.score);
  return { c, qui, tri, n: Object.values(c).reduce((a, b) => a + b, 0) };
}
const nomVotant = v => v.votant === moiId() ? "toi" : (v.votant_nom || "un anonyme");

let etapes = [], etape = 0, moisRevele = null;
async function lancerRevelation(m) {
  const [d, votes] = await Promise.all([donneesMois(m), votesMois(m)]);
  if (!d || !votes) { erreur("Impossible de charger les votes pour l'instant."); return; }
  const { c, qui, tri } = depouiller(d, votes);
  if (!tri.length) { erreur(`Personne n'a voté en ${titreMois(m)}.`); return; }
  const podium = tri.slice(0, 3);
  etapes = podium.slice(1).reverse().map((j, k, l) => ({ type: "place", j, rang: l.length - k + 1 }));
  etapes.push({ type: "roulement" }, { type: "gagnant", j: podium[0] });
  etapes.forEach(e => { if (e.j) { e.votes = c[e.j.cle]; e.qui = qui[e.j.cle]; } });
  etapes.d = d;
  etape = 0; moisRevele = m;
  $("revelation").hidden = false; document.body.style.overflow = "hidden";
  memoire.ecrire("revelation-" + m, "vue");
  afficherEtape();
}
function afficherEtape() {
  const o = $("revelation"), e = etapes[etape], corps = $("rev-corps"), d = etapes.d;
  arreterSel(); corps.replaceChildren();
  $("rev-fermer").hidden = false; $("rev-actions").hidden = e.type === "roulement";
  o.classList.toggle("gagnant", e.type === "gagnant");
  const bloc = el("div", "rev-etape"); corps.append(bloc);
  if (e.type === "roulement") {
    o.style.setProperty("--halo", "#c8aa6e");
    bloc.append(el("p", "rev-place", "Roulement de tambour"), el("p", "rev-roulement", `Et le Troll ${de(d.titre)} est…`), el("p", "rev-points", "• • •"));
    setTimeout(() => { if (etapes[etape] === e) suite(); }, calme ? 1500 : 5200);
    return;
  }
  const j = e.j;
  o.style.setProperty("--halo", e.type === "gagnant" ? "#e8545b" : (j.halo || "#c8aa6e"));
  bloc.append(el("p", "rev-place", e.type === "gagnant" ? "Troll du mois" : `${e.rang}e place`));
  const perso = el("div", "rev-perso");
  if (j.avatar) { const img = el("img"); img.src = e.type === "gagnant" && j.pleure ? j.pleure : j.avatar; img.alt = j.nom; perso.append(img); }
  else perso.append(el("span", "initiale", j.nom[0].toUpperCase()));
  bloc.append(perso, el("p", "rev-nom", j.nom), el("p", "rev-votes", `${e.votes} vote${e.votes > 1 ? "s" : ""}`));
  const ul = el("ul", "rev-motifs");
  for (const v of e.qui) if (v.motif) ul.append(el("li", null, `« ${v.motif} » — ${nomVotant(v)}`));
  if (ul.children.length) bloc.append(ul);
  if (e.type === "gagnant") {
    const f = d.joueurs.find(x => x.rang === 1);
    bloc.append(el("p", "rev-formule", f && f.cle === j.cle ? "(et pour une fois, la formule est d'accord)" : `(alors que c'est ${f ? f.nom : "quelqu'un d'autre"}, on le sait tous)`));
    $("rev-suite").textContent = "Fermer"; $("rev-fermer").hidden = true;
    setTimeout(() => { if (etapes[etape] === e) verser(innerWidth / 2, -10, innerWidth, 1e9, 4); }, calme ? 0 : 900);
  } else $("rev-suite").textContent = "Suivant";
}
function suite() { if (etape < etapes.length - 1) { etape++; afficherEtape(); } else fermerRevelation(); }
function fermerRevelation() {
  arreterSel(); $("revelation").hidden = true; document.body.style.overflow = "";
  if (!enVote()) rendreDernier(); rendreHistorique();
}
$("rev-suite").addEventListener("click", suite);
$("rev-fermer").addEventListener("click", fermerRevelation);

// ---------- Hors vote : le dernier Troll du mois ----------
async function rendreDernier() {
  const m = indexMois.find(x => finVote(x).getTime() <= Date.now());
  const v = $("vue-dernier"), t = $("texte-dernier"), st = $("stage-dernier");
  if (!m) { v.hidden = true; return; }
  v.hidden = false; t.replaceChildren();
  const [d, votes] = await Promise.all([donneesMois(m), votesMois(m)]);
  const res = d && votes ? depouiller(d, votes) : null;
  const vu = memoire.lire("revelation-" + m) === "vue";
  t.append(el("p", "surtitre", `Troll ${de(titreMois(m))}`));
  if (!res || !res.tri.length) {
    st.replaceChildren(el("div", "mystere-perso", "?"));
    t.append(el("h2", "mystere", res ? "Personne n'a voté" : "Résultat indisponible"));
    return;
  }
  if (!vu) {
    st.replaceChildren(el("div", "mystere-perso", "?"));
    t.append(el("h2", "mystere", "Qui est-ce ?"), el("p", null, `${res.n} vote${res.n > 1 ? "s" : ""}. L'enveloppe attend d'être ouverte.`));
    const b = el("button", "reveler", "Révéler"); b.type = "button"; b.addEventListener("click", () => lancerRevelation(m)); t.append(b);
    return;
  }
  const g = res.tri[0];
  scene(st, g, 1, false, true, false);
  const f = d.joueurs.find(x => x.rang === 1);
  t.append(el("h2", null, g.nom), el("p", null, `${res.c[g.cle]} vote${res.c[g.cle] > 1 ? "s" : ""} sur ${res.n}` +
    (f && f.cle !== g.cle ? ` (alors que c'est ${f.nom}, on le sait tous)` : "")));
  const b = el("button", "lien-discret", "Revoir la révélation"); b.type = "button"; b.addEventListener("click", () => lancerRevelation(m)); t.append(b);
}

// ---------- Historique ----------
async function rendreHistorique() {
  const ol = $("liste-histo"); ol.replaceChildren();
  const clos = indexMois.filter(m => finVote(m).getTime() <= Date.now());
  if (!clos.length) { ol.append(el("li", "rien", "Le premier Troll du mois sera révélé le 1er novembre.")); return; }
  for (const m of clos) {
    const li = el("li", "carte-mois"); ol.append(li);
    const [d, votes] = await Promise.all([donneesMois(m), votesMois(m)]);
    const res = d && votes ? depouiller(d, votes) : null;
    const vu = memoire.lire("revelation-" + m) === "vue";
    const g = res?.tri[0];
    if (g && vu && g.avatar) { const img = el("img"); img.src = g.pleure || g.avatar; img.alt = ""; li.append(img); }
    else li.append(el("span", "vide", "?"));
    li.append(el("span", "m", titreMois(m)), el("b", null, !res ? "Résultat indisponible" : !g ? "Personne n'a voté" : vu ? g.nom : "Pas encore révélé"));
    if (g) {
      const b = el("button", "lien-discret", vu ? `${res.c[g.cle]} vote${res.c[g.cle] > 1 ? "s" : ""} sur ${res.n} · revoir` : "Révéler");
      b.type = "button"; b.addEventListener("click", () => lancerRevelation(m)); li.append(b);
    }
  }
}

// ---------- Démarrage ----------
async function demarrer() {
  try { indexMois = (await (await fetch(`${BASE}donnees/mois.json`, { cache: "no-cache" })).json()).mois || []; } catch (e) { indexMois = []; }
  if (sb) {
    session = (await sb.auth.getSession()).data.session;
    sb.auth.onAuthStateChange((ev, s) => {
      const avant = moiId(); session = s; rendreCompte();
      if (moiId() !== avant) chargerMonVote();
    });
  }
  rendreCompte();
  modePrecedent = enVote();
  rendreBandeau();
  $("mois").textContent = titreMois(enVote() ? M : (indexMois.find(x => finVote(x).getTime() <= Date.now()) || M));
  if (enVote()) {
    D = await donneesMois(M);
    if (!D) { erreur("Les stats du mois arrivent bientôt."); }
    else {
      J = D.joueurs.slice();
      for (let k = J.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [J[k], J[r]] = [J[r], J[k]]; }
      const sc = D.joueurs.map(j => j.score); smin = Math.min(...sc) - 1; smax = Math.max(...sc) + 1;
      $("aide").textContent = (tactile ? "Swipe pour passer au suivant. " : "Flèches du clavier, molette ou boutons pour défiler. ") +
        `Stats ${D.periode}, figées à l'ouverture du vote, ${D.parties} parties à au moins deux du groupe.`;
      for (const [k, j] of J.entries()) {
        const b = el("button"); b.type = "button"; b.setAttribute("aria-label", j.nom);
        b.addEventListener("click", () => aller(k)); $("points").append(b);
      }
      brancherNavigation();
      $("vue-vote").hidden = false;
      let attente = null; try { attente = sessionStorage.getItem("troll-designer"); sessionStorage.removeItem("troll-designer"); } catch (e) { /* rien */ }
      const k0 = attente ? J.findIndex(j => j.cle === attente) : -1;
      aller(k0 >= 0 ? k0 : 0, 1);
      await chargerMonVote();
      if (attente && session && !monVote) voter(attente);
      compterVotants(); setInterval(compterVotants, 60000);
    }
  } else {
    await rendreDernier();
  }
  rendreHistorique();
}
async function chargerMonVote() {
  monVote = null; monMotif = "";
  if (sb && session && enVote()) {
    const { data } = await sb.from("votes").select("cible, motif").eq("mois", M).eq("votant", moiId()).maybeSingle();
    if (data) { monVote = data.cible; monMotif = data.motif || ""; }
  }
  if (J.length && i >= 0) { sceneVote(J[i], 1, false); bouton(); rendreMotif(); points(); }
}
demarrer();
