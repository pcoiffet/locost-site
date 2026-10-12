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

  // Bon mot de passe : flash, l'écran s'éteint comme un vieux tube, le menu s'allume
  const ouvrir = () => {
    ouvert = true;
    try { sessionStorage.setItem('locost-boot', '1'); } catch (e) {}
    entrer.textContent = 'Accès autorisé';
    boot.classList.add('autorise');
    mdp.blur();
    const finir = () => {
      arreterBruit();
      racine.classList.add('sans-boot');
      document.dispatchEvent(new Event('locost:entree'));
      if (calme) return;
      racine.classList.add('allumage');
      const visage = document.querySelector('.visage');
      if (visage) {
        visage.classList.add('surgit');
        setTimeout(() => visage.classList.remove('surgit'), 110);
      }
      setTimeout(() => racine.classList.remove('allumage'), 600);
    };
    if (calme) return setTimeout(finir, 300);
    setTimeout(() => boot.classList.add('extinction'), 350);
    setTimeout(finir, 350 + 420);
  };

  // Mauvais mot de passe : le bouton bugue et dit « Recommence »
  const refuser = () => {
    entrer.textContent = 'Recommence';
    acces.classList.remove('refuse');
    void acces.offsetWidth; // relance l'animation
    acces.classList.add('refuse');
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
  mdp.addEventListener('input', () => {
    if (acces.classList.contains('refuse')) {
      acces.classList.remove('refuse');
      entrer.textContent = 'Entrer';
    }
  });

  setTimeout(() => {
    consoleBoot.classList.add('pret');
    mdp.focus({ preventScroll: true });
  }, 2800 + Math.random() * 1200);
})();
