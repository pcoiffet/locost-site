// Écran de démarrage de l'accueil : bruit d'écran, lignes de terminal, logo qui glitch, puis bouton d'entrée.
// Affiché une fois par session (sessionStorage) ; « passer » ou le bouton ferment l'écran.
(() => {
  const boot = document.querySelector('.boot');
  if (!boot || document.documentElement.classList.contains('sans-boot')) return;

  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sortie = boot.querySelector('.boot-lignes');
  const entrer = boot.querySelector('.boot-entrer');
  const passer = boot.querySelector('.boot-passer');
  const canvas = boot.querySelector('.boot-bruit');

  const hex = (n) => Array.from({ length: n }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
  const empreinte = `${hex(4)} ${hex(4)} ${hex(4)} ${hex(4)}`;

  // [texte, classe éventuelle, pause après la ligne (ms)]
  const lignes = [
    ['locost v2.1 - Initialisation', '', 300],
    ['Mise en place des fragments', '', 200],
    ['  fragment 1 ......... ', '', 0], ['ok', 'ok', 150, true],
    ['  fragment 2 ......... ', '', 0], ['ok', 'ok', 150, true],
    ['  fragment 3 ......... ', '', 0], ['ok', 'ok', 400, true],
    ['anomalie supprimée.', 'alerte', 300],
    [`empreinte du nœud : ${empreinte}`, '', 250],
    ['chiffrement de bout en bout ... ', '', 0], ['actif', 'ok', 350, true],
    ['identité du visiteur : inconnue', '', 400],
    ['accès autorisé.', '', 0],
  ];

  // Bruit d'écran : petite image aléatoire agrandie, redessinée en boucle
  let bruitActif = !calme;
  if (canvas && !calme) {
    const ctx = canvas.getContext('2d');
    const taille = () => {
      canvas.width = Math.ceil(window.innerWidth / 3);
      canvas.height = Math.ceil(window.innerHeight / 3);
    };
    taille();
    window.addEventListener('resize', taille);
    let dernier = 0;
    const dessiner = (t) => {
      if (!bruitActif) return;
      if (t - dernier > 60) {
        dernier = t;
        const img = ctx.createImageData(canvas.width, canvas.height);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 255;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        // Déchirure horizontale de temps en temps
        if (Math.random() < 0.15) {
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 1 + Math.random() * 3);
        }
      }
      requestAnimationFrame(dessiner);
    };
    requestAnimationFrame(dessiner);
  }

  const ajouter = (classe, nouvelleLigne) => {
    if (nouvelleLigne && sortie.childNodes.length) sortie.append('\n');
    const span = document.createElement('span');
    if (classe) span.className = classe;
    sortie.append(span);
    return span;
  };

  let annule = false;
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
      bruitActif = false;
      document.documentElement.classList.add('sans-boot');
    }, 600);
  };

  entrer.addEventListener('click', fermer);
  passer.addEventListener('click', fermer);

  if (calme) {
    lignes.forEach(([texte, classe, , suite]) => { ajouter(classe, !suite).textContent = texte; });
    montrerBouton();
    return;
  }

  let i = 0;
  const suivante = () => {
    if (annule) return;
    if (i >= lignes.length) return setTimeout(montrerBouton, 400);
    const [texte, classe, pause, suite] = lignes[i++];
    const span = ajouter(classe, !suite);
    let c = 0;
    const taper = () => {
      if (annule) return;
      span.textContent = texte.slice(0, ++c);
      if (c < texte.length) return setTimeout(taper, 14 + Math.random() * 22);
      setTimeout(suivante, pause);
    };
    taper();
  };
  setTimeout(suivante, 500);
})();
