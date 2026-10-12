// Page /jeu/ : la Terre vue de l'espace, qui tourne lentement. Chaque épisode est un point GPS ;
// le toucher fait pivoter la Terre vers la destination et ouvre sa fiche. Canvas 2D, sans librairie.
(() => {
  const canvas = document.querySelector('.terre');
  const ctx = canvas && canvas.getContext('2d');
  const TERRE = window.TERRE;
  const EPISODES = window.EPISODES || [];
  if (!ctx || !TERRE) return;

  const css = getComputedStyle(document.documentElement);
  const VERT = css.getPropertyValue('--green').trim() || '#00ff41';
  const ROUGE = css.getPropertyValue('--red').trim() || '#ff2a4f';
  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAD = Math.PI / 180;
  const hasard = (min, max) => min + Math.random() * (max - min);
  const deuxDec = (n) => Math.abs(n).toFixed(2).padStart(5, '0');

  const panneau = document.querySelector('.destination');
  const nav = document.querySelector('.destinations');
  const lectureCoord = document.querySelector('.terre-coord');

  // ---------- Vue : centre de la Terre affiché (lon, lat) et rayon ----------
  const vue = { lon: -10, lat: 22, zoom: 1 };
  let cible = null; // { lon, lat, zoom } quand la Terre pivote vers une destination
  let largeur = 0, hauteur = 0, rayon = 0, cx = 0, cy = 0;

  function redimensionner() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largeur = window.innerWidth;
    hauteur = window.innerHeight;
    canvas.width = Math.round(largeur * dpr);
    canvas.height = Math.round(hauteur * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = largeur / 2;
    cy = hauteur * (largeur < 700 ? 0.47 : 0.54);
  }
  window.addEventListener('resize', redimensionner);
  redimensionner();

  // Projection orthographique : la Terre telle qu'on la verrait de très loin.
  // Renvoie x, y à l'écran et z > 0 si le point est sur la face visible.
  let sinLat0 = 0, cosLat0 = 1;
  function projeter(lon, lat) {
    const l = (lon - vue.lon) * RAD, p = lat * RAD;
    const cosP = Math.cos(p), sinP = Math.sin(p);
    const x = cosP * Math.sin(l);
    const y = cosLat0 * sinP - sinLat0 * cosP * Math.cos(l);
    const z = sinLat0 * sinP + cosLat0 * cosP * Math.cos(l);
    return { x: cx + x * rayon, y: cy - y * rayon, nx: x, ny: y, z };
  }

  // Lumière du soleil, fixe par rapport à l'observateur (en haut à gauche)
  const SOLEIL = (() => { const v = [-0.55, 0.45, 0.7]; const n = Math.hypot(...v); return v.map((c) => c / n); })();
  const eclairage = (p) => p.nx * SOLEIL[0] + p.ny * SOLEIL[1] + p.z * SOLEIL[2];

  // ---------- Étoiles ----------
  const etoiles = Array.from({ length: 140 }, () => ({
    x: Math.random(), y: Math.random(), taille: Math.random() < 0.1 ? 1.4 : 0.8,
    eclat: hasard(0.15, 0.55), scintille: Math.random() < 0.15, phase: hasard(0, 6.28),
  }));

  // ---------- Destinations ----------
  const pins = EPISODES.filter((ep) => typeof ep.lat === 'number').map((ep) => ({ ep, ecran: null }));
  let choisi = null;

  pins.forEach((pin) => {
    const { ep } = pin;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `destination-lien ${ep.statut}`;
    b.textContent = ep.statut === 'verrouille' ? `${ep.numero} ░░░░░░` : `${ep.numero} ${ep.lieu}`;
    b.setAttribute('aria-label', ep.statut === 'verrouille' ? `Épisode ${ep.numero}, signal non identifié` : `Épisode ${ep.numero}, ${ep.lieu}`);
    b.addEventListener('click', () => choisir(pin));
    nav.appendChild(b);
    pin.bouton = b;
  });

  function coordonnees(ep) {
    if (ep.statut === 'verrouille') return '██.██°N ███.██°E';
    return `${deuxDec(ep.lat)}°${ep.lat >= 0 ? 'N' : 'S'} ${deuxDec(ep.lon)}°${ep.lon >= 0 ? 'E' : 'O'}`;
  }

  function choisir(pin) {
    choisi = pin;
    cible = { lon: pin.ep.lon, lat: Math.max(-35, Math.min(35, pin.ep.lat)), zoom: 1.18 };
    pins.forEach((p) => p.bouton.classList.toggle('actif', p === pin));
    afficherPanneau(pin.ep);
  }

  function afficherPanneau(ep) {
    panneau.textContent = '';
    const el = (tag, classe, texte) => { const n = document.createElement(tag); if (classe) n.className = classe; if (texte != null) n.textContent = texte; return n; };
    const fermer = el('button', 'destination-fermer', '×');
    fermer.type = 'button';
    fermer.setAttribute('aria-label', 'Fermer');
    fermer.addEventListener('click', () => {
      choisi = null;
      cible = { lon: vue.lon, lat: 22, zoom: 1 };
      pins.forEach((p) => p.bouton.classList.remove('actif'));
      panneau.hidden = true;
    });
    const verrou = ep.statut === 'verrouille';
    panneau.append(
      fermer,
      el('div', 'eyebrow', `Destination ${ep.numero}`),
      el('div', 'destination-lieu', verrou ? 'Signal non identifié' : ep.lieu),
      el('div', 'destination-coord', coordonnees(ep)),
    );
    if (verrou) {
      panneau.appendChild(el('p', 'destination-refus', 'Accès refusé. Triangulation en cours.'));
    } else {
      const etat = { archive: 'Mission validée · archive déclassifiée', 'en-cours': 'Protocole actif' }[ep.statut] || '';
      panneau.appendChild(el('p', 'destination-etat', etat));
      const lien = el('a', 'bouton', ep.statut === 'archive' ? 'Ouvrir le dossier' : 'Rejoindre');
      lien.href = ep.url;
      panneau.appendChild(lien);
    }
    panneau.hidden = false;
  }

  // ---------- Glisser pour faire tourner, toucher un point pour l'ouvrir ----------
  let glisse = null;
  let elan = 0; // vitesse de rotation résiduelle après un glissé
  canvas.style.pointerEvents = 'auto';
  canvas.addEventListener('pointerdown', (e) => {
    glisse = { x: e.clientX, y: e.clientY, lon: vue.lon, lat: vue.lat, deplace: 0, t: performance.now(), dernierX: e.clientX };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!glisse) return;
    const dx = e.clientX - glisse.x, dy = e.clientY - glisse.y;
    glisse.deplace = Math.max(glisse.deplace, Math.hypot(dx, dy));
    if (glisse.deplace < 6) return;
    cible = null;
    const degParPx = 90 / rayon;
    vue.lon = glisse.lon - dx * degParPx;
    vue.lat = Math.max(-70, Math.min(70, glisse.lat + dy * degParPx));
    elan = -(e.clientX - glisse.dernierX) * degParPx;
    glisse.dernierX = e.clientX;
  });
  canvas.addEventListener('pointerup', (e) => {
    if (glisse && glisse.deplace < 6) {
      // Un toucher : le point GPS le plus proche, s'il est assez près
      let meilleur = null, distMin = 28;
      pins.forEach((pin) => {
        if (!pin.ecran || pin.ecran.z <= 0) return;
        const d = Math.hypot(pin.ecran.x - e.clientX, pin.ecran.y - e.clientY);
        if (d < distMin) { distMin = d; meilleur = pin; }
      });
      if (meilleur) choisir(meilleur);
    }
    glisse = null;
  });
  canvas.addEventListener('pointercancel', () => { glisse = null; });

  // ---------- Dessin ----------
  let decalage = 0;
  let prochainGlitch = performance.now() + hasard(9000, 18000);
  const CALQUES = 5; // niveaux de luminosité des points de terre, dessinés par lots

  function dessiner(t) {
    rayon = Math.min(largeur, hauteur) * (largeur < 700 ? 0.42 : 0.3) * vue.zoom;
    sinLat0 = Math.sin(vue.lat * RAD);
    cosLat0 = Math.cos(vue.lat * RAD);
    ctx.clearRect(0, 0, largeur, hauteur);

    // Étoiles
    for (const s of etoiles) {
      const a = s.scintille ? s.eclat * (0.6 + 0.4 * Math.sin(t * 0.002 + s.phase)) : s.eclat;
      ctx.fillStyle = `rgba(220, 220, 220, ${a.toFixed(3)})`;
      ctx.fillRect(s.x * largeur, s.y * hauteur, s.taille, s.taille);
    }

    ctx.save();
    ctx.translate(decalage, 0);

    // Atmosphère : halo très léger autour du disque
    const halo = ctx.createRadialGradient(cx, cy, rayon * 0.98, cx, cy, rayon * 1.16);
    halo.addColorStop(0, 'rgba(190, 200, 210, 0.14)');
    halo.addColorStop(1, 'rgba(190, 200, 210, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, rayon * 1.16, 0, Math.PI * 2);
    ctx.fill();

    // Océan : disque sombre, éclairé côté soleil
    const ocean = ctx.createRadialGradient(cx - rayon * 0.45, cy - rayon * 0.4, rayon * 0.1, cx, cy, rayon);
    ocean.addColorStop(0, '#141414');
    ocean.addColorStop(0.7, '#080808');
    ocean.addColorStop(1, '#0d0d0d');
    ctx.fillStyle = ocean;
    ctx.beginPath();
    ctx.arc(cx, cy, rayon, 0, Math.PI * 2);
    ctx.fill();

    // Méridiens et parallèles, à peine visibles
    ctx.strokeStyle = 'rgba(160, 160, 160, 0.06)';
    ctx.lineWidth = 0.6;
    for (let lon = -180; lon < 180; lon += 30) trace((k) => [lon, -90 + k * 3], 61);
    for (let lat = -60; lat <= 60; lat += 30) trace((k) => [-180 + k * 6, lat], 61);

    // Terres : une trame de points, plus claire côté jour
    const lots = Array.from({ length: CALQUES }, () => []);
    const pts = TERRE.points;
    for (let i = 0; i < pts.length; i += 2) {
      const p = projeter(pts[i], pts[i + 1]);
      if (p.z <= 0.02) continue;
      const lum = Math.max(0, Math.min(1, 0.25 + 0.75 * eclairage(p)));
      lots[Math.min(CALQUES - 1, Math.floor(lum * CALQUES))].push(p);
    }
    const taille = Math.max(1.2, rayon / 190);
    lots.forEach((lot, i) => {
      ctx.fillStyle = `rgba(200, 200, 200, ${(0.12 + i * 0.13).toFixed(2)})`;
      for (const p of lot) ctx.fillRect(p.x - taille / 2, p.y - taille / 2, taille, taille);
    });

    // Côtes en fil fin
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.22)';
    ctx.lineWidth = 0.7;
    for (const ligne of TERRE.cotes) trace((k) => [ligne[k * 2], ligne[k * 2 + 1]], ligne.length / 2);

    // Points GPS des destinations
    pins.forEach((pin) => {
      const p = projeter(pin.ep.lon, pin.ep.lat);
      pin.ecran = p;
      if (p.z <= 0) return;
      const verrou = pin.ep.statut === 'verrouille';
      const couleur = verrou ? ROUGE : pin.ep.statut === 'en-cours' ? VERT : '#e6e6e6';
      const visible = Math.min(1, p.z * 4);
      // Signal non identifié : il clignote de façon irrégulière
      if (verrou && Math.sin(t * 0.004) + Math.sin(t * 0.0113) < -0.6) return;
      ctx.globalAlpha = visible;
      const onde = calme ? 0 : (t * 0.0006) % 1;
      ctx.strokeStyle = couleur;
      ctx.lineWidth = 1;
      ctx.globalAlpha = visible * (1 - onde) * 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 + onde * 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = visible;
      ctx.fillStyle = couleur;
      ctx.fillRect(p.x - 2.5, p.y - 2.5, 5, 5);
      if (pin === choisi) {
        // Viseur autour de la destination choisie
        ctx.strokeStyle = couleur;
        ctx.globalAlpha = visible * 0.7;
        const r = 14;
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.moveTo(p.x + sx * r, p.y + sy * (r - 5));
          ctx.lineTo(p.x + sx * r, p.y + sy * r);
          ctx.lineTo(p.x + sx * (r - 5), p.y + sy * r);
          ctx.stroke();
        });
      }
      ctx.globalAlpha = visible * 0.85;
      ctx.fillStyle = couleur;
      ctx.font = '11px ' + (css.getPropertyValue('--mono').trim() || 'monospace');
      ctx.fillText(verrou ? `EP${pin.ep.numero} · ░░░░` : `EP${pin.ep.numero} · ${pin.ep.lieu.toUpperCase()}`, p.x + (pin === choisi ? 20 : 10), p.y - (pin === choisi ? 14 : 8));
      ctx.globalAlpha = 1;
    });

    ctx.restore();

    if (lectureCoord && choisi && choisi.ep.statut === 'verrouille') {
      lectureCoord.textContent = '██.██°N ███.██°E'; // ne trahit pas la position du signal
    } else if (lectureCoord) {
      lectureCoord.textContent = `${deuxDec(vue.lat)}°${vue.lat >= 0 ? 'N' : 'S'} ${deuxDec(((vue.lon % 360) + 540) % 360 - 180)}°E`;
    }
  }

  // Trace une ligne (lon, lat) en coupant les morceaux situés derrière la Terre
  function trace(point, n) {
    let enCours = false;
    ctx.beginPath();
    for (let k = 0; k < n; k++) {
      const [lon, lat] = point(k);
      const p = projeter(lon, lat);
      if (p.z > 0) {
        if (enCours) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
        enCours = true;
      } else enCours = false;
    }
    ctx.stroke();
  }

  // ---------- Animation ----------
  function avancer(t, dt) {
    if (cible) {
      // Pivote par le plus court chemin vers la destination
      const dLon = ((cible.lon - vue.lon + 540) % 360) - 180;
      const k = Math.min(1, dt * 0.004);
      vue.lon += dLon * k;
      vue.lat += (cible.lat - vue.lat) * k;
      vue.zoom += (cible.zoom - vue.zoom) * k;
      if (Math.abs(dLon) < 0.05 && Math.abs(cible.lat - vue.lat) < 0.05 && Math.abs(cible.zoom - vue.zoom) < 0.002 && !choisi) cible = null;
    } else if (!glisse) {
      // Rotation lente, avec l'élan d'un glissé qui s'amortit
      vue.lon += 0.004 * dt + elan;
      elan *= 0.92;
    }
    if (t > prochainGlitch) {
      decalage = hasard(-7, 7);
      canvas.classList.add('glitch-fond');
      setTimeout(() => { decalage = 0; canvas.classList.remove('glitch-fond'); }, 110);
      prochainGlitch = t + hasard(10000, 20000);
    }
  }

  if (calme) {
    // Pas d'animation : la Terre est redessinée seulement quand on interagit
    const rendu = () => {
      if (cible) { vue.lon = cible.lon; vue.lat = cible.lat; vue.zoom = cible.zoom; }
      dessiner(0);
      requestAnimationFrame(rendu);
    };
    requestAnimationFrame(rendu);
    return;
  }

  let derniere = performance.now();
  function boucle(t) {
    requestAnimationFrame(boucle);
    const dt = Math.min(50, t - derniere);
    if (document.hidden || dt < 30) return; // ~30 images/s suffisent
    derniere = t;
    avancer(t, dt);
    dessiner(t);
  }
  requestAnimationFrame(boucle);
})();
