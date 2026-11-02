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
  const CLE_SAUVEGARDE = `locost-${ep.id}`;
  const vide = () => ({ role: null, valides: {}, essais: {}, jokers: {}, forces: {}, verrous: {}, choix: {}, photos: {}, lus: {}, duels: {}, quiz: {}, verdict: {} });
  let etat;
  try { etat = { ...vide(), ...JSON.parse(localStorage.getItem(CLE_SAUVEGARDE) || '{}') }; } catch { etat = vide(); }
  function sauver() {
    try { localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(etat)); } catch { /* quota or private mode: the game still works for this visit */ }
  }

  // ---------- Date du jour, heure de l'épisode (Pékin) ----------
  const locale = ['localhost', '127.0.0.1'].includes(location.hostname);
  const dateForcee = locale && new URLSearchParams(location.search).get('date');
  const decalage = (ep.fuseau || 0) * 3600000;
  const aujourdhui = () => dateForcee || new Date(Date.now() + decalage).toISOString().slice(0, 10);
  const debutJour = (date) => Date.parse(`${date}T00:00:00Z`) - decalage;
  const dateCourte = (date) => `${date.slice(8, 10)}.${date.slice(5, 7)}`;
  const ouverte = (m) => !m.date || m.date <= aujourdhui() || etat.forces[m.id];
  const numero = (m) => m.id.replace(/\D/g, '');
  const autreRole = (role) => ROLES.find((r) => r !== role);
  const nom = (role) => ep.roles[role].nom;
  const surnom = (role) => ep.roles[role].surnom || nom(role);

  // ---------- Squelette de la page ----------
  const barre = el('header', 'barre');
  const barreRole = el('span');
  barre.append(el('span', 'point', T.barre), barreRole);
  document.body.insertBefore(barre, racine);

  const tete = el('div', 'fiche-tete');
  const titre = el('h1', 'glitch', ep.titre);
  titre.dataset.text = ep.titre;
  const intro = el('p', 'terminal');
  intro.dataset.lines = T.intro.join('|');
  tete.append(el('div', 'eyebrow', T.eyebrow), titre, intro);
  const zone = el('div', 'jeu-zone');
  racine.append(tete, zone);

  function afficher() {
    zone.textContent = '';
    barreRole.textContent = etat.role ? nom(etat.role) : `EP${ep.numero}`;
    if (!etat.role) return choixRole();
    zone.append(transmission(T.transmission, messages(ep.transmission), 'intro'), progression(), listeMissions(), dossier(), pied());
  }

  // ---------- Choix du dossier (rôle) ----------
  function choixRole() {
    const bloc = el('section', 'roles');
    bloc.appendChild(el('p', 'roles-texte', T.choixRole));
    const choix = el('div', 'roles-choix');
    ROLES.forEach((role) => {
      const carte = el('article', 'fiche-candidat');
      carte.appendChild(el('h2', null, nom(role)));
      const liste = el('ul');
      (ep.roles[role].fiche || []).forEach((ligne) => liste.appendChild(el('li', null, lire(ligne))));
      carte.append(liste, bouton('bouton role', T.choixRoleBouton, () => {
        if (!window.confirm(`Confirmer : tu es ${nom(role)} ?`)) return;
        etat.role = role;
        sauver();
        afficher();
        window.scrollTo(0, 0);
      }));
      choix.appendChild(carte);
    });
    bloc.appendChild(choix);
    zone.appendChild(bloc);
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
  function transmission(titreBloc, liste, cleLu) {
    const bloc = el('details', 'rappel transmission');
    const resume = el('summary');
    resume.append(el('span', 'rappel-num', '>>'), el('span', 'rappel-titre', titreBloc));
    const corps = el('div', 'rappel-corps');
    bloc.append(resume, corps);
    let lance = false;
    const lancer = () => {
      if (lance) return;
      lance = true;
      const { log, jouer } = journalUnique(liste, cleLu);
      corps.append(log, bouton('lien-console', 'relire', () => jouer(false)));
    };
    bloc.addEventListener('toggle', () => { if (bloc.open) lancer(); });
    if (!etat.lus[cleLu]) bloc.open = true;
    return bloc;
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

    // Prochaine ouverture : compte à rebours
    const prochaine = jouables.find((m) => !ouverte(m));
    if (prochaine) {
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
      bloc.appendChild(ligne);
    }
    return bloc;
  }

  // ---------- Missions ----------
  function listeMissions() {
    const liste = el('div', 'rappels missions');
    let acte = null;
    ep.missions.forEach((m) => {
      if (m.acte !== acte) {
        acte = m.acte;
        liste.appendChild(el('h2', 'acte', acte));
      }
      liste.appendChild(mission(m));
    });
    return liste;
  }

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
    const etiquette = fini ? T.valide : ouv ? (etat.valides[m.id] ? (m.verdict ? 'verdict' : 'duel') : 'en cours') : m.date ? dateCourte(m.date) : '';
    resume.append(
      el('span', 'rappel-num', numero(m)),
      el('span', 'rappel-titre', m.lieu),
      el('span', `mission-etat${fini ? ' valide' : ouv ? ' actif' : ''}`, etiquette),
    );
    const corps = el('div', 'rappel-corps');
    bloc.append(resume, corps);
    bloc.addEventListener('toggle', () => {
      if (bloc.open && !corps.childElementCount) remplir(m, corps);
    });
    if (ouv && !fini && m.date === aujourdhui() && !zone.querySelector('.mission[data-auto]')) {
      bloc.dataset.auto = '1';
      bloc.open = true;
    }
    return bloc;
  }

  function rafraichir(m) {
    const ancien = zone.querySelector(`.mission[data-id="${m.id}"]`);
    const nouveau = mission(m);
    nouveau.open = true;
    ancien.replaceWith(nouveau);
    zone.querySelector('.progression').replaceWith(progression());
    zone.querySelector('.dossier').replaceWith(dossier());
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

    corps.appendChild(el('p', 'mission-texte', lire(m.commun)));
    const terrain = m.terrain === 'deux' || m.terrain === etat.role;
    corps.appendChild(el('p', 'mission-role', m.terrain === 'deux' ? T.deux : terrain ? T.terrain : T.cle));

    // Verrou (capteur) : seul l'agent de terrain doit le lever
    if (m.verrou && terrain && !etat.verrous[m.id] && !etat.valides[m.id]) {
      corps.appendChild(verrou(m));
      return;
    }

    corps.appendChild(el('p', 'mission-texte consigne', lire(m[etat.role])));
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
    if (etat.photos[m.id]) bloc.appendChild(photo(etat.photos[m.id]));
    const suite = [...messages(m.apres && m.apres.commun), ...messages(m.apres && m.apres[etat.role])];
    if (suite.length) {
      const { log, jouer } = journalUnique(suite, `apres-${m.id}`);
      bloc.append(log, bouton('lien-console', 'relire', () => jouer(false)));
    }
    if (m.duel) bloc.appendChild(duel(m));
    if (m.verdict) bloc.appendChild(verdict(m));
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
    const image = certificat(lire(v.certificat), gagnant, perdant, s);
    bloc.appendChild(image);
    const lien = el('a', 'bouton', 'Enregistrer le certificat');
    lien.href = image.src;
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
    return image;
  }

  function photo(source) {
    const cadre = el('figure', 'photo');
    const image = el('img');
    image.src = source;
    image.alt = 'Pièce à conviction';
    cadre.append(image, el('figcaption', null, 'pièce à conviction · conservée sur ce téléphone'));
    return cadre;
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
      bloc.append(el('p', 'mission-texte', `Ce formulaire ne s’ouvre qu’à proximité de ${v.nom}. Active la localisation une fois sur place.`));
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
    bloc.appendChild(el('h2', 'acte', T.dossier));
    const ligne = el('p', 'dossier-mots');
    if (mots.length) {
      // Ordre alphabétique : l'ordre de la phrase reste à retrouver
      mots.sort((a, b) => a.localeCompare(b, 'fr')).forEach((mot) => ligne.appendChild(el('span', 'dossier-mot', mot)));
    } else {
      ligne.appendChild(el('span', 'note', 'rien pour l’instant'));
    }
    bloc.append(el('p', 'eyebrow', T.mots), ligne);
    Object.values(etat.photos || {}).forEach((source) => bloc.appendChild(photo(source)));
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
