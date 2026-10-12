// Écran de démarrage de l'accueil : bruit d'écran, logo qui glitch, roue de chargement,
// puis mot de passe pour accéder au menu. Demandé une fois par session (sessionStorage).
// Verrou symbolique : le site est statique, tout se passe dans le navigateur.
(() => {
  const boot = document.querySelector('.boot');
  if (!boot || document.documentElement.classList.contains('sans-boot')) return;

  // Empreinte FNV-1a du mot de passe, pour ne pas l'écrire en clair
  const EMPREINTE = '1edb67e8';
  const empreinte = (texte) => {
    let h = 0x811c9dc5;
    for (const c of texte) {
      h ^= c.charCodeAt(0);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16);
  };

  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const consoleBoot = boot.querySelector('.boot-console');
  const acces = boot.querySelector('.boot-acces');
  const mdp = boot.querySelector('.boot-mdp');
  const entrer = boot.querySelector('.boot-entrer');
  const arreterBruit = lancerBruit(boot.querySelector('.boot-bruit'));
  const racine = document.documentElement;
  let ouvert = false;

  // Les textes du menu arrivent brouillés puis se décodent lettre par lettre
  const SIGNES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&?/<>';
  const dechiffrer = (el) => {
    const cible = el.textContent;
    let n = 0;
    const pas = () => {
      n++;
      el.textContent = [...cible]
        .map((c, i) => (c === ' ' || i < n / 2 ? c : SIGNES[Math.floor(Math.random() * SIGNES.length)]))
        .join('');
      if (n / 2 < cible.length) setTimeout(pas, 30);
      else el.textContent = cible;
    };
    pas();
  };

  // Bon mot de passe : l'accès s'efface, le fond se fond dans celui du menu
  const ouvrir = () => {
    ouvert = true;
    try { sessionStorage.setItem('locost-boot', '1'); } catch (e) {}
    mdp.blur();
    const fin = () => {
      arreterBruit();
      racine.classList.add('sans-boot');
    };
    document.dispatchEvent(new Event('locost:entree'));
    if (calme) return fin();
    consoleBoot.classList.add('part');
    document.querySelectorAll('.wrap h1, a.bouton').forEach(dechiffrer);
    setTimeout(() => boot.classList.add('fini'), 150);
    setTimeout(fin, 800);
  };

  // Mauvais mot de passe : le bouton passe en rouge « Recommencer » et bugue à chaque essai
  const refuser = () => {
    entrer.textContent = 'Recommencer';
    acces.classList.add('echec');
    acces.classList.remove('bug');
    void acces.offsetWidth; // relance l'animation
    acces.classList.add('bug');
    mdp.value = '';
    mdp.focus();
  };

  acces.addEventListener('submit', (e) => {
    e.preventDefault();
    if (ouvert) return;
    const essai = mdp.value.trim().toLowerCase();
    if (!essai) return mdp.focus();
    if (empreinte(essai) === EMPREINTE) ouvrir();
    else refuser();
  });

  setTimeout(() => {
    consoleBoot.classList.add('pret');
    mdp.focus({ preventScroll: true });
  }, 2800 + Math.random() * 1200);
})();
