// Écran de démarrage de l'accueil : bruit d'écran, logo qui glitch, roue de chargement, puis bouton d'entrée.
// Affiché une fois par session (sessionStorage) ; « passer » ou le bouton ferment l'écran.
(() => {
  const boot = document.querySelector('.boot');
  if (!boot || document.documentElement.classList.contains('sans-boot')) return;

  const consoleBoot = boot.querySelector('.boot-console');
  const entrer = boot.querySelector('.boot-entrer');
  const passer = boot.querySelector('.boot-passer');
  const arreterBruit = lancerBruit(boot.querySelector('.boot-bruit'));
  let annule = false;

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

  setTimeout(() => {
    if (annule) return;
    consoleBoot.classList.add('pret');
    passer.hidden = true;
    entrer.focus({ preventScroll: true });
  }, 2800 + Math.random() * 1200);
})();
