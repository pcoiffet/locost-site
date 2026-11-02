// Garde l'épisode 02 dans le téléphone pour y jouer sans réseau.
// Stratégie : réponse depuis le cache, mise à jour en arrière-plan quand le réseau répond.
// Changer VERSION (et la liste) quand un fichier ou un ?v=N change.
const VERSION = 'locost-ep02-v1';
const FICHIERS = [
  '/jeu/ep02/',
  '/jeu/ep02/episode.js?v=1',
  '/jeu/moteur/missions.js?v=1',
  '/jeu/moteur/jeu.css?v=6',
  '/jeu/ep02/bureau.css?v=1',
  '/css/locost.css?v=7',
  '/js/terminal.js?v=7',
];

self.addEventListener('install', (evenement) => {
  evenement.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((c) => c.startsWith('locost-ep02-') && c !== VERSION).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET' || new URL(requete.url).origin !== location.origin) return;
  evenement.respondWith(caches.open(VERSION).then(async (cache) => {
    const cle = requete.mode === 'navigate' ? '/jeu/ep02/' : requete;
    const enCache = await cache.match(cle);
    const reseau = fetch(requete).then((reponse) => {
      if (reponse.ok) cache.put(cle, reponse.clone());
      return reponse;
    }).catch(() => enCache);
    return enCache || reseau;
  }));
});
