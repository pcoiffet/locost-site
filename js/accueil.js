// Accueil : bruit discret en fond et bouton censuré qui laisse fuiter des bribes de texte.
(() => {
  lancerBruit(document.querySelector('.fond .bruit'), { echelle: 4, intervalle: 90, dechirures: 0.08 });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const signes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&?/<>';
  const masques = [...document.querySelectorAll('.bouton.censure .masque')];
  masques.forEach((m) => { m.dataset.barres = m.textContent; });

  const fuite = () => {
    const m = masques[Math.floor(Math.random() * masques.length)];
    if (m && !document.hidden) {
      m.textContent = [...m.dataset.barres].map((c) => (c === ' ' ? ' ' : signes[Math.floor(Math.random() * signes.length)])).join('');
      m.classList.add('trahi');
      setTimeout(() => {
        m.textContent = m.dataset.barres;
        m.classList.remove('trahi');
      }, 90 + Math.random() * 140);
    }
    setTimeout(fuite, 1200 + Math.random() * 2600);
  };
  setTimeout(fuite, 1500);
})();
