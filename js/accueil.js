// Accueil : bruit discret en fond, bouton censuré qui se dérobe, onglet qui parle,
// compteur de connectés qui bouge seul et visage qui surgit de temps en temps.
(() => {
  lancerBruit(document.querySelector('.fond .bruit'), { echelle: 4, intervalle: 90, dechirures: 0.08 });

  // L'onglet parle quand on le quitte
  const titre = document.title;
  const absences = ['reviens.', "on t'a vu partir.", 'tu es toujours là ?'];
  let nbAbsences = 0;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? absences[nbAbsences++ % absences.length] : titre;
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hasard = (min, max) => min + Math.random() * (max - min);

  // Bouton censuré : des bribes fuitent, il recule au survol, refuse au toucher
  const censure = document.querySelector('.bouton.censure');
  const masque = censure && censure.querySelector('.masque');
  if (censure && masque) {
    const barres = masque.textContent;
    const signes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&?/<>';
    const fuite = () => {
      if (!document.hidden && !censure.classList.contains('refuse')) {
        masque.textContent = [...barres].map(() => signes[Math.floor(Math.random() * signes.length)]).join('');
        masque.classList.add('trahi');
        setTimeout(() => {
          masque.textContent = barres;
          masque.classList.remove('trahi');
        }, hasard(90, 230));
      }
      setTimeout(fuite, hasard(1200, 3800));
    };
    setTimeout(fuite, 1500);

    censure.addEventListener('mouseenter', () => {
      censure.style.transform = `translate(${hasard(-18, 18).toFixed(0)}px, ${hasard(4, 10).toFixed(0)}px)`;
    });
    censure.addEventListener('mouseleave', () => { censure.style.transform = ''; });
    censure.addEventListener('click', () => {
      censure.classList.add('refuse');
      masque.textContent = 'ACCÈS REFUSÉ';
      setTimeout(() => {
        censure.classList.remove('refuse');
        masque.textContent = barres;
      }, 1200);
    });
  }

  // Compteur de connectés : quelqu'un arrive, puis disparaît
  const connectes = document.querySelector('.connectes');
  if (connectes) {
    const bouger = () => {
      connectes.textContent = '4';
      setTimeout(() => { connectes.textContent = '3'; }, hasard(2500, 6000));
      setTimeout(bouger, hasard(15000, 40000));
    };
    setTimeout(bouger, hasard(8000, 16000));
  }

  // Visage en négatif, très bref et rare
  const visage = document.querySelector('.visage');
  if (visage) {
    const surgir = () => {
      if (!document.hidden) {
        visage.classList.add('surgit');
        setTimeout(() => visage.classList.remove('surgit'), 90);
      }
      setTimeout(surgir, hasard(45000, 90000));
    };
    const premier = () => setTimeout(surgir, hasard(12000, 25000));
    if (document.querySelector('.boot') && !document.documentElement.classList.contains('sans-boot')) {
      document.addEventListener('locost:entree', premier, { once: true });
    } else premier();
  }
})();
