// Tape le texte des éléments .terminal[data-lines] ligne par ligne, façon console.
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
