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
  const barreScore = el('span', 'barre-score');
  barre.append(el('span', 'barre-titre', ep.titre), barreScore);
  document.body.insertBefore(barre, racine);
  const zone = el('div', 'jeu-zone');
  racine.appendChild(zone);

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
    document.body.insertBefore(bandeau, racine);
  }

  // ---------- Deux vues : le formulaire du jour (par défaut) et les archives, discrètes ----------
  let vue = 'jour';
  try { vue = sessionStorage.getItem(`${CLE_SAUVEGARDE}-vue`) || 'jour'; } catch { /* private mode */ }
  function changerVue(id) {
    vue = id;
    try { sessionStorage.setItem(`${CLE_SAUVEGARDE}-vue`, id); } catch { /* private mode */ }
    afficher();
    window.scrollTo(0, 0);
  }

  function afficher() {
    zone.textContent = '';
    document.body.classList.toggle('en-jeu', !!etat.role);
    if (!etat.role) {
      barreScore.textContent = '';
      return choixRole();
    }
    const s = scores();
    const moi = etat.role;
    const autre = autreRole(moi);
    barreScore.textContent = `${surnom(moi)} ${s[moi]} – ${s[autre]} ${surnom(autre)}`;
    zone.appendChild(vue === 'archives' ? vueArchives() : vueJour());
  }

  // Nouveau rendu en gardant la position ; une épreuve qui vient d'être classée remonte en haut
  function rafraichir(m) {
    const y = window.scrollY;
    afficher();
    window.scrollTo(0, m && vue === 'jour' && terminee(m) ? 0 : y);
  }

  const jouables = ep.missions.filter((m) => m.date);
  // Une épreuve est terminée quand le formulaire est validé et le duel tranché
  const terminee = (m) => etat.valides[m.id] && (!m.duel || etat.duels[m.id]) && (m.type !== 'final' || etat.verdict.rendu);
  const dateLongue = (date) => new Date(`${date}T12:00:00Z`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

  // ---------- Le jour : la convocation, puis une seule épreuve ----------
  function vueJour() {
    const bloc = el('section', 'vue vue-jour');
    const date = aujourdhui();
    const jour = Math.round((Date.parse(date) - Date.parse(jouables[0].date)) / 86400000) + 2; // jour 1 = départ de Paris
    bloc.appendChild(el('p', 'jour-date', jour >= 1 && jour <= 13 ? `${dateLongue(date)} · jour ${jour} sur 13` : dateLongue(date)));
    // La convocation reste dépliée tant que le premier formulaire n'est pas validé
    bloc.appendChild(convocation(!etat.valides[ep.missions[0].id]));
    if (!etat.portraits[etat.role]) bloc.appendChild(pieceManquante());

    // L'épreuve du jour : la plus ancienne ouverte et pas encore classée. Une fois classée, on ne revient pas dessus.
    const courante = ep.missions.find((m) => ouverte(m) && !terminee(m));
    const finale = ep.missions.find((m) => m.verdict);
    if (courante) bloc.appendChild(feuille(courante));
    else if (finale && terminee(finale)) bloc.appendChild(feuille(finale)); // le verdict et le certificat restent affichés
    else {
      const classee = [...ep.missions].reverse().find((m) => terminee(m) && (!m.date || m.date === date));
      if (classee) bloc.appendChild(resumeClasse(classee));
      bloc.appendChild(repos());
    }
    bloc.appendChild(bouton('lien-archives', 'Mon dossier · carte · formulaires classés', () => changerVue('archives')));
    return bloc;
  }

  // Lettre d'ouverture : tout l'enjeu du jeu, signée de l'inspecteur
  function convocation(deplie) {
    const c = ep.convocation;
    const lettre = el('article', 'convocation');
    const entete = el('header', 'lettre-entete');
    entete.append(el('span', 'lettre-zh', '同名管理局'), el('span', 'lettre-service', 'Bureau central des homonymes'), el('span', 'lettre-ref', lire(c.reference)));
    lettre.append(entete, el('p', 'lettre-objet', lire(c.objet)));
    c.paragraphes.map(lire).forEach((texte) => lettre.appendChild(el('p', /^\d\. /.test(texte) ? 'lettre-point' : null, texte)));
    const signature = el('footer', 'lettre-signature');
    signature.append(el('span', null, lire(c.signature)), el('span', 'tampon rond', '同名\n0001'));
    lettre.appendChild(signature);
    if (deplie) return lettre;
    const pli = el('details', 'convocation-pli');
    pli.append(el('summary', null, 'Relire la convocation'), lettre);
    return pli;
  }

  // Feuille de l'épreuve du jour
  function feuille(m) {
    const bloc = el('article', 'feuille');
    bloc.dataset.id = m.id;
    bloc.appendChild(enteteFeuille(m));
    if (m.date && m.date < aujourdhui() && !etat.valides[m.id]) bloc.appendChild(el('p', 'feuille-retard', 'En retard : à classer avant le formulaire suivant.'));
    const corps = el('div', 'feuille-corps');
    bloc.appendChild(corps);
    remplir(m, corps);
    return bloc;
  }
  function enteteFeuille(m) {
    const tete = el('header', 'feuille-tete');
    const ligne = el('p', 'feuille-ref');
    ligne.append(el('span', null, `Formulaire n° ${numero(m)}`), el('span', null, m.date ? dateLongue(m.date) : 'avant le départ'));
    tete.append(ligne, el('h2', 'feuille-lieu', m.lieu), el('p', 'feuille-ville', m.ville));
    return tete;
  }

  // Épreuve classée du jour : un simple rappel, sans retour possible
  function resumeClasse(m) {
    const bloc = el('article', 'feuille classee');
    bloc.append(enteteFeuille(m), el('span', 'tampon', 'Classé'));
    const liste = el('dl', 'classee-lignes');
    const ligne = (cle, valeur) => liste.append(el('dt', null, cle), el('dd', null, valeur));
    if (m.piece) ligne(T.piece, `« ${lire(m.piece)} »`);
    if (m.duel && etat.duels[m.id]) ligne(lire(m.duel.titre), etat.duels[m.id] === 'egal' ? 'égalité' : `gagné par ${surnom(etat.duels[m.id])}`);
    const issue = m.type === 'choix' && issueChoix(m, etat.choix[m.id]);
    if (issue) ligne('Points', `toi ${signe(issue.moi)}, ${T.autre} ${signe(issue.autre)}`);
    bloc.appendChild(liste);
    return bloc;
  }
  const signe = (n) => `${n >= 0 ? '+' : ''}${n}`;

  // Entre deux épreuves : la suivante et son compte à rebours
  function repos() {
    const bloc = el('div', 'repos');
    const prochaine = jouables.find((m) => !ouverte(m));
    if (!prochaine) return bloc;
    bloc.append(el('p', 'repos-titre', 'Prochain formulaire'), el('p', 'repos-lieu', `${prochaine.ville}, ${dateLongue(prochaine.date)}`), compteARebours(prochaine));
    bloc.appendChild(bouton('lien-console', T.forcer, () => {
      if (!window.confirm('Ouvrir le formulaire suivant en avance ? À faire seulement si le guide a changé l’ordre des visites.')) return;
      etat.forces[prochaine.id] = true;
      sauver();
      afficher();
    }));
    return bloc;
  }

  function compteARebours(prochaine) {
    const ligne = el('p', 'repos-compte');
    const maj = () => {
      const reste = Math.max(0, debutJour(prochaine.date) - Date.now());
      const h = Math.floor(reste / 3600000);
      const j = Math.floor(h / 24);
      const mn = Math.floor((reste % 3600000) / 60000);
      ligne.textContent = `ouverture dans ${j ? `${j} j ` : ''}${deuxChiffres(h % 24)} h ${deuxChiffres(mn)}`;
      if (reste === 0 && !dateForcee) afficher();
    };
    maj();
    const minuteur = setInterval(() => { if (!ligne.isConnected) clearInterval(minuteur); else maj(); }, 30000);
    return ligne;
  }

  // ---------- Archives : dossier, carte et formulaires classés ----------
  function vueArchives() {
    const bloc = el('section', 'vue vue-archives');
    bloc.appendChild(bouton('lien-retour', '← Formulaire du jour', () => changerVue('jour')));

    bloc.appendChild(el('h2', 'archives-titre', 'Mon dossier'));
    bloc.appendChild(fiche(etat.role, true));
    const autre = el('details', 'pli');
    autre.appendChild(el('summary', null, `Fiche de ${nom(autreRole(etat.role))}`));
    autre.addEventListener('toggle', () => { if (autre.open && autre.childElementCount === 1) autre.appendChild(fiche(autreRole(etat.role), true)); });
    bloc.appendChild(autre);

    bloc.appendChild(el('h2', 'archives-titre', T.mots));
    const mots = ep.missions.filter((m) => m.piece && etat.valides[m.id]).map((m) => lire(m.piece));
    bloc.appendChild(listeMots(mots));

    bloc.append(el('h2', 'archives-titre', 'Carnet de route'), carte());

    bloc.appendChild(el('h2', 'archives-titre', 'Formulaires classés'));
    const classes = ep.missions.filter((m) => etat.valides[m.id]);
    if (!classes.length) bloc.appendChild(el('p', 'note', 'Aucun pour l’instant.'));
    const liste = el('div', 'historique');
    classes.forEach((m) => liste.appendChild(histoire(m)));
    bloc.appendChild(liste);

    const album = ep.missions.filter((m) => etat.photos[m.id]);
    if (album.length) {
      bloc.appendChild(el('h2', 'archives-titre', 'Pièces jointes'));
      const planche = el('div', 'album');
      album.forEach((m) => planche.appendChild(cliche(etat.photos[m.id], `${numero(m)} · ${m.lieu}`, maniere(m))));
      bloc.appendChild(planche);
    }
    bloc.appendChild(pied());
    return bloc;
  }

  // Mots du règlement, en ordre alphabétique : l'ordre de la phrase reste à retrouver
  function listeMots(mots) {
    const ligne = el('p', 'mots');
    if (!mots.length) ligne.appendChild(el('span', 'note', 'rien pour l’instant'));
    [...mots].sort((a, b) => a.localeCompare(b, 'fr')).forEach((mot) => ligne.appendChild(el('span', 'mot', mot)));
    return ligne;
  }

  // Un formulaire classé : ce qu'il a rapporté, et le duel (rectifiable)
  function histoire(m) {
    const bloc = el('details', 'pli histoire');
    const resume = el('summary');
    resume.append(el('span', 'histoire-num', numero(m)), el('span', 'histoire-lieu', m.lieu), el('span', 'histoire-date', m.date ? dateCourte(m.date) : 'Paris'));
    bloc.appendChild(resume);
    bloc.addEventListener('toggle', () => {
      if (!bloc.open || bloc.childElementCount > 1) return;
      const corps = el('div', 'histoire-corps');
      if (m.piece) corps.appendChild(el('p', 'piece', `${T.piece} : « ${lire(m.piece)} »`));
      if (m.pieceTexte) corps.appendChild(el('p', 'piece', lire(m.pieceTexte)));
      if (m.dossier) corps.appendChild(el('p', 'note-bureau', lire(m.dossier)));
      const issue = m.type === 'choix' && issueChoix(m, etat.choix[m.id]);
      if (issue) corps.appendChild(el('p', null, `Points : toi ${signe(issue.moi)}, ${T.autre} ${signe(issue.autre)}`));
      if (m.duel) corps.appendChild(duel(m));
      corps.appendChild(souvenir(m));
      bloc.appendChild(corps);
    });
    return bloc;
  }

  // Carte : le tracé avance d'étape en étape, puis le carnet de route
  const etapes = ep.etapes || [];
  const atteinte = (e) => e.missions.some((id) => {
    const m = ep.missions.find((x) => x.id === id);
    return m && (etat.valides[id] || (m.date && m.date <= aujourdhui()));
  });

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

  // ---------- Choix du dossier (rôle) ----------
  function choixRole() {
    const bloc = el('section', 'roles');
    bloc.append(el('h1', 'roles-titre', ep.titre), el('p', 'roles-texte', T.choixRole));
    ROLES.forEach((role) => {
      const carteRole = el('div', 'role');
      carteRole.append(fiche(role, false), bouton('bouton', T.choixRoleBouton, () => {
        if (!window.confirm(`Confirmer : tu es ${nom(role)} ?`)) return;
        etat.role = role;
        sauver();
        vue = 'jour';
        afficher();
        window.scrollTo(0, 0);
      }));
      bloc.appendChild(carteRole);
    });
    zone.appendChild(bloc);
  }

  // ---------- Fiche de contrôle à l'ancienne : cases numérotées, photo agrafée, tampon ----------
  // Lignes de la fiche : « Libellé · 中文 : valeur »
  function champ(ligne) {
    const texte = lire(ligne);
    const coupure = texte.indexOf(' : ');
    const libelle = coupure < 0 ? '' : texte.slice(0, coupure);
    const [fr, zh] = libelle.split(' · ');
    return { fr: fr || '', zh: zh || '', valeur: coupure < 0 ? texte : texte.slice(coupure + 3) };
  }
  function caseFiche(c, n) {
    const bloc = el('div', `fd-case${/^Profession/.test(c.fr) ? ' demi' : ''}`);
    const libelle = el('span', 'fd-libelle');
    libelle.append(el('b', null, String(n)), ` ${c.fr}`);
    if (c.zh) libelle.appendChild(el('span', 'fd-zh', c.zh));
    bloc.append(libelle, el('span', 'fd-valeur', c.valeur));
    return bloc;
  }
  function fiche(role, modifiable) {
    const r = ep.roles[role];
    const carteFiche = el('article', 'fiche-douane');
    const tete = el('header', 'fd-tete');
    const gauche = el('div');
    gauche.append(el('span', 'fd-pays', '中华人民共和国 · 同名管理局'), el('span', 'fd-org', 'Bureau central des homonymes'), el('span', 'fd-titre', 'Fiche de contrôle'));
    const droite = el('div', 'fd-ref');
    droite.append(el('span', null, 'Modèle H-26'), el('span', 'fd-numero', `N° ${lire(r.numero) || role}`));
    tete.append(gauche, droite);

    const champs = (r.fiche || []).map(champ);
    const identite = el('div', 'fd-identite');
    const photo = el('div', 'fd-photo');
    if (etat.portraits[role]) photo.appendChild(cliche(etat.portraits[role], null, 'agrafe identite'));
    else photo.appendChild(el('span', 'fd-photo-vide', 'photo\n35 × 45'));
    if (modifiable) {
      const fichier = champPhoto(role === etat.role ? 'user' : 'environment', async (donnees) => {
        etat.portraits[role] = donnees;
        sauver();
        carteFiche.replaceWith(fiche(role, true));
      });
      const libelle = etat.portraits[role] ? 'changer' : role === etat.role ? 'agrafer ta photo' : 'photographier';
      photo.append(fichier, bouton('fd-photo-bouton', libelle, () => fichier.click()));
    }
    const premiers = el('div', 'fd-cases');
    champs.slice(0, 3).forEach((c, i) => premiers.appendChild(caseFiche(c, i + 1)));
    identite.append(photo, premiers);
    const suite = el('div', 'fd-cases fd-suite');
    champs.slice(3).forEach((c, i) => suite.appendChild(caseFiche(c, i + 4)));

    const pied = el('footer', 'fd-pied');
    const s = scores();
    const rang = etat.verdict.rendu ? (s[role] >= s[autreRole(role)] ? 'Paul n°1' : 'Paul n°2') : 'En instance';
    pied.append(el('span', 'fd-visa', 'Visa de l’agent'), el('span', 'fd-signature', 'Zhang · 0001'), el('span', 'tampon', rang));
    carteFiche.append(tete, identite, suite, pied);
    return carteFiche;
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

  // ---------- Notes de service (messages du Bureau et de l'inspecteur) ----------
  function journal(liste) {
    const log = el('div', 'log');
    log.setAttribute('aria-live', 'polite');
    liste.forEach((message) => {
      const ligne = el('p', `log-ligne ${message.qui}`);
      ligne.append(el('span', 'log-prefixe', PREFIXES[message.qui] || ''), el('span', 'log-texte', message.texte));
      log.appendChild(ligne);
    });
    return { log };
  }
  function journalUnique(liste, cleLu) {
    etat.lus[cleLu] = true;
    sauver();
    return journal(liste);
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

  function remplir(m, corps) {
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

    if (m.type === 'final' && !etat.valides[m.id]) corps.appendChild(listeMots(ep.missions.filter((x) => x.piece && etat.valides[x.id]).map((x) => lire(x.piece))));
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
    bloc.append(el('p', 'eyebrow', 'Duel'), el('h3', 'duel-titre', lire(d.titre)), el('p', 'mission-texte', lire(d.consigne)));
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
      bloc.appendChild(journalUnique(suite, `apres-${m.id}`).log);
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
    bloc.append(liste, el('p', 'note', 'Pour rectifier un duel : Mon dossier, puis Formulaires classés.'));
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

