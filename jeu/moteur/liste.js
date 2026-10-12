// Page /jeu/ : affiche les épisodes déclarés dans /jeu/episodes.js.
(() => {
  const nav = document.querySelector('.episodes');
  if (!nav || !window.EPISODES) return;

  const ETIQUETTES = { archive: 'archivé', 'en-cours': 'en cours', verrouille: 'en préparation' };

  window.EPISODES.forEach((ep) => {
    if (ep.statut === 'verrouille') {
      // Épisode pas encore ouvert : nom censuré, refuse au toucher
      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'bouton censure episode';
      bouton.setAttribute('aria-label', `Épisode ${ep.numero}, ${ETIQUETTES.verrouille}`);
      const masque = document.createElement('span');
      masque.className = 'masque';
      masque.setAttribute('aria-hidden', 'true');
      const barres = '██████████';
      masque.textContent = barres;
      bouton.append(`EP${ep.numero} · `, masque);
      bouton.addEventListener('click', () => {
        bouton.classList.add('refuse');
        masque.textContent = 'EN PRÉPARATION';
        setTimeout(() => {
          bouton.classList.remove('refuse');
          masque.textContent = barres;
        }, 1400);
      });
      nav.appendChild(bouton);
      return;
    }

    const lien = document.createElement('a');
    lien.className = 'bouton episode';
    lien.href = ep.url;
    lien.textContent = `EP${ep.numero} · ${ep.titre}`;
    const etat = document.createElement('span');
    etat.className = `episode-etat ${ep.statut}`;
    etat.textContent = ETIQUETTES[ep.statut] || ep.statut;
    lien.appendChild(etat);
    nav.appendChild(lien);
  });
})();
