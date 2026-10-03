// Bruit d'écran façon télé mal réglée : petite image aléatoire agrandie en CSS, redessinée en boucle.
// Renvoie une fonction qui arrête l'animation.
function lancerBruit(canvas, { echelle = 3, intervalle = 60, dechirures = 0.15 } = {}) {
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const ctx = canvas.getContext('2d');
  const taille = () => {
    canvas.width = Math.ceil(window.innerWidth / echelle);
    canvas.height = Math.ceil(window.innerHeight / echelle);
  };
  taille();
  window.addEventListener('resize', taille);
  let actif = true;
  let dernier = 0;
  const dessiner = (t) => {
    if (!actif) return;
    if (t - dernier > intervalle && !document.hidden) {
      dernier = t;
      const img = ctx.createImageData(canvas.width, canvas.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i] = d[i + 1] = d[i + 2] = Math.random() * 255;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      // Déchirure horizontale de temps en temps
      if (Math.random() < dechirures) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 1 + Math.random() * 3);
      }
    }
    requestAnimationFrame(dessiner);
  };
  requestAnimationFrame(dessiner);
  return () => {
    actif = false;
    window.removeEventListener('resize', taille);
  };
}
