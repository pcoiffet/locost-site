// Écran de démarrage de l'accueil : bruit d'écran, logo qui glitch, roue de chargement,
// puis mot de passe pour accéder au menu. Demandé une fois par session (sessionStorage).
// Verrou symbolique : le site est statique, tout se passe dans le navigateur.
(() => {
  const boot = document.querySelector('.boot');
  if (!boot || document.documentElement.classList.contains('sans-boot')) return;

  // Empreinte SHA-256 du mot de passe, pour ne pas l'écrire en clair
  const EMPREINTE = '47916b1ae9ca184faf20be5e659382cefeca7a929cd5d767c2e08c093a14df0c';

  const consoleBoot = boot.querySelector('.boot-console');
  const acces = boot.querySelector('.boot-acces');
  const mdp = boot.querySelector('.boot-mdp');
  const erreur = boot.querySelector('.boot-erreur');
  const arreterBruit = lancerBruit(boot.querySelector('.boot-bruit'));

  async function empreinte(texte) {
    const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte));
    return [...new Uint8Array(octets)].map((o) => o.toString(16).padStart(2, '0')).join('');
  }

  const fermer = () => {
    try { sessionStorage.setItem('locost-boot', '1'); } catch (e) {}
    boot.classList.add('fini');
    document.dispatchEvent(new Event('locost:entree'));
    setTimeout(() => {
      arreterBruit();
      document.documentElement.classList.add('sans-boot');
    }, 600);
  };

  const refuser = () => {
    erreur.textContent = 'accès refusé';
    acces.classList.remove('refuse');
    void acces.offsetWidth; // relance l'animation
    acces.classList.add('refuse');
    mdp.value = '';
    mdp.focus();
  };

  acces.addEventListener('submit', async (e) => {
    e.preventDefault();
    const essai = mdp.value.trim().toLowerCase();
    if (!essai) return mdp.focus();
    if ((await empreinte(essai)) === EMPREINTE) fermer();
    else refuser();
  });
  mdp.addEventListener('input', () => { erreur.textContent = ''; });

  setTimeout(() => {
    consoleBoot.classList.add('pret');
    mdp.focus({ preventScroll: true });
  }, 2800 + Math.random() * 1200);
})();
