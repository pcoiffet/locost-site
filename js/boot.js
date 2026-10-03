// Écran de démarrage de l'accueil : bruit d'écran, lignes de terminal, logo qui glitch, puis bouton d'entrée.
// Affiché une fois par session (sessionStorage) ; « passer » ou le bouton ferment l'écran.
// Les infos de l'appareil sont lues dans le navigateur et ne sont envoyées nulle part.
(() => {
  const boot = document.querySelector('.boot');
  if (!boot || document.documentElement.classList.contains('sans-boot')) return;

  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sortie = boot.querySelector('.boot-lignes');
  const entrer = boot.querySelector('.boot-entrer');
  const passer = boot.querySelector('.boot-passer');
  const canvas = boot.querySelector('.boot-bruit');

  const hasard = (min, max) => min + Math.random() * (max - min);
  const hex = (n) => Array.from({ length: n }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
  const empreinte = `${hex(4)} ${hex(4)} ${hex(4)} ${hex(4)}`;
  const coordonnee = (max, pos, neg) => {
    const v = hasard(-max, max);
    return `${Math.abs(v).toFixed(11)} ${v >= 0 ? pos : neg}`;
  };
  const gps = `${coordonnee(180, 'E', 'O')}, ${coordonnee(80, 'N', 'S')}`;

  function appareil() {
    const ua = navigator.userAgent;
    const systeme = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android'
      : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'inconnu';
    const navigateur = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox|FxiOS/.test(ua) ? 'Firefox'
      : /Chrome|CriOS/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'navigateur inconnu';
    return `${systeme} · ${navigateur}`;
  }

  function visite() {
    try {
      const n = (parseInt(localStorage.getItem('locost-visites'), 10) || 0) + 1;
      localStorage.setItem('locost-visites', String(n));
      return n;
    } catch (e) {
      return null;
    }
  }

  async function batterie() {
    if (!navigator.getBattery) return null;
    try {
      const b = await Promise.race([navigator.getBattery(), new Promise((r) => setTimeout(r, 300))]);
      return b ? Math.round(b.level * 100) : null;
    } catch (e) {
      return null;
    }
  }

  // Chaque ligne : texte, classe, pause après (ms), suite (même ligne que la précédente),
  // lent (frappe ralentie), bloque (reste coincée puis secoue l'écran), efface (s'efface après affichage).
  function preparerLignes(niveauBatterie, numeroVisite) {
    const heure = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return [
      { texte: 'locost v2.1 - Initialisation', pause: 300 },
      { texte: 'Mise en place des fragments', pause: 200 },
      { texte: 'fragment 1 ......... ' }, { texte: 'ok', classe: 'ok', pause: 150, suite: true },
      { texte: 'fragment 2 ......... ', lent: true, bloque: true }, { texte: 'ok', classe: 'ok', pause: 150, suite: true },
      { texte: 'fragment 3 ......... ' }, { texte: 'ok', classe: 'ok', pause: 300, suite: true },
      { texte: gps, classe: 'intrus', efface: true, pause: 250 },
      { texte: 'anomalie supprimée.', classe: 'alerte', pause: 300 },
      { texte: `empreinte du nœud : ${empreinte}`, pause: 250 },
      { texte: 'chiffrement de bout en bout ... ' }, { texte: 'actif', classe: 'ok', pause: 350, suite: true },
      { texte: `appareil détecté : ${appareil()}`, pause: 200 },
      { texte: `heure locale : ${heure}`, pause: 200 },
      niveauBatterie !== null && { texte: `batterie : ${niveauBatterie} %`, pause: 200 },
      numeroVisite !== null && { texte: `visite n°${numeroVisite}`, pause: 300 },
      { texte: 'identité du visiteur : inconnue', pause: 400 },
      { texte: 'accès autorisé.' },
    ].filter(Boolean);
  }

  const arreterBruit = lancerBruit(canvas);

  const ajouter = (ligne) => {
    let saut = null;
    if (!ligne.suite && sortie.childNodes.length) {
      saut = document.createTextNode('\n');
      sortie.append(saut);
    }
    const span = document.createElement('span');
    if (ligne.classe) span.className = ligne.classe;
    sortie.append(span);
    return { span, saut };
  };

  let annule = false;
  const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

  const montrerBouton = () => {
    entrer.classList.add('pret');
    passer.hidden = true;
    entrer.focus({ preventScroll: true });
  };

  const fermer = () => {
    annule = true;
    try { sessionStorage.setItem('locost-boot', '1'); } catch (e) {}
    boot.classList.add('fini');
    document.dispatchEvent(new Event('locost:entree'));
    setTimeout(() => {
      arreterBruit();
      document.documentElement.classList.add('sans-boot');
    }, 600);
  };

  entrer.addEventListener('click', fermer);
  passer.addEventListener('click', fermer);

  const secouer = () => {
    boot.classList.add('secousse');
    setTimeout(() => boot.classList.remove('secousse'), 260);
  };

  async function derouler(lignes) {
    await attendre(500);
    for (const ligne of lignes) {
      if (annule) return;
      const { span, saut } = ajouter(ligne);
      for (let c = 1; c <= ligne.texte.length; c++) {
        if (annule) return;
        span.textContent = ligne.texte.slice(0, c);
        await attendre(ligne.lent ? hasard(60, 140) : hasard(14, 36));
      }
      if (ligne.bloque) {
        await attendre(1800);
        secouer();
        await attendre(300);
      }
      if (ligne.efface) {
        await attendre(700);
        for (let c = ligne.texte.length; c >= 0; c--) {
          if (annule) return;
          span.textContent = ligne.texte.slice(0, c);
          await attendre(8);
        }
        span.remove();
        if (saut) saut.remove();
      }
      await attendre(ligne.pause || 0);
    }
    await attendre(400);
    if (!annule) montrerBouton();
  }

  Promise.all([batterie(), visite()]).then(([niveau, numero]) => {
    const lignes = preparerLignes(niveau, numero);
    if (calme) {
      lignes.filter((l) => !l.efface).forEach((l) => { ajouter(l).span.textContent = l.texte; });
      montrerBouton();
      return;
    }
    derouler(lignes);
  });
})();
