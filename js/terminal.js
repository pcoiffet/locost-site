// Tape le texte des éléments .terminal[data-lines] ligne par ligne, façon console.
function demarrerTerminaux() {
  document.querySelectorAll('.terminal[data-lines]').forEach((el) => {
    const lines = el.dataset.lines.split('|');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = lines[lines.length - 1];
      return;
    }
    let line = 0;
    let char = 0;
    function tick() {
      const text = lines[line];
      el.textContent = text.slice(0, ++char);
      if (char < text.length) return setTimeout(tick, 35);
      if (line === lines.length - 1) return;
      setTimeout(() => { line++; char = 0; tick(); }, 1400);
    }
    tick();
  });
}

// Sur l'accueil, attendre la fin de l'écran de démarrage.
const bootEnCours = document.querySelector('.boot') && document.documentElement.classList.contains('js') && !document.documentElement.classList.contains('sans-boot');
if (bootEnCours) document.addEventListener('locost:entree', demarrerTerminaux, { once: true });
else demarrerTerminaux();
