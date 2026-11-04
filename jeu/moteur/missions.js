// Moteur des épisodes jouables à deux (un téléphone chacun, sans serveur).
// Lit window.EPISODE (voir /jeu/ep02/episode.js) et construit la page dans #jeu.
// Chaque joueur ouvre son dossier (un des deux rôles). Dans une mission, l'un est sur le terrain, l'autre a la clé :
// chacun ne voit que sa moitié de l'énigme. Les réponses sont vérifiées dans le téléphone par empreinte SHA-256.
// Après chaque mission, un duel désigne un vainqueur ; le registre des points mène au verdict final.
// Progression sauvegardée dans localStorage, une clé par épisode.
(() => {
  const ep = window.EPISODE;
  const racine = document.getElementById('jeu');
  if (!ep || !racine) return;

  const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const attendre = (ms) => new Promise((ok) => setTimeout(ok, ms));
  const deuxChiffres = (n) => String(n).padStart(2, '0');
  const ROLES = Object.keys(ep.roles);
  const T = {
    barre: 'protocole actif', eyebrow: `Épisode ${ep.numero}`, intro: ['Signal identifié.'], choixRole: 'Choisissez chacun un rôle.',
    choixRoleBouton: 'Choisir', transmission: 'Transmission', progression: 'Missions validées', registre: 'Registre',
    valide: 'Validé', piece: 'Mot récupéré', note: 'Note', terrain: 'Tu es sur le terrain', cle: 'Tu as la clé', deux: 'Mission à deux',
    joker: 'demander un joker', forcer: 'forcer l’ouverture', contourner: 'capteur en panne ? contournement manuel',
    dossier: 'Dossier', mots: 'Mots récupérés', autre: 'ton binôme',
    ...(ep.textes || {}),
  };
  const PREFIXES = { systeme: '[SYSTEM]', ...(ep.prefixes || {}) };

  function el(tag, classe, texte) {
    const noeud = document.createElement(tag);
    if (classe) noeud.className = classe;
    if (texte != null) noeud.textContent = texte;
    return noeud;
  }
  function bouton(classe, texte, action) {
    const b = el('button', classe, texte);
    b.type = 'button';
    if (action) b.addEventListener('click', action);
    return b;
  }

  // ---------- Textes brouillés (« ~ » + base64 d'un XOR) ----------
  const CLE = new TextEncoder().encode('phacomochere');
  const decodeur = new TextDecoder();
  function lire(valeur) {
    if (typeof valeur !== 'string' || valeur[0] !== '~') return valeur;
    const brut = atob(valeur.slice(1));
    const octets = new Uint8Array(brut.length);
    for (let i = 0; i < brut.length; i++) octets[i] = brut.charCodeAt(i) ^ CLE[i % CLE.length];
    return decodeur.decode(octets);
  }
  const messages = (liste) => (liste || []).map((m) => ({ qui: m.qui, texte: lire(m.texte) }));

  // ---------- Réponses ----------
  const normaliser = (texte) => texte.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/[^a-z0-9]/g, '');
  async function empreinte(mission, reponse) {
    const octets = new TextEncoder().encode(`${ep.id}:${mission}:${normaliser(reponse)}`);
    const hache = await crypto.subtle.digest('SHA-256', octets);
    return [...new Uint8Array(hache)].map((o) => o.toString(16).padStart(2, '0')).join('');
  }
  // Empreinte rapide (FNV-1a) pour les codes qui changent avec le temps et le code de registre
  function fnv(texte) {
    let h = 0x811c9dc5;
    for (const c of texte) {
      h ^= c.charCodeAt(0);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h;
  }

  // ---------- Sauvegarde ----------
  // Mode test (?test ou ?test=AAAA-MM-JJ) : sauvegarde séparée et choix du jour, pour essayer sans toucher à la vraie partie
  const parametres = new URLSearchParams(location.search);
  const test = parametres.has('test');
  const CLE_SAUVEGARDE = test ? `locost-${ep.id}-test` : `locost-${ep.id}`;
  const vide = () => ({ role: null, valides: {}, essais: {}, jokers: {}, forces: {}, verrous: {}, choix: {}, photos: {}, portraits: {}, lus: {}, duels: {}, quiz: {}, verdict: {} });
  let etat;
  try { etat = { ...vide(), ...JSON.parse(localStorage.getItem(CLE_SAUVEGARDE) || '{}') }; } catch { etat = vide(); }
  function sauver() {
    try { localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(etat)); } catch { /* quota or private mode: the game still works for this visit */ }
  }

  // ---------- Date du jour, heure de l'épisode (Pékin) ----------
  const locale = ['localhost', '127.0.0.1'].includes(location.hostname);
  const dateValide = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : null);
  const dateForcee = (test && dateValide(parametres.get('test'))) || (locale && dateValide(parametres.get('date')));
  const decalage = (ep.fuseau || 0) * 3600000;
  const aujourdhui = () => dateForcee || new Date(Date.now() + decalage).toISOString().slice(0, 10);
  const debutJour = (date) => Date.parse(`${date}T00:00:00Z`) - decalage;
  const dateCourte = (date) => `${date.slice(8, 10)}.${date.slice(5, 7)}`;
  const ouverte = (m) => !m.date || m.date <= aujourdhui() || etat.forces[m.id];
  const numero = (m) => m.id.replace(/\D/g, '');
  const autreRole = (role) => ROLES.find((r) => r !== role);
  const nom = (role) => lire(ep.roles[role].nom);
  const surnom = (role) => lire(ep.roles[role].surnom) || nom(role);
  const images = `/jeu/${ep.id}/images/`;

  // ---------- Squelette de la page ----------
  const barre = el('header', 'barre');
  const barreRole = el('span');
  barre.append(el('span', 'point', T.barre), barreRole);
  document.body.insertBefore(barre, racine);
  // Zone qui défile entre la barre du haut et les onglets du bas : les deux barres restent fixes,
  // même quand Safari fait rebondir la page
  const defile = el('div', 'defile');
  document.body.insertBefore(defile, racine);
  defile.appendChild(racine);
  const lienRetour = document.querySelector('.retour');
  if (lienRetour) defile.appendChild(lienRetour);

  const tete = el('div', 'fiche-tete');
  const titre = el('h1', 'glitch', ep.titre);
  titre.dataset.text = ep.titre;
  const intro = el('p', 'terminal');
  intro.dataset.lines = T.intro.join('|');
  tete.append(el('div', 'eyebrow', T.eyebrow), titre, intro);
  const zone = el('div', 'jeu-zone');
  racine.append(tete, zone);

  // Bandeau du mode test : un lien par jour d'épreuve
  if (test) {
    const bandeau = el('nav', 'bandeau-test');
    bandeau.appendChild(el('span', null, 'mode test · jour :'));
    const jours = [...new Set(ep.missions.map((m) => m.date).filter(Boolean))];
    [null, ...jours].forEach((d) => {
      const lien = el('a', d === dateForcee || (!d && !dateForcee) ? 'actif' : '', d ? dateCourte(d) : 'auj.');
      lien.href = d ? `?test=${d}` : '?test';
      bandeau.appendChild(lien);
    });
    const quitter = el('a', 'quitter', 'quitter');
    quitter.href = location.pathname;
    bandeau.appendChild(quitter);
    defile.insertBefore(bandeau, racine);
  }

  // ---------- Onglets : Aujourd'hui · Carte · Dossier · Registre ----------
  const ONGLETS = [['jour', 'Aujourd’hui'], ['carte', 'Carte'], ['dossier', 'Dossier'], ['registre', 'Registre']];
  let onglet = 'jour';
  try { onglet = sessionStorage.getItem(`${CLE_SAUVEGARDE}-onglet`) || 'jour'; } catch { /* private mode */ }
  const ouverts = new Set(); // missions dépliées par le joueur, gardées d'un rendu à l'autre
  const nav = el('nav', 'onglets');
  nav.setAttribute('aria-label', 'Menu du jeu');
  document.body.appendChild(nav);

  function changerOnglet(id, missionId) {
    onglet = id;
    try { sessionStorage.setItem(`${CLE_SAUVEGARDE}-onglet`, id); } catch { /* private mode */ }
    if (missionId) ouverts.add(missionId);
    afficher();
    defile.scrollTop = 0;
    if (missionId) {
      const cible = zone.querySelector(`.mission[data-id="${missionId}"]`);
      if (cible) cible.scrollIntoView({ block: 'start' });
    }
  }

  function afficher() {
    zone.textContent = '';
    const s = etat.role ? scores() : null;
    barreRole.textContent = etat.role ? ROLES.map((r) => `${surnom(r)} ${s[r]}`).join(' · ') : `EP${ep.numero}`;
    barreRole.className = 'barre-score';
    barre.firstChild.textContent = etat.role ? `EP${ep.numero}` : T.barre;
    document.body.classList.toggle('avec-onglets', !!etat.role);
    nav.textContent = '';
    if (!etat.role) { choixRole(); return caler(); }
    ONGLETS.forEach(([id, libelle]) => {
      const b = bouton(`onglet${id === onglet ? ' actif' : ''}`, libelle, () => changerOnglet(id));
      b.dataset.onglet = id;
      if (id === onglet) b.setAttribute('aria-current', 'page');
      nav.appendChild(b);
    });
    const vues = { jour: vueJour, carte: vueCarte, dossier: vueDossier, registre: vueRegistre };
    zone.appendChild((vues[onglet] || vueJour)());
    caler();
  }
  function caler() {
    defile.style.top = `${barre.offsetHeight}px`;
    defile.style.bottom = `${etat.role ? nav.offsetHeight : 0}px`;
  }
  window.addEventListener('resize', caler);

  // Aujourd'hui : une carte claire pour l'épreuve du jour, ses étapes, puis la suivante
  function vueJour() {
    const vue = el('section', 'vue vue-jour');
    const date = aujourdhui();
    const premier = jouables[0].date;
    const jour = Math.round((Date.parse(date) - Date.parse(premier)) / 86400000) + 2; // jour 1 = départ de Paris, la veille
    const libelle = new Date(`${date}T12:00:00Z`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
    const tete = el('header', 'jour-tete');
    const avant = Math.round((Date.parse(premier) - Date.parse(date)) / 86400000) - 1;
    tete.append(el('p', 'jour-date', libelle), el('p', 'jour-compte', jour >= 1 && jour <= 13 ? `Jour ${jour} sur 13` : avant > 0 ? `Départ dans ${avant} jour${avant > 1 ? 's' : ''}` : 'Voyage terminé'));
    vue.appendChild(tete);
    if (!etat.portraits[etat.role]) vue.appendChild(pieceManquante());
    const aFaire = ep.missions.filter((m) => ouverte(m) && !terminee(m));
    if (aFaire.length) {
      aFaire.forEach((m) => vue.appendChild(carteDuJour(m, date)));
    } else {
      const repos = el('div', 'repos');
      repos.append(cliche(`${images}lotus.jpg`, 'Bada Shanren, Lotus et canards (XVIIe s.)', 'scotch'), el('p', 'repos-titre', 'Rien à remplir aujourd’hui'), el('p', null, 'Le Bureau vous accorde un temps de repos réglementaire.'));
      vue.appendChild(repos);
    }
    const prochain = compteARebours();
    if (prochain) vue.appendChild(prochain);
    return vue;
  }

  // Épreuve du jour : titre, lieu, étapes (formulaire, duel, classé), puis le contenu directement déplié
  function carteDuJour(m, date) {
    const carteJour = el('article', 'carte-jour');
    carteJour.dataset.id = m.id;
    const titre = el('header', 'carte-jour-tete');
    const retard = m.date && m.date < date;
    titre.append(
      el('p', 'carte-jour-sur', retard ? `En retard · ${dateCourte(m.date)}` : m.date ? 'Épreuve du jour' : 'Avant le départ'),
      el('h2', 'carte-jour-titre', `${numero(m)} · ${m.lieu}`),
      el('p', 'carte-jour-ville', m.ville),
    );
    carteJour.appendChild(titre);
    const etapesJour = [['Formulaire', true], ...(m.duel ? [['Duel', true]] : []), ...(m.verdict ? [['Verdict', true]] : [])];
    const faite = (i) => (i === 0 ? !!etat.valides[m.id] : etapesJour[i][0] === 'Duel' ? !!etat.duels[m.id] : !!etat.verdict.rendu);
    const courante = etapesJour.findIndex((_, i) => !faite(i));
    const fil = el('ol', 'etapes-jour');
    etapesJour.forEach(([nomEtape], i) => fil.appendChild(el('li', faite(i) ? 'faite' : i === courante ? 'courante' : '', nomEtape)));
    carteJour.appendChild(fil);
    const corps = el('div', 'carte-jour-corps');
    carteJour.appendChild(corps);
    remplir(m, corps);
    return carteJour;
  }

  function compteARebours() {
    const prochaine = jouables.find((m) => !ouverte(m));
    if (!prochaine) return null;
    const ligne = el('p', 'progression-prochain');
    const maj = () => {
      const reste = Math.max(0, debutJour(prochaine.date) - Date.now());
      const h = Math.floor(reste / 3600000);
      const j = Math.floor(h / 24);
      const mn = Math.floor((reste % 3600000) / 60000);
      ligne.textContent = `prochaine épreuve · ${prochaine.ville} · ${j ? `${j} j ` : ''}${deuxChiffres(h % 24)} h ${deuxChiffres(mn)}`;
      if (reste === 0 && !dateForcee) afficher();
    };
    maj();
    const minuteur = setInterval(() => { if (!ligne.isConnected) clearInterval(minuteur); else maj(); }, 30000);
    return ligne;
  }

  // Carte : le tracé avance d'étape en étape, puis le carnet de route
  const etapes = ep.etapes || [];
  const atteinte = (e) => e.missions.some((id) => {
    const m = ep.missions.find((x) => x.id === id);
    return m && (etat.valides[id] || (m.date && m.date <= aujourdhui()));
  });
  // Carte : seulement le tracé, qui avance d'étape en étape
  function vueCarte() {
    const vue = el('section', 'vue vue-carte');
    vue.appendChild(carte());
    return vue;
  }

  function carte() {
    const C = window.CARTE_CHINE;
    const cadre = el('figure', 'carte-chine');
    if (!C) return cadre;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${C.largeur} ${C.hauteur}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Carte de la Chine et tracé du voyage');
    const xy = (e) => [(e.lon - C.lon0) * C.kx, (C.lat1 - e.lat) * C.ky];
    const noeud = (tag, attrs, texte) => {
      const n = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
      if (texte) n.textContent = texte;
      svg.appendChild(n);
      return n;
    };
    // Graticule discret tous les 5°
    let grille = '';
    for (let lon = 75; lon <= 135; lon += 5) { const x = (lon - C.lon0) * C.kx; grille += `M${x} 0V${C.hauteur}`; }
    for (let lat = 20; lat <= 54; lat += 5) { const y = (C.lat1 - lat) * C.ky; grille += `M0 ${y}H${C.largeur}`; }
    noeud('path', { d: grille, class: 'carte-grille' });
    noeud('path', { d: C.voisins, class: 'carte-voisins' });
    noeud('path', { d: C.chine, class: 'carte-terre' });
    noeud('text', { x: C.largeur * 0.12, y: C.hauteur * 0.42, class: 'carte-pays' }, '中 国');

    const faites = etapes.filter(atteinte);
    // Arrivée depuis Paris : flèche qui entre par l'ouest
    const depart = [0, (C.lat1 - 40) * C.ky];
    let precedent = depart;
    faites.forEach((e, i) => {
      const [x, y] = xy(e);
      const [px, py] = precedent;
      const courbe = e.via === 'avion';
      const cx = (px + x) / 2;
      const cy = Math.min(py, y) - (courbe ? Math.hypot(x - px, y - py) * 0.25 : 0);
      const d = courbe ? `M${px} ${py}Q${cx} ${cy} ${x} ${y}` : `M${px} ${py}L${x} ${y}`;
      const trait = noeud('path', { d, class: `carte-trace via-${e.via}` });
      if (i === faites.length - 1) {
        // Dernier segment : se dessine à l'ouverture de l'onglet
        const longueur = trait.getTotalLength ? trait.getTotalLength() : 600;
        trait.style.setProperty('--longueur', longueur);
        trait.classList.add('nouveau');
      }
      precedent = [x, y];
    });
    etapes.forEach((e) => {
      if (!faites.includes(e)) return;
      const [x, y] = xy(e);
      const ici = e === faites[faites.length - 1];
      noeud('circle', { cx: x, cy: y, r: ici ? 9 : 6, class: `carte-ville${ici ? ' ici' : ''}` });
      if (!e.skyline) return; // excursions (Suzhou, Dazu) : point seul, pour ne pas chevaucher la grande ville voisine
      const gauche = x > C.largeur * 0.7 ? -1 : 1;
      noeud('text', { x: x + 16 * gauche, y: y - 14, class: 'carte-nom', 'text-anchor': gauche < 0 ? 'end' : 'start' }, `${e.nom} ${e.zh}`);
    });
    if (!faites.length) noeud('text', { x: 40, y: depart[1] - 16, class: 'carte-nom' }, 'départ : Paris →');
    cadre.appendChild(svg);
    const reste = etapes.length - faites.length;
    cadre.appendChild(el('figcaption', null, reste ? `${faites.length} étape${faites.length > 1 ? 's' : ''} sur ${etapes.length} · la suite se dévoile en route` : 'itinéraire complet'));
    return cadre;
  }

  function vueDossier() {
    const vue = dossier();
    vue.classList.add('vue', 'vue-dossier');
    return vue;
  }

  // Registre : d'abord le récit (notification officielle puis dépêches du Bureau), qui défile à l'arrivée,
  // ensuite le score et les épreuves déjà ouvertes. Rien de ce qui n'est pas encore arrivé n'apparaît.
  function vueRegistre() {
    const vue = el('section', 'vue vue-registre');
    vue.appendChild(recit());
    vue.appendChild(progression());
    const ouvertes = ep.missions.filter(ouverte);
    const tableau = el('div', 'registre-duels');
    tableau.appendChild(el('p', 'eyebrow', 'Épreuves, duels et décisions'));
    const liste = el('div', 'rappels missions');
    ouvertes.forEach((m) => liste.appendChild(mission(m)));
    tableau.appendChild(liste);
    const reste = ep.missions.length - ouvertes.length;
    if (reste) tableau.appendChild(el('p', 'note registre-reste', `${reste} épreuve${reste > 1 ? 's' : ''} encore scellée${reste > 1 ? 's' : ''} par le Bureau.`));
    vue.append(tableau, pied());
    return vue;
  }

  // Le récit : la notification d'ouverture, puis les messages reçus après chaque épreuve, joués une fois en animé
  function recit() {
    const bloc = el('section', 'recit');
    bloc.appendChild(el('p', 'eyebrow', T.transmission));
    const lecteurs = [];
    const ajouter = (titreDepeche, liste, cle) => {
      if (!liste.length) return;
      const depeche = el('div', 'depeche');
      if (titreDepeche) depeche.appendChild(el('p', 'depeche-titre', titreDepeche));
      const sortie = journalUnique(liste, cle);
      lecteurs.push(sortie);
      depeche.appendChild(sortie.log);
      bloc.appendChild(depeche);
    };
    ajouter(null, messages(ep.transmission), 'intro');
    ep.missions.forEach((m) => {
      if (!etat.valides[m.id] || !m.apres) return;
      const suite = [...messages(m.apres.commun), ...messages(m.apres[etat.role])];
      ajouter(`${m.date ? dateCourte(m.date) : 'Paris'} · ${m.lieu}`, suite, `apres-${m.id}`);
    });
    bloc.appendChild(bouton('lien-console', 'relire depuis le début', () => lecteurs.reduce((p, l) => p.then(() => l.jouer(false)), Promise.resolve())));
    return bloc;
  }

  // ---------- Choix du dossier (rôle) ----------
  function choixRole() {
    const bloc = el('section', 'roles');
    bloc.appendChild(el('p', 'roles-texte', T.choixRole));
    const choix = el('div', 'roles-choix');
    ROLES.forEach((role) => {
      const carte = fiche(role, false);
      carte.appendChild(bouton('bouton role', T.choixRoleBouton, () => {
        if (!window.confirm(`Confirmer : tu es ${nom(role)} ?`)) return;
        etat.role = role;
        sauver();
        onglet = 'registre'; // première ouverture : le récit d'abord
        try { sessionStorage.setItem(`${CLE_SAUVEGARDE}-onglet`, onglet); } catch { /* private mode */ }
        afficher();
        defile.scrollTop = 0;
      }));
      choix.appendChild(carte);
    });
    bloc.appendChild(choix);
    zone.appendChild(bloc);
  }

  // ---------- Fiche de douane d'un candidat, photo d'identité agrafée ----------
  function fiche(role, modifiable) {
    const r = ep.roles[role];
    const carte = el('article', 'fiche-candidat douane');
    const tete = el('header', 'douane-tete');
    tete.append(
      el('span', 'douane-pays', '中华人民共和国 · 同名管理局'),
      el('span', 'douane-titre', 'Fiche de contrôle · homonymes'),
      el('span', 'douane-numero', `N° ${lire(r.numero) || role}`),
    );
    const corps = el('div', 'douane-corps');
    const portrait = cliche(etat.portraits[role] || `${images}silhouette.svg`, null, 'agrafe identite');
    if (!etat.portraits[role]) portrait.classList.add('vide');
    if (modifiable) {
      const fichier = champPhoto(role === etat.role ? 'user' : 'environment', async (donnees) => {
        etat.portraits[role] = donnees;
        sauver();
        carte.replaceWith(fiche(role, true));
      });
      const libelle = etat.portraits[role] ? 'changer la photo' : role === etat.role ? 'agrafer ta photo' : 'photographier l’autre candidat';
      portrait.append(fichier, bouton('lien-console', libelle, () => fichier.click()));
    }
    const champs = el('dl', 'douane-champs');
    const fixes = el('dl', 'douane-champs');
    (r.fiche || []).forEach((ligne) => {
      const texte = lire(ligne);
      const coupure = texte.indexOf(' : ');
      fixes.append(el('dt', null, coupure < 0 ? '' : texte.slice(0, coupure)), el('dd', null, coupure < 0 ? texte : texte.slice(coupure + 3)));
    });
    if (!modifiable) champs.append(...fixes.childNodes);
    else champs.append(el('dt', null, 'Nom'), el('dd', 'douane-nom', nom(role)));
    if (modifiable) {
      // Champs qui évoluent avec le voyage
      const s = scores();
      const autre = autreRole(role);
      const ajout = (cle, valeur) => champs.append(el('dt', 'evolutif', cle), el('dd', 'evolutif', valeur));
      ajout('Statut', statut(role));
      ajout('Paulitude', `${s[role]} point${s[role] > 1 ? 's' : ''} · ${s[role] > s[autre] ? 'en tête du registre' : s[role] < s[autre] ? 'à la traîne' : 'à égalité'}`);
      const gagnes = Object.values(etat.duels).filter((g) => g === role).length;
      ajout('Duels remportés', String(gagnes));
    }
    corps.append(portrait, champs);
    carte.append(tete, corps);
    if (modifiable) {
      const plus = el('details', 'douane-plus');
      plus.append(el('summary', null, 'fiche complète'), fixes);
      carte.appendChild(plus);
    }
    if (modifiable) {
      const visas = el('div', 'douane-visas');
      visas.appendChild(el('span', 'eyebrow', 'Visas d’entrée'));
      const page = el('div', 'visas-page');
      const COULEURS = ['rouge', 'bleu', 'violet', 'vert', 'rouge', 'bleu'];
      etapes.forEach((e, i) => {
        if (!atteinte(e)) return page.appendChild(el('span', 'visa vide', ''));
        const premiere = ep.missions.find((m) => m.id === e.missions[0]);
        const visa = el('span', `visa ${COULEURS[i]}`);
        visa.style.setProperty('--angle', `${((i * 37) % 17) - 8}deg`);
        visa.append(el('strong', null, e.zh), el('span', null, e.nom.toUpperCase()), el('small', null, premiere && premiere.date ? `ENTRÉE ${dateCourte(premiere.date)}.26` : 'ENTRÉE'));
        page.appendChild(visa);
      });
      visas.appendChild(page);
      carte.appendChild(visas);
    }
    if (r.avis) {
      const avis = el('footer', 'douane-avis');
      avis.appendChild(el('span', 'eyebrow', 'Observations de l’agent'));
      const aucune = !ep.missions.some((m) => m.notes && etat.valides[m.id]);
      if (!modifiable || aucune) avis.appendChild(el('p', null, lire(r.avis)));
      if (modifiable) {
        const notes = ep.missions.filter((m) => m.notes && etat.valides[m.id]).reverse();
        const note = (m) => {
          const li = el('li');
          li.append(el('span', 'note-date', m.date ? dateCourte(m.date) : 'Paris'), el('span', null, lire(m.notes[role])));
          return li;
        };
        if (notes.length) {
          const liste = el('ul', 'douane-notes');
          liste.appendChild(note(notes[0]));
          avis.appendChild(liste);
        }
        if (notes.length > 1) {
          const anciennes = el('details', 'douane-plus');
          const liste = el('ul', 'douane-notes');
          notes.slice(1).forEach((m) => liste.appendChild(note(m)));
          anciennes.append(el('summary', null, `notes précédentes (${notes.length - 1})`), liste);
          avis.appendChild(anciennes);
        }
      }
      avis.appendChild(el('span', 'tampon', etat.verdict.rendu && modifiable ? (scores()[role] >= scores()[autreRole(role)] ? 'Paul n°1' : 'Paul n°2') : 'À surveiller'));
      carte.appendChild(avis);
    }
    return carte;
  }

  // Rappel tant que la photo d'identité du joueur manque
  function pieceManquante() {
    const bloc = el('div', 'piece-manquante');
    const fichier = champPhoto('user', async (donnees) => {
      etat.portraits[etat.role] = donnees;
      sauver();
      afficher();
    });
    bloc.append(
      el('span', 'tampon', 'Pièce manquante'),
      el('p', null, 'Le Bureau exige une photo d’identité, agrafée à ta fiche de contrôle. Sans sourire, de préférence.'),
      fichier,
      bouton('bouton', 'Prendre la photo', () => fichier.click()),
    );
    return bloc;
  }

  // Statut administratif : monte avec les villes traversées
  function statut(role) {
    if (etat.verdict.rendu) {
      const s = scores();
      return s[role] >= s[autreRole(role)] ? 'Paul n°1, à titre définitif' : 'Paul n°2, sans appel';
    }
    const liste = (ep.statuts || []).map(lire);
    const villes = etapes.filter((e) => e.skyline && atteinte(e)).length;
    return liste[Math.min(villes, liste.length - 1)] || '';
  }

  // Tirage photo collé sur le papier : agrafe, scotch ou trombone
  function cliche(source, legende, maniere) {
    const cadre = el('figure', `cliche ${maniere || 'scotch'}`);
    const image = el('img');
    image.src = source;
    image.alt = legende || 'photo';
    image.loading = 'lazy';
    cadre.appendChild(image);
    if (legende) cadre.appendChild(el('figcaption', null, legende));
    return cadre;
  }
  const MANIERES = ['scotch', 'agrafe', 'trombone'];
  const maniere = (m) => MANIERES[Number(numero(m)) % MANIERES.length];

  // Champ photo caché (appareil du téléphone), réduit pour tenir dans la sauvegarde
  function champPhoto(camera, quandPrete) {
    const fichier = el('input');
    Object.assign(fichier, { type: 'file', accept: 'image/*', hidden: true });
    fichier.setAttribute('capture', camera);
    fichier.addEventListener('change', async () => {
      const image = fichier.files && fichier.files[0];
      if (!image) return;
      try {
        await quandPrete(await reduire(image, 640));
      } catch {
        window.alert('Photo illisible, recommence.');
      }
    });
    return fichier;
  }

  // ---------- Transmission façon terminal ----------
  function journal(liste, instantane) {
    const log = el('div', 'log');
    log.setAttribute('aria-live', 'polite');
    let lecture = 0;
    async function jouer(vite) {
      const numeroLecture = ++lecture;
      log.textContent = '';
      for (const message of liste) {
        if (numeroLecture !== lecture) return;
        const ligne = el('p', `log-ligne ${message.qui}`);
        ligne.append(el('span', 'log-prefixe', PREFIXES[message.qui] || ''), ' ');
        const contenu = el('span');
        ligne.appendChild(contenu);
        log.appendChild(ligne);
        if (calme || vite) { contenu.textContent = message.texte; continue; }
        await attendre(message.qui === 'systeme' ? 300 : 700);
        for (const signe of message.texte) {
          if (numeroLecture !== lecture) return;
          contenu.textContent += signe;
          await attendre(16);
        }
      }
    }
    jouer(instantane);
    return { log, jouer };
  }
  // Messages joués une seule fois en animé, puis affichés directement
  function journalUnique(liste, cleLu) {
    const sortie = journal(liste, etat.lus[cleLu]);
    etat.lus[cleLu] = true;
    sauver();
    return sortie;
  }
  // ---------- Registre des points ----------
  function issueChoix(m, memoire) {
    if (!memoire || memoire.moi == null || memoire.autre == null) return null;
    return m.issues[`${memoire.moi}-${memoire.autre}`];
  }
  function scores() {
    const total = Object.fromEntries(ROLES.map((r) => [r, 0]));
    ep.missions.forEach((m) => {
      const gagnant = etat.duels[m.id];
      if (gagnant && gagnant !== 'egal') total[gagnant] += 1;
      if (m.type === 'choix') {
        const issue = issueChoix(m, etat.choix[m.id]);
        if (issue) {
          total[etat.role] += issue.moi || 0;
          total[autreRole(etat.role)] += issue.autre || 0;
        }
      }
    });
    if (etat.verdict.departage) total[etat.verdict.departage] += 1;
    return total;
  }
  // Code de registre : identique sur les deux téléphones si les registres concordent
  function codeRegistre() {
    const lignes = ep.missions.map((m) => {
      if (m.type === 'choix') {
        const c = etat.choix[m.id] || {};
        const parRole = { [etat.role]: c.moi, [autreRole(etat.role)]: c.autre };
        return ROLES.map((r) => (parRole[r] == null ? '-' : parRole[r])).join('');
      }
      const g = etat.duels[m.id];
      return g ? String(g === 'egal' ? 0 : ROLES.indexOf(g) + 1) : '-';
    });
    return String(fnv(`${ep.id}:${lignes.join('|')}`) % 10000).padStart(4, '0');
  }

  // ---------- Progression ----------
  const jouables = ep.missions.filter((m) => m.date);
  function progression() {
    const total = jouables.length;
    const faits = jouables.filter((m) => etat.valides[m.id]).length;
    const bloc = el('section', 'progression');
    const ligneTete = el('div', 'progression-tete');
    ligneTete.append(el('span', 'eyebrow', T.progression), el('span', 'progression-compte', `${deuxChiffres(faits)} / ${deuxChiffres(total)}`));
    const jauge = el('div', 'progression-jauge');
    jouables.forEach((m) => jauge.appendChild(el('span', etat.valides[m.id] ? 'plein' : ouverte(m) ? 'ouvert' : '')));
    bloc.append(ligneTete, jauge);

    const s = scores();
    const registre = el('div', 'registre');
    registre.appendChild(el('span', 'eyebrow', T.registre));
    const points = el('div', 'registre-points');
    ROLES.forEach((r) => {
      const ligne = el('span', `registre-ligne${r === etat.role ? ' moi' : ''}`);
      ligne.append(el('span', null, surnom(r)), el('strong', null, String(s[r])));
      points.appendChild(ligne);
    });
    registre.appendChild(points);
    bloc.appendChild(registre);

    return bloc;
  }

  // ---------- Missions ----------
  // Une mission est terminée quand le formulaire est validé et le duel tranché
  const terminee = (m) => etat.valides[m.id] && (!m.duel || etat.duels[m.id]) && (m.type !== 'final' || etat.verdict.rendu);

  function mission(m) {
    const bloc = el('details', 'rappel mission');
    bloc.dataset.id = m.id;
    const fini = terminee(m);
    const ouv = ouverte(m);
    bloc.classList.toggle('valide', !!fini);
    bloc.classList.toggle('ferme', !ouv);
    const resume = el('summary');
    const gagnant = m.duel && etat.duels[m.id];
    const etiquette = fini ? (gagnant ? (gagnant === 'egal' ? 'égalité' : surnom(gagnant)) : T.valide) : ouv ? (etat.valides[m.id] ? (m.verdict ? 'verdict' : 'duel') : 'en cours') : m.date ? dateCourte(m.date) : '';
    resume.append(
      el('span', 'rappel-num', numero(m)),
      el('span', 'rappel-titre', m.lieu),
      el('span', `mission-etat${fini ? ' valide' : ouv ? ' actif' : ''}`, etiquette),
    );
    const corps = el('div', 'rappel-corps');
    bloc.append(resume, corps);
    bloc.addEventListener('toggle', () => {
      if (bloc.open) ouverts.add(m.id); else ouverts.delete(m.id);
      if (bloc.open && !corps.childElementCount) remplir(m, corps);
    });
    if (ouverts.has(m.id)) bloc.open = true;
    return bloc;
  }

  // Nouveau rendu de l'onglet en gardant la position et l'épreuve dépliée
  function rafraichir(m) {
    ouverts.add(m.id);
    const y = defile.scrollTop;
    afficher();
    defile.scrollTop = y;
  }

  function remplir(m, corps) {
    corps.appendChild(el('p', 'mission-lieu', `${m.date ? `${dateCourte(m.date)} · ` : ''}${m.ville}`));

    if (!ouverte(m)) {
      corps.appendChild(el('p', 'mission-texte', `Ouverture le ${dateCourte(m.date)}, à minuit heure de Pékin.`));
      corps.appendChild(bouton('lien-console', T.forcer, () => {
        if (!window.confirm('Ouvrir cette épreuve en avance ? À faire seulement si le guide a changé l’ordre des visites.')) return;
        etat.forces[m.id] = true;
        sauver();
        rafraichir(m);
      }));
      return;
    }

    if (m.image) corps.appendChild(cliche(`${images}${m.image}`, null, 'archive'));
    corps.appendChild(el('p', 'mission-texte', lire(m.commun)));
    const terrain = m.terrain === 'deux' || m.terrain === etat.role;
    corps.appendChild(el('p', 'mission-role', m.terrain === 'deux' ? T.deux : terrain ? T.terrain : T.cle));

    // Verrou (capteur) : seul l'agent de terrain doit le lever
    if (m.verrou && terrain && !etat.verrous[m.id] && !etat.valides[m.id]) {
      corps.appendChild(verrou(m));
      return;
    }

    const consigne = lire(m[etat.role]);
    // Schémas en caractères de dessin (symboles, tables) : police à chasse fixe pour garder l'alignement
    corps.appendChild(el('p', `mission-texte consigne${/[━─│┃]/.test(consigne) ? ' schema' : ''}`, consigne));
    if (m.faux && m.fauxPour === etat.role && !etat.valides[m.id]) corps.appendChild(journalUnique(messages(m.faux), `faux-${m.id}`).log);

    if (etat.valides[m.id]) return corps.appendChild(recompense(m));
    if (m.type === 'synchro') return corps.appendChild(synchro(m));
    if (m.type === 'choix') return corps.appendChild(choix(m));
    corps.appendChild(formulaire(m));
  }

  // ---------- Saisie d'un code ----------
  function formulaire(m, verifier) {
    const form = el('form', 'code');
    const champ = el('input', 'code-champ');
    Object.assign(champ, { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: false, placeholder: 'réponse' });
    champ.setAttribute('aria-label', 'Réponse');
    const envoyer = el('button', 'bouton code-envoyer', 'Valider');
    envoyer.type = 'submit';
    const retour = el('p', 'code-retour');
    retour.setAttribute('aria-live', 'polite');
    const jokerZone = el('div', 'joker');
    form.append(champ, envoyer, retour, jokerZone);

    const montrerJoker = () => {
      jokerZone.textContent = '';
      if (!m.joker) return;
      if (etat.jokers[m.id]) {
        jokerZone.append(el('p', 'joker-texte', lire(m.joker)));
      } else if ((etat.essais[m.id] || 0) >= 3) {
        jokerZone.appendChild(bouton('lien-console', T.joker, () => {
          etat.jokers[m.id] = true;
          sauver();
          montrerJoker();
        }));
      }
    };
    montrerJoker();

    // Mode test : passer une épreuve sans connaître la réponse
    if (test && !verifier) {
      form.appendChild(bouton('lien-console discret passer-test', 'passer l’épreuve (mode test)', () => {
        etat.valides[m.id] = true;
        sauver();
        rafraichir(m);
      }));
    }

    form.addEventListener('submit', async (evenement) => {
      evenement.preventDefault();
      const valeur = champ.value.trim();
      if (!valeur) return;
      envoyer.disabled = true;
      retour.textContent = 'vérification…';
      retour.className = 'code-retour';
      await attendre(calme ? 0 : 500);
      const bon = verifier ? verifier(valeur) : (m.empreintes || []).includes(await empreinte(m.id, valeur));
      envoyer.disabled = false;
      if (bon === true) {
        retour.textContent = 'conforme';
        retour.classList.add('bon');
        etat.valides[m.id] = true;
        sauver();
        await attendre(calme ? 0 : 600);
        return rafraichir(m);
      }
      etat.essais[m.id] = (etat.essais[m.id] || 0) + 1;
      sauver();
      retour.textContent = typeof bon === 'string' ? bon : 'non conforme';
      retour.classList.add('faux');
      form.classList.remove('refuse');
      void form.offsetWidth;
      form.classList.add('refuse');
      montrerJoker();
    });
    return form;
  }

  // ---------- Synchro : deux moitiés qui changent toutes les 30 s ----------
  const FENETRE = 30000;
  const moitie = (m, role, fenetre) => deuxChiffres(fnv(`${ep.id}:${m.id}:${role}:${fenetre}`) % 100);
  function synchro(m) {
    const bloc = el('div', 'synchro');
    const chiffres = el('div', 'synchro-chiffres');
    const jauge = el('div', 'synchro-jauge');
    const barreTemps = el('span');
    jauge.appendChild(barreTemps);
    bloc.append(el('p', 'eyebrow', `Ta moitié · ${surnom(etat.role)}`), chiffres, jauge);
    let vu = false;
    const tic = () => {
      if (vu && !bloc.isConnected) return clearInterval(minuteur);
      vu = true;
      const maintenant = Date.now();
      chiffres.textContent = moitie(m, etat.role, Math.floor(maintenant / FENETRE));
      barreTemps.style.width = `${100 - ((maintenant % FENETRE) / FENETRE) * 100}%`;
    };
    const minuteur = setInterval(tic, 250);
    tic();
    bloc.appendChild(formulaire(m, (valeur) => {
      const code = valeur.replace(/\D/g, '');
      const fenetre = Math.floor(Date.now() / FENETRE);
      // La fenêtre en cours et la précédente passent (horloges légèrement décalées)
      for (const f of [fenetre, fenetre - 1]) {
        const [a, b] = ROLES.map((r) => moitie(m, r, f));
        if (code === a + b) return true;
        if (code === b + a) return 'ordre refusé · qui vous a donné cette consigne ?';
      }
      return false;
    }));
    return bloc;
  }

  // ---------- Choix à l'aveugle ----------
  // Chacun choisit seul, puis indique le choix de l'autre : les deux téléphones arrivent à la même issue.
  function choix(m) {
    const bloc = el('div', 'choix');
    const options = m.options.map(lire);
    const memoire = etat.choix[m.id] || {};
    function etape() {
      bloc.textContent = '';
      if (memoire.moi == null) {
        bloc.appendChild(el('p', 'eyebrow', 'Ton choix, seul'));
        options.forEach((option, i) => bloc.appendChild(bouton('bouton choix-option', option, () => {
          if (!window.confirm(`Choix définitif : « ${option} » ?`)) return;
          memoire.moi = i;
          etat.choix[m.id] = memoire;
          sauver();
          etape();
        })));
        return;
      }
      bloc.appendChild(el('p', 'choix-moi', `Ton choix : ${options[memoire.moi]}`));
      if (memoire.autre == null) {
        bloc.appendChild(el('p', 'eyebrow', `Dites-vous vos choix. Celui de ${T.autre} :`));
        options.forEach((option, i) => bloc.appendChild(bouton('bouton choix-option', option, () => {
          memoire.autre = i;
          etat.choix[m.id] = memoire;
          etat.valides[m.id] = true;
          sauver();
          rafraichir(m);
        })));
        return;
      }
      bloc.appendChild(el('p', 'choix-moi', `Choix de ${T.autre} : ${options[memoire.autre]}`));
      const issue = issueChoix(m, memoire);
      if (issue) bloc.appendChild(journalUnique(messages(issue.messages), `issue-${m.id}`).log);
    }
    etape();
    return bloc;
  }

  // ---------- Duel : un vainqueur, déclaré sur les deux téléphones ----------
  function duel(m) {
    const d = m.duel;
    const bloc = el('section', 'duel');
    bloc.append(el('h3', 'duel-titre', `Duel · ${lire(d.titre)}`), el('p', 'mission-texte', lire(d.consigne)));
    const suite = el('div', 'duel-suite');
    bloc.appendChild(suite);

    function declarer() {
      suite.textContent = '';
      const gagnant = etat.duels[m.id];
      if (gagnant) {
        suite.appendChild(el('p', 'duel-resultat', gagnant === 'egal' ? 'Résultat : égalité' : `Vainqueur : ${surnom(gagnant)}`));
        suite.appendChild(bouton('lien-console discret', 'rectifier', () => {
          delete etat.duels[m.id];
          sauver();
          declarer();
        }));
        return;
      }
      suite.appendChild(el('p', 'eyebrow', 'Vainqueur du duel (à saisir sur les deux téléphones)'));
      const boutons = el('div', 'duel-boutons');
      [...ROLES, 'egal'].forEach((r) => boutons.appendChild(bouton('bouton choix-option', r === 'egal' ? 'Égalité' : surnom(r), () => {
        etat.duels[m.id] = r;
        sauver();
        rafraichir(m);
      })));
      suite.appendChild(boutons);
    }

    if (d.quiz && etat.quiz[m.id] == null) {
      suite.appendChild(bouton('bouton', 'Commencer l’examen', () => quiz(m, suite)));
    } else {
      if (d.quiz) bloc.insertBefore(el('p', 'duel-resultat', `Ton score : ${etat.quiz[m.id]} / ${d.quiz.length}. Comparez vos scores.`), suite);
      declarer();
    }
    return bloc;
  }

  // Questions minutées (10 s), une seule tentative
  function quiz(m, cible) {
    const questions = m.duel.quiz;
    let score = 0;
    let i = 0;
    const poser = () => {
      cible.textContent = '';
      if (i >= questions.length) {
        etat.quiz[m.id] = score;
        sauver();
        return rafraichir(m);
      }
      const q = questions[i];
      const bonne = Number(lire(q.bonne));
      const temps = el('div', 'synchro-jauge');
      const reste = el('span');
      temps.appendChild(reste);
      cible.append(el('p', 'eyebrow', `Question ${i + 1} / ${questions.length}`), el('p', 'mission-texte', lire(q.q)), temps);
      let fini = false;
      const repondre = (choixFait) => {
        if (fini) return;
        fini = true;
        if (choixFait === bonne) score += 1;
        i += 1;
        setTimeout(poser, 300);
      };
      q.options.map(lire).forEach((option, k) => cible.appendChild(bouton('bouton choix-option', option, () => repondre(k))));
      const debut = Date.now();
      const minuteur = setInterval(() => {
        const part = 1 - (Date.now() - debut) / 10000;
        reste.style.width = `${Math.max(0, part) * 100}%`;
        if (fini) clearInterval(minuteur);
        else if (part <= 0) {
          clearInterval(minuteur);
          repondre(-1);
        }
      }, 100);
    };
    // Quitter la page pendant l'examen revient à rendre copie blanche
    etat.quiz[m.id] = 0;
    sauver();
    poser();
  }

  // ---------- Après validation ----------
  function recompense(m) {
    const bloc = el('div', 'recompense');
    bloc.appendChild(el('span', 'tampon valide', T.valide));
    if (m.type === 'choix') bloc.appendChild(choix(m));
    if (m.piece) {
      const mot = el('p', 'piece');
      mot.append(`${T.piece} : `, el('strong', null, `« ${lire(m.piece)} »`));
      bloc.appendChild(mot);
    }
    if (m.pieceTexte) bloc.appendChild(el('p', 'piece', lire(m.pieceTexte)));
    if (m.dossier) {
      const doc = el('div', 'doc');
      doc.append(el('h3', null, T.note), el('p', null, lire(m.dossier)));
      bloc.appendChild(doc);
    }
    bloc.appendChild(souvenir(m));
    const suite = [...messages(m.apres && m.apres.commun), ...messages(m.apres && m.apres[etat.role])];
    if (suite.length) {
      const { log, jouer } = journalUnique(suite, `apres-${m.id}`);
      bloc.append(log, bouton('lien-console', 'relire', () => jouer(false)));
    }
    if (m.duel) bloc.appendChild(duel(m));
    if (m.verdict) bloc.appendChild(verdict(m));
    return bloc;
  }

  // Photo souvenir de l'épreuve, jointe au dossier (prise ou remplacée à tout moment)
  function souvenir(m) {
    const bloc = el('div', 'souvenir');
    const fichier = champPhoto('environment', async (donnees) => {
      etat.photos[m.id] = donnees;
      sauver();
      bloc.replaceWith(souvenir(m));
    });
    if (etat.photos[m.id]) bloc.appendChild(cliche(etat.photos[m.id], `pièce jointe · ${m.lieu}`, maniere(m)));
    bloc.append(fichier, bouton('lien-console', etat.photos[m.id] ? 'remplacer la photo' : 'joindre une photo souvenir au dossier', () => fichier.click()));
    return bloc;
  }

  // ---------- Verdict : croisement des registres, départage, certificat ----------
  function verdict(m) {
    const v = m.verdict;
    const bloc = el('section', 'verdict');
    bloc.appendChild(el('h3', 'duel-titre', 'Croisement des registres'));

    if (!etat.verdict.croise) {
      bloc.appendChild(el('p', 'mission-texte', lire(v.consigne)));
      const code = el('p', 'registre-code');
      code.append('Ton code de registre : ', el('strong', null, codeRegistre()));
      bloc.appendChild(code);
      bloc.appendChild(formulaire({ id: `${m.id}-registre` }, (valeur) => {
        if (valeur.replace(/\D/g, '') === codeRegistre()) {
          etat.verdict.croise = true;
          sauver();
          setTimeout(() => rafraichir(m), 50);
          return 'registres concordants';
        }
        return lire(v.discordance);
      }));
      bloc.appendChild(detailRegistre());
      return bloc;
    }

    const s = scores();
    const [a, b] = ROLES;
    if (s[a] === s[b] && !etat.verdict.departage) {
      bloc.append(el('h3', 'duel-titre', lire(v.departage.titre)), el('p', 'mission-texte', lire(v.departage.consigne)));
      const boutons = el('div', 'duel-boutons');
      ROLES.forEach((r) => boutons.appendChild(bouton('bouton choix-option', surnom(r), () => {
        if (!window.confirm(`Vainqueur du départage : ${surnom(r)} ?`)) return;
        etat.verdict.departage = r;
        sauver();
        rafraichir(m);
      })));
      bloc.appendChild(boutons);
      return bloc;
    }

    const gagnant = s[a] > s[b] ? a : b;
    const perdant = autreRole(gagnant);
    if (!etat.verdict.rendu) {
      etat.verdict.rendu = true;
      sauver();
    }
    bloc.appendChild(journalUnique(messages(v.annonce), `verdict-${m.id}`).log);
    const annonce = el('div', 'verdict-annonce');
    annonce.append(el('p', 'eyebrow', 'Paul n°1'), el('p', 'verdict-nom', nom(gagnant)), el('p', 'verdict-score', `${s[gagnant]} points contre ${s[perdant]}. ${nom(perdant)} devient Paul n°2.`));
    bloc.appendChild(annonce);
    bloc.appendChild(cliche(`${images}laozi.jpg`, 'Zhang Lu, Laozi chevauchant un buffle (XVIe s.)', 'agrafe'));
    const image = certificat(lire(v.certificat), gagnant, perdant, s);
    bloc.appendChild(image);
    const lien = el('a', 'bouton', 'Enregistrer le certificat');
    lien.href = image.src;
    image.addEventListener('load', () => { lien.href = image.src; }); // after the portrait is stapled
    lien.download = 'certificat-paul-n1.png';
    bloc.appendChild(lien);
    return bloc;
  }

  // Registre détaillé, pour retrouver une ligne qui ne concorde pas
  function detailRegistre() {
    const bloc = el('details', 'doc registre-detail');
    bloc.appendChild(el('summary', null, 'Voir mon registre'));
    const liste = el('ul');
    ep.missions.forEach((x) => {
      if (x.duel) {
        const g = etat.duels[x.id];
        liste.appendChild(el('li', null, `${numero(x)} · ${lire(x.duel.titre)} : ${g ? (g === 'egal' ? 'égalité' : surnom(g)) : 'non saisi'}`));
      }
      if (x.type === 'choix') {
        const c = etat.choix[x.id] || {};
        const opt = x.options.map(lire);
        liste.appendChild(el('li', null, `${numero(x)} · ${x.lieu} : toi « ${c.moi != null ? opt[c.moi] : '?'} », l’autre « ${c.autre != null ? opt[c.autre] : '?'} »`));
      }
    });
    bloc.append(liste, el('p', 'note', 'Pour rectifier un duel, rouvre l’épreuve concernée et touche « rectifier ».'));
    return bloc;
  }

  // Certificat dessiné sur un canvas, à enregistrer en image
  function certificat(phrase, gagnant, perdant, s) {
    const L = 1080;
    const H = 1350;
    const toile = document.createElement('canvas');
    toile.width = L;
    toile.height = H;
    const c = toile.getContext('2d');
    const encre = '#1f1c17';
    const rouge = '#b0241b';
    const police = (taille, gras) => `${gras ? 'bold ' : ''}${taille}px "Courier New", Courier, monospace`;
    c.fillStyle = '#efe8d8';
    c.fillRect(0, 0, L, H);
    c.strokeStyle = encre;
    c.lineWidth = 4;
    c.strokeRect(40, 40, L - 80, H - 80);
    c.lineWidth = 1.5;
    c.strokeRect(56, 56, L - 112, H - 112);
    c.textAlign = 'center';
    c.fillStyle = encre;
    c.font = police(30, true);
    c.fillText('BUREAU CENTRAL DES HOMONYMES', L / 2, 150);
    c.font = police(30);
    c.fillText('同名管理局', L / 2, 195);
    c.fillRect(200, 230, L - 400, 2);
    c.font = police(46, true);
    c.fillText('CERTIFICAT', L / 2, 320);
    c.font = police(28);
    c.fillText('D’ATTRIBUTION DE RANG', L / 2, 362);
    // Phrase officielle, coupée en lignes
    let y = 470;
    let ligne = '';
    phrase.split(' ').forEach((mot) => {
      if (c.measureText(`${ligne} ${mot}`).width > L - 260) {
        c.fillText(ligne.trim(), L / 2, y);
        y += 42;
        ligne = '';
      }
      ligne += ` ${mot}`;
    });
    c.fillText(ligne.trim(), L / 2, y);
    c.font = police(56, true);
    c.fillText(nom(gagnant).toUpperCase(), L / 2, y + 120);
    c.font = police(30);
    c.fillText('est officiellement', L / 2, y + 190);
    c.fillStyle = rouge;
    c.font = police(110, true);
    c.fillText('PAUL N°1', L / 2, y + 320);
    c.fillStyle = encre;
    c.font = police(26);
    c.fillText(`${nom(perdant)} est Paul n°2.`, L / 2, y + 400);
    c.fillText(`Registre de Paulitude : ${s[gagnant]} contre ${s[perdant]}.`, L / 2, y + 442);
    c.textAlign = 'left';
    c.font = police(24);
    c.fillText('Chongqing, novembre 2026', 110, H - 170);
    c.fillText('Inspecteur Zhang Bǎoluó', 110, H - 130);
    c.fillText('matricule 0001', 110, H - 98);
    // Tampon rouge, légèrement de travers
    c.save();
    c.translate(L - 250, H - 190);
    c.rotate(-0.18);
    c.strokeStyle = rouge;
    c.fillStyle = rouge;
    c.globalAlpha = 0.85;
    c.lineWidth = 6;
    c.beginPath();
    c.arc(0, 0, 110, 0, Math.PI * 2);
    c.stroke();
    c.lineWidth = 2;
    c.beginPath();
    c.arc(0, 0, 92, 0, Math.PI * 2);
    c.stroke();
    c.textAlign = 'center';
    c.font = police(64, true);
    c.fillText('第一', 0, 22);
    c.font = police(20, true);
    c.fillText('CERTIFIÉ', 0, -50);
    c.fillText('CONFORME', 0, 72);
    c.restore();
    const image = el('img', 'certificat');
    image.alt = `Certificat : ${nom(gagnant)} est officiellement Paul n°1`;
    image.src = toile.toDataURL('image/png');
    // Photo d'identité du gagnant, agrafée en haut à gauche
    if (etat.portraits[gagnant]) {
      const portrait = new Image();
      portrait.onload = () => {
        const l = 140;
        const h = Math.round(l * 1.28);
        const cote = Math.min(portrait.width, portrait.height / 1.28);
        c.save();
        c.translate(80, 70);
        c.rotate(-0.06);
        c.shadowColor = 'rgba(60, 40, 10, 0.35)';
        c.shadowBlur = 14;
        c.shadowOffsetY = 4;
        c.fillStyle = '#fbf8f0';
        c.fillRect(0, 0, l + 20, h + 20);
        c.shadowColor = 'transparent';
        c.filter = 'grayscale(1) contrast(1.15)';
        c.drawImage(portrait, (portrait.width - cote) / 2, (portrait.height - cote * 1.28) / 2, cote, cote * 1.28, 10, 10, l, h);
        c.filter = 'none';
        // Agrafe
        c.fillStyle = '#8d8f93';
        c.fillRect(l / 2 - 20, -4, 70, 7);
        c.restore();
        image.src = toile.toDataURL('image/png');
      };
      portrait.src = etat.portraits[gagnant];
    }
    return image;
  }


  // ---------- Verrous à capteur ----------
  function verrou(m) {
    const v = m.verrou;
    const bloc = el('div', `verrou verrou-${v.type}`);
    const etatCapteur = el('p', 'verrou-etat');
    etatCapteur.setAttribute('aria-live', 'polite');
    const lever = () => {
      etat.verrous[m.id] = true;
      sauver();
      etatCapteur.textContent = 'accès accordé';
      etatCapteur.classList.add('bon');
      setTimeout(() => rafraichir(m), calme ? 0 : 800);
    };
    // Un capteur en panne ne doit jamais bloquer la partie
    const contourner = bouton('lien-console discret', T.contourner, () => {
      if (window.confirm('Passer outre le capteur ? Le Bureau le notera dans ton dossier.')) lever();
    });

    if (v.type === 'gps') {
      bloc.append(el('p', 'mission-texte', `Ce formulaire ne s’ouvre qu’à proximité de ${lire(v.nom)}. Active la localisation une fois sur place.`));
      const signal = el('div', 'signal');
      const jauge = el('span');
      signal.appendChild(jauge);
      const activer = bouton('bouton', 'Me localiser', () => {
        if (!navigator.geolocation) { etatCapteur.textContent = 'localisation indisponible sur ce téléphone'; return; }
        activer.disabled = true;
        etatCapteur.textContent = 'localisation…';
        const suivi = navigator.geolocation.watchPosition((position) => {
          const d = distance(position.coords.latitude, position.coords.longitude, v.lat, v.lon);
          jauge.style.width = `${Math.round(Math.max(0.03, Math.min(1, v.rayon / Math.max(d, 1))) * 100)}%`;
          etatCapteur.textContent = d < 1000 ? `distance · ${Math.round(d)} m` : `distance · ${(d / 1000).toFixed(1).replace('.', ',')} km`;
          if (d <= v.rayon) {
            navigator.geolocation.clearWatch(suivi);
            lever();
          }
        }, () => {
          activer.disabled = false;
          etatCapteur.textContent = 'localisation refusée ou sans signal';
        }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 30000 });
      });
      bloc.append(activer, signal, etatCapteur, contourner);
    }

    if (v.type === 'boussole') {
      const autre = T.autre.charAt(0).toUpperCase() + T.autre.slice(1);
      bloc.append(el('p', 'mission-texte', `Ce formulaire ne s’ouvre que dans une direction. ${autre} sait laquelle. Tiens ton téléphone à plat, haut de l’écran devant toi, et tourne lentement.`));
      const cadran = el('div', 'cadran');
      const aiguille = el('span', 'cadran-aiguille');
      cadran.appendChild(aiguille);
      const signal = el('div', 'signal');
      const jauge = el('span');
      signal.appendChild(jauge);
      let depuis = 0;
      let recu = false;
      const lecture = (evenement) => {
        let cap = null;
        if (typeof evenement.webkitCompassHeading === 'number') cap = evenement.webkitCompassHeading;
        else if (evenement.absolute && typeof evenement.alpha === 'number') cap = (360 - evenement.alpha) % 360;
        if (cap == null) return;
        recu = true;
        const ecart = ((v.cap - cap + 540) % 360) - 180;
        aiguille.style.transform = `rotate(${ecart}deg)`;
        const force = Math.max(0, 1 - Math.abs(ecart) / 90);
        jauge.style.width = `${Math.round(force * 100)}%`;
        if (Math.abs(ecart) <= v.tolerance) {
          etatCapteur.textContent = 'alignement… ne bouge plus';
          if (!depuis) depuis = Date.now();
          if (Date.now() - depuis > 1500) {
            window.removeEventListener('deviceorientationabsolute', lecture);
            window.removeEventListener('deviceorientation', lecture);
            lever();
          }
        } else {
          depuis = 0;
          etatCapteur.textContent = `alignement · ${Math.round(force * 100)} %`;
        }
      };
      const activer = bouton('bouton', 'Activer la boussole', async () => {
        try {
          if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            if (await DeviceOrientationEvent.requestPermission() !== 'granted') throw new Error('refus');
          }
        } catch {
          etatCapteur.textContent = 'boussole refusée';
          return;
        }
        activer.disabled = true;
        etatCapteur.textContent = 'calibrage…';
        window.addEventListener('deviceorientationabsolute', lecture);
        window.addEventListener('deviceorientation', lecture);
        setTimeout(() => { if (!recu) etatCapteur.textContent = 'aucune boussole détectée sur ce téléphone'; }, 3000);
      });
      bloc.append(activer, cadran, signal, etatCapteur, contourner);
    }

    if (v.type === 'photo') {
      bloc.append(el('p', 'mission-texte', lire(v.consigne)));
      const fichier = el('input');
      Object.assign(fichier, { type: 'file', accept: 'image/*', hidden: true });
      fichier.setAttribute('capture', 'environment');
      fichier.addEventListener('change', async () => {
        const image = fichier.files && fichier.files[0];
        if (!image) return;
        etatCapteur.textContent = 'développement…';
        try {
          etat.photos[m.id] = await reduire(image, 720);
        } catch {
          etatCapteur.textContent = 'photo illisible, recommence';
          return;
        }
        lever();
      });
      bloc.append(fichier, bouton('bouton', 'Prendre la photo', () => fichier.click()), etatCapteur);
    }
    return bloc;
  }

  function distance(lat1, lon1, lat2, lon2) {
    const rad = Math.PI / 180;
    const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2
      + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
    return 2 * 6371000 * Math.asin(Math.sqrt(a));
  }

  // Réduit la photo pour qu'elle tienne dans localStorage (quelques dizaines de Ko)
  function reduire(fichier, cote) {
    return new Promise((ok, ko) => {
      const lecteur = new FileReader();
      lecteur.onerror = ko;
      lecteur.onload = () => {
        const image = new Image();
        image.onerror = ko;
        image.onload = () => {
          const echelle = Math.min(1, cote / Math.max(image.width, image.height));
          const toile = document.createElement('canvas');
          toile.width = Math.round(image.width * echelle);
          toile.height = Math.round(image.height * echelle);
          toile.getContext('2d').drawImage(image, 0, 0, toile.width, toile.height);
          ok(toile.toDataURL('image/jpeg', 0.7));
        };
        image.src = lecteur.result;
      };
      lecteur.readAsDataURL(fichier);
    });
  }

  // ---------- Dossier du joueur : mots récupérés et pièces à conviction ----------
  function dossier() {
    const bloc = el('section', 'dossier');
    const mots = ep.missions.filter((m) => m.piece && etat.valides[m.id]).map((m) => lire(m.piece));
    const ligne = el('p', 'dossier-mots');
    if (mots.length) {
      // Ordre alphabétique : l'ordre de la phrase reste à retrouver
      mots.sort((a, b) => a.localeCompare(b, 'fr')).forEach((mot) => ligne.appendChild(el('span', 'dossier-mot', mot)));
    } else {
      ligne.appendChild(el('span', 'note', 'aucun pour l’instant : le premier arrive avec l’épreuve 00'));
    }
    const mots_ = [el('p', 'eyebrow', T.mots), el('p', 'note mots-aide', 'Chaque épreuve validée vous remet un mot du règlement du Bureau. Gardez-les : ils serviront le dernier soir.'), ligne];
    const fiches = el('div', 'douane-liste');
    fiches.appendChild(fiche(etat.role, true));
    const autre = el('details', 'fiche-autre');
    autre.append(el('summary', null, `Fiche de ${nom(autreRole(etat.role))}`));
    autre.addEventListener('toggle', () => { if (autre.open && autre.childElementCount === 1) autre.appendChild(fiche(autreRole(etat.role), true)); });
    fiches.appendChild(autre);
    bloc.appendChild(fiches);
    bloc.append(...mots_);
    const album = ep.missions.filter((m) => etat.photos[m.id]);
    if (album.length) {
      bloc.appendChild(el('p', 'eyebrow', 'Pièces jointes'));
      const planche = el('div', 'album');
      album.forEach((m) => planche.appendChild(cliche(etat.photos[m.id], `${numero(m)} · ${m.lieu}`, maniere(m))));
      bloc.appendChild(planche);
    }
    return bloc;
  }

  function pied() {
    const bloc = el('div', 'jeu-pied');
    bloc.append(
      bouton('lien-console discret', `changer de dossier (actuel : ${nom(etat.role)})`, () => {
        if (!window.confirm('Changer de dossier ? À faire seulement si vous vous êtes trompés de téléphone.')) return;
        etat.role = autreRole(etat.role);
        sauver();
        afficher();
      }),
      bouton('lien-console discret', 'effacer la progression', () => {
        if (!window.confirm('Effacer toute la progression de ce téléphone ?')) return;
        etat = vide();
        sauver();
        afficher();
      }),
    );
    return bloc;
  }

  afficher();
})();
