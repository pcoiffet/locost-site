// Fiche d'un épisode archivé : construit la page à partir de window.EPISODE (voir /jeu/ep01/episode.js).
// Chaque rappel est un bloc dépliable ; son type choisit le rendu (transmission, documents, dossier, fragments).
(() => {
  const ep = window.EPISODE;
  const fiche = document.getElementById('fiche');
  if (!ep || !fiche) return;

  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasard = (min, max) => min + Math.random() * (max - min);
  const deuxChiffres = (n) => String(n).padStart(2, '0');
  // Silhouette générique (tête + épaules) : aucune donnée réelle
  const SILHOUETTE = '<svg class="silhouette" viewBox="0 0 60 70" aria-hidden="true"><circle cx="30" cy="24" r="12"/><path d="M6 70c0-15 10.7-25 24-25s24 10 24 25z"/></svg>';

  function el(tag, classe, texte) {
    const noeud = document.createElement(tag);
    if (classe) noeud.className = classe;
    if (texte != null) noeud.textContent = texte;
    return noeud;
  }

  // Texte avec passages barrés : [[mot]] se révèle au toucher, {{N}} reste barré pour de bon.
  function texteBarre(source) {
    const frag = document.createDocumentFragment();
    source.split(/(\[\[.+?\]\]|\{\{\d+\}\})/).forEach((morceau) => {
      if (!morceau) return;
      const revelable = morceau.match(/^\[\[(.+)\]\]$/);
      const definitif = morceau.match(/^\{\{(\d+)\}\}$/);
      if (revelable) {
        const barre = el('button', 'caviar', revelable[1]);
        barre.type = 'button';
        barre.setAttribute('aria-label', 'Passage masqué, toucher pour révéler');
        barre.addEventListener('click', () => {
          barre.classList.add('leve');
          barre.removeAttribute('aria-label');
          barre.disabled = true;
        }, { once: true });
        frag.appendChild(barre);
      } else if (definitif) {
        const barre = el('span', 'caviar definitif', '█'.repeat(Number(definitif[1])));
        barre.setAttribute('aria-label', 'Passage supprimé');
        barre.addEventListener('click', () => {
          barre.classList.remove('refuse');
          void barre.offsetWidth;
          barre.classList.add('refuse');
        });
        frag.appendChild(barre);
      } else {
        frag.appendChild(document.createTextNode(morceau));
      }
    });
    return frag;
  }

  function paragraphe(tag, classe, source) {
    const noeud = el(tag, classe);
    noeud.appendChild(texteBarre(source));
    return noeud;
  }

  // ---------- En-tête ----------
  const barre = el('header', 'barre');
  barre.append(el('span', 'point archive', 'archive'), el('span', null, `EP${ep.numero} · classifié`));
  document.body.insertBefore(barre, fiche);

  const tete = el('div', 'fiche-tete');
  const titre = el('h1', 'glitch', ep.titre);
  titre.dataset.text = ep.titre;
  const intro = el('p', 'terminal');
  intro.dataset.lines = ep.intro.join('|');
  tete.append(el('div', 'eyebrow', `Archive ${ep.numero} · Classifiée`), titre, intro);
  fiche.appendChild(tete);

  // ---------- Compte à rebours figé ----------
  const cible = new Date(ep.dateCible);
  const compteur = el('section', 'compteur');
  compteur.setAttribute('aria-label', 'Compte à rebours terminé');
  const cases = el('div', 'compteur-cases');
  const chiffres = ['J', 'H', 'M', 'S'].map((unite) => {
    const bloc = el('div', 'compteur-case');
    const nombre = el('span', 'compteur-nombre', '00');
    bloc.append(nombre, el('span', 'compteur-unite', unite));
    cases.appendChild(bloc);
    return nombre;
  });
  const date = `${deuxChiffres(cible.getDate())}.${deuxChiffres(cible.getMonth() + 1)}.${cible.getFullYear()}`;
  const jours = Math.floor((Date.now() - cible) / 86400000);
  const legende = el('p', 'compteur-legende');
  legende.append(el('span', 'tampon', 'Protocole exécuté'), el('span', 'compteur-date', `${date} · il y a ${jours} jours`));
  compteur.append(cases, legende);
  fiche.appendChild(compteur);

  // De temps en temps, les chiffres se dérèglent une fraction de seconde
  if (!calme) {
    const derive = () => {
      if (!document.hidden) {
        chiffres.forEach((n) => { n.textContent = deuxChiffres(Math.floor(Math.random() * 60)); });
        compteur.classList.add('derive');
        setTimeout(() => {
          chiffres.forEach((n) => { n.textContent = '00'; });
          compteur.classList.remove('derive');
        }, 140);
      }
      setTimeout(derive, hasard(6000, 14000));
    };
    setTimeout(derive, hasard(3000, 6000));
  }

  // ---------- Rappels ----------
  const RENDUS = { transmission, documents, dossier, carte, fragments };
  const liste = el('div', 'rappels');
  ep.rappels.forEach((rappel, i) => {
    const rendu = RENDUS[rappel.type];
    if (!rendu) return;
    const bloc = el('details', `rappel rappel-${rappel.type}`);
    const resume = el('summary');
    resume.append(el('span', 'rappel-num', deuxChiffres(i + 1)), el('span', 'rappel-titre', rappel.titre));
    const corps = el('div', 'rappel-corps');
    bloc.append(resume, corps);
    rendu(rappel, corps, bloc);
    liste.appendChild(bloc);
  });
  fiche.appendChild(liste);

  // ---------- Rejouer : refusé ----------
  if (ep.rejouer) {
    const pied = el('div', 'fiche-pied');
    const bouton = el('button', 'bouton rejouer', ep.rejouer.libelle);
    bouton.type = 'button';
    const reponse = el('p', 'rejouer-refus');
    reponse.setAttribute('aria-live', 'polite');
    bouton.addEventListener('click', () => {
      bouton.classList.remove('refuse');
      void bouton.offsetWidth;
      bouton.classList.add('refuse');
      reponse.textContent = ep.rejouer.refus;
    });
    pied.append(bouton, reponse);
    fiche.appendChild(pied);
  }

  // ---------- Types de rappels ----------

  // Rejoue des messages façon terminal, la première fois que le bloc est ouvert
  function transmission(rappel, corps, bloc) {
    const PREFIXES = { systeme: '[SYSTEM]', phaco: '[PHACOM]' };
    const log = el('div', 'log');
    log.setAttribute('aria-live', 'polite');
    const relancer = el('button', 'lien-console', 'rejouer la transmission');
    relancer.type = 'button';
    corps.append(log, relancer);

    let lecture = 0; // numéro de lecture : une relance interrompt la précédente
    async function jouer() {
      const numero = ++lecture;
      log.textContent = '';
      for (const message of rappel.messages) {
        if (numero !== lecture) return;
        const ligne = el('p', `log-ligne ${message.qui}`);
        ligne.append(el('span', 'log-prefixe', PREFIXES[message.qui] || ''), ' ');
        const contenu = el('span');
        ligne.appendChild(contenu);
        log.appendChild(ligne);
        if (calme) { contenu.textContent = message.texte; continue; }
        await attendre(message.qui === 'phaco' ? 700 : 300);
        for (const signe of message.texte) {
          if (numero !== lecture) return;
          contenu.textContent += signe;
          await attendre(16);
        }
      }
    }
    bloc.addEventListener('toggle', () => { if (bloc.open && !log.childElementCount) jouer(); });
    relancer.addEventListener('click', jouer);
  }

  function documents(rappel, corps) {
    rappel.documents.forEach((doc) => {
      const article = el('details', 'doc');
      article.appendChild(el('summary', null, doc.titre));
      doc.blocs.forEach((b) => {
        if (b.titre) article.appendChild(el('h3', null, b.titre));
        if (b.texte) article.appendChild(paragraphe('p', null, b.texte));
        if (b.liste) {
          const ul = el('ul');
          b.liste.forEach((item) => ul.appendChild(paragraphe('li', null, item)));
          article.appendChild(ul);
        }
      });
      corps.appendChild(article);
    });
    corps.appendChild(el('p', 'note', 'Touchez une barre noire pour lever la censure. Certaines ne se lèvent pas.'));
  }

  function dossier(rappel, corps) {
    rappel.semaines.forEach((s) => {
      const semaine = el('details', `semaine${s.nom ? '' : ' vide'}${s.execute ? ' execute' : ''}`);
      const resume = el('summary');
      resume.append(el('span', 'semaine-num', `WE${deuxChiffres(s.numero)}`));
      resume.appendChild(s.nom ? el('span', 'semaine-nom', `« ${s.nom} »`) : el('span', 'semaine-nom', '[non documenté]'));
      if (s.execute) resume.appendChild(el('span', 'tampon', 'exécuté'));
      semaine.appendChild(resume);
      if (s.coordonnees) semaine.appendChild(paragraphe('p', 'semaine-coord', s.coordonnees));
      const champs = el('dl');
      s.champs.forEach(([cle, valeur]) => {
        champs.appendChild(el('dt', null, cle));
        champs.appendChild(paragraphe('dd', null, valeur));
      });
      semaine.appendChild(champs);
      corps.appendChild(semaine);
    });
  }

  // Carte (SVG) : fond pré-rendu ou quadrillage, rivière, trajet éventuel, points touchables
  function carte(rappel, corps) {
    const NS = 'http://www.w3.org/2000/svg';
    const { ouest, est, sud, nord } = rappel.cadre;
    const cosLat = Math.cos(((sud + nord) / 2) * Math.PI / 180);
    const L = 1000;
    const H = Math.round(L * ((nord - sud) / ((est - ouest) * cosLat)));
    const px = (lon) => ((lon - ouest) / (est - ouest)) * L;
    const py = (lat) => ((nord - lat) / (nord - sud)) * H;
    const svg = (tag, attrs) => {
      const n = document.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
      return n;
    };

    const dessin = svg('svg', { viewBox: `0 0 ${L} ${H}`, class: 'carte', role: 'img', 'aria-label': rappel.titre });

    // Fond de carte pré-rendu sur le même cadre (sinon quadrillage, un trait tous les 0,01°)
    if (rappel.fond) dessin.appendChild(svg('image', { href: rappel.fond, x: 0, y: 0, width: L, height: H, preserveAspectRatio: 'none' }));
    else for (let lon = Math.ceil(ouest * 100) / 100; lon < est; lon += 0.01) dessin.appendChild(svg('line', { x1: px(lon), y1: 0, x2: px(lon), y2: H, class: 'carte-grille' }));
    if (!rappel.fond) for (let lat = Math.ceil(sud * 100) / 100; lat < nord; lat += 0.01) dessin.appendChild(svg('line', { x1: 0, y1: py(lat), x2: L, y2: py(lat), class: 'carte-grille' }));

    if (rappel.riviere) {
      dessin.appendChild(svg('polyline', { points: rappel.riviere.map(([lon, lat]) => `${px(lon)},${py(lat)}`).join(' '), class: 'carte-riviere' }));
    }

    const visibles = rappel.points;
    // Trajet seulement si l'épisode en donne un (liste d'identifiants de points dans l'ordre)
    if (rappel.trajet) {
      const etapes = rappel.trajet.map((id) => visibles.find((p) => p.id === id)).filter(Boolean);
      dessin.appendChild(svg('polyline', { points: etapes.map((p) => `${px(p.lon)},${py(p.lat)}`).join(' '), class: 'carte-trajet' }));
    }

    const detail = el('div', 'carte-detail');
    detail.setAttribute('aria-live', 'polite');
    detail.appendChild(el('p', 'note', 'Touchez un point pour lire la mission.'));

    const groupes = visibles.map((p, i) => {
      const g = svg('g', { class: `carte-point${p.verrouille ? ' verrouille' : ''}`, tabindex: 0, role: 'button', 'aria-label': `${p.id}, ${p.nom}` });
      g.append(
        svg('circle', { cx: px(p.lon), cy: py(p.lat), r: 26, class: 'carte-zone' }),
        svg('circle', { cx: px(p.lon), cy: py(p.lat), r: 9, class: 'carte-anneau' }),
        svg('circle', { cx: px(p.lon), cy: py(p.lat), r: 3.5, class: 'carte-coeur' }),
      );
      const num = svg('text', { x: px(p.lon) + 14, y: py(p.lat) - 12, class: 'carte-num' });
      num.textContent = deuxChiffres(i + 1);
      g.appendChild(num);
      const ouvrir = () => {
        groupes.forEach((autre) => autre.classList.remove('actif'));
        g.classList.add('actif');
        detail.textContent = '';
        const tete = el('div', 'carte-detail-tete');
        tete.append(el('span', null, `${p.id} · ${p.nom}`), el('span', 'carte-detail-code', p.nomCode));
        detail.append(tete, el('div', 'semaine-coord', `${p.lat.toFixed(4)}°N ${p.lon.toFixed(4)}°E`), paragraphe('p', null, p.texte));
        if (p.verrouille) detail.appendChild(el('p', 'fragments-refus', 'Accès verrouillé.'));
      };
      g.addEventListener('click', ouvrir);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); } });
      dessin.appendChild(g);
      return g;
    });

    corps.append(dessin, detail);
    if (rappel.source) corps.appendChild(el('p', 'note', rappel.source));
  }

  function fragments(rappel, corps) {
    const grille = el('div', 'fragments');
    const message = el('p', 'fragments-refus');
    message.setAttribute('aria-live', 'polite');
    rappel.fragments.forEach((code) => {
      const carte = el('button', 'fragment');
      carte.type = 'button';
      carte.innerHTML = SILHOUETTE;
      carte.append(el('span', 'fragment-code', code), el('span', 'fragment-purge', rappel.purge));
      carte.addEventListener('click', () => {
        grille.querySelectorAll('.fragment.refuse').forEach((f) => f.classList.remove('refuse'));
        void carte.offsetWidth;
        carte.classList.add('refuse');
        message.textContent = `${code} · ${rappel.refus}`;
      });
      grille.appendChild(carte);
    });
    corps.append(grille, message);
  }

  function attendre(ms) {
    return new Promise((ok) => setTimeout(ok, ms));
  }
})();
