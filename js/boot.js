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
    ['fragment 1 ......... ', '', 0], ['ok', 'ok', 150, true],
    ['fragment 2 ......... ', '', 0], ['ok', 'ok', 150, true],
    ['fragment 3 ......... ', '', 0], ['ok', 'ok', 400, true],
    ['anomalie supprimée.', 'alerte', 300],
    [`empreinte du nœud : ${empreinte}`, '', 250],
    ['chiffrement de bout en bout ... ', '', 0], ['actif', 'ok', 350, true],
    ['identité du visiteur : inconnue', '', 400],
    ['accès autorisé.', '', 0],
  ];

  const arreterBruit = lancerBruit(canvas);

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
      arreterBruit();
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
