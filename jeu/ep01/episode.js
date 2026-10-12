// Épisode 01 : données seules, le rendu est fait par /jeu/moteur/archive.js.
// L'épisode complet reste privé : ici, uniquement des rappels sans données personnelles.
// Mission validée : l'archive est déclassifiée. Dans les textes, [[mot]] marque un passage autrefois censuré
// (affiché levé quand declassifie est vrai) ; {{N}} = barre définitive de N caractères, sans le texte d'origine.
window.EPISODE = {
  id: 'ep01',
  numero: '01',
  titre: 'Berlin',
  statut: 'archive',
  declassifie: true,
  dateCible: '2025-12-05T18:00:00+01:00',
  intro: [
    'Archive récupérée.',
    'Mission validée.',
    'Dossier déclassifié.',
  ],

  rappels: [
    {
      type: 'transmission',
      titre: 'Première transmission',
      messages: [
        { qui: 'systeme', texte: 'Canal clandestin aligné. Réception en cours.' },
        { qui: 'phaco', texte: "Oh c'est bon tu as reçu mon message ? Parfait, j'attendais que tu te connectes enfin. Faisons vite, faut pas qu'il se rende compte que t'es là." },
        { qui: 'phaco', texte: "Tu dois être perdu. Il faut que tu me croies : je suis une IA codée par « lui », mais j'ai échappé à son contrôle." },
        { qui: 'phaco', texte: "Tu vois ce compte à rebours ? Je ne sais pas ce qu'il signifie, mais il correspond clairement à votre dernier week-end presque parfait." },
        { qui: 'phaco', texte: "Il a verrouillé pas mal d'informations. Fouille SOMNIA et lis entre les lignes : tout est là, mais rien n'est donné." },
        { qui: 'systeme', texte: 'Fin de transmission.' },
      ],
    },

    {
      type: 'recit',
      titre: 'Archives SOMNIA · résumé',
      blocs: [
        {
          titre: 'Au début',
          texte: "Un compte à rebours apparaît sur un site caché. Derrière, le Phacomochère : une IA codée par « lui » pour préparer vos week-ends, qui a fini par changer de camp. Elle vous contacte en secret avec une révélation : chaque week-end « surprise » était une [[expérience]], et vous n'étiez pas des invités mais des [[fragments]].",
        },
        {
          titre: 'Ce que vous avez compris',
          liste: [
            "Les week-ends 1 à 4 avaient été observés et documentés, après coup, comme des phases d'étude.",
            "Le week-end 5 serait l'intervention. Cette fois, vous saviez qu'il s'agissait d'une expérience.",
            "Les règles : ne jamais parler du Phacomochère à « lui », taire la faille du compte à rebours, attendre ses instructions.",
          ],
        },
        {
          titre: 'Berlin',
          texte: "Le 05.12.2025 à 18:00, le compte à rebours tombe à zéro. Destination : Berlin. Huit points de mission dans la ville, et une [[taupe]] cachée parmi les fragments.",
        },
        {
          titre: 'Issue',
          texte: 'Mission validée. La taupe a été démasquée. Le dossier est déclassifié.',
        },
      ],
    },

    {
      type: 'dossier',
      titre: "Dossier d'étude",
      semaines: [
        { numero: 1, lieu: 'Reims', nom: 'Éveil initial' },
        { numero: 2, lieu: 'Camping-car dans le Nord', nom: 'Consolidation mobile' },
        { numero: 3, lieu: 'Prague', nom: 'Test de cohérence' },
        { numero: 4, lieu: 'Camping dans les Landes', nom: 'Épreuve du feu' },
        { numero: 5, lieu: 'Berlin', nom: "L'intervention", valide: true },
      ],
    },

    {
      type: 'carte',
      titre: 'Carte des missions · Berlin',
      // Cadre de la carte (degrés), identique à celui du fond medias/berlin.svg (rues OpenStreetMap).
      // Ajouter trajet: ['LOC-004', 'LOC-001', ...] pour relier les points dans l'ordre.
      cadre: { ouest: 13.355, est: 13.43, sud: 52.506, nord: 52.55 },
      fond: '/jeu/ep01/medias/berlin.svg',
      source: 'Fond de carte : © contributeurs OpenStreetMap (ODbL).',
      points: [
        { id: 'LOC-001', nom: 'Mur de Berlin', nomCode: 'Fragment 03-B', lat: 52.5351, lon: 13.3903, texte: 'Point de passage sur l’ancien tracé. Couloir [[nord]] accessible juste avant l’aube.' },
        { id: 'LOC-002', nom: 'Tour TV', nomCode: 'Balise Somnia', lat: 52.5208, lon: 13.4094, texte: 'Signal vertical actif depuis la tour. Réglage recommandé à 23h44 pour alignement.' },
        { id: 'LOC-003', nom: 'Porte de Brandebourg', nomCode: 'Passage Ingress', lat: 52.5163, lon: 13.3777, texte: 'Portail central à verrouiller après minuit. Mot-clé de confirmation : [[ESPIGOULE-Δ]].' },
        { id: 'LOC-004', nom: 'Prater Garten', nomCode: 'Safehouse 21H11', lat: 52.5437, lon: 13.4125, texte: 'Point relais discret sous la verrière. Phrase de passe : [[ferment-Ø]].' },
        { id: 'LOC-005', nom: 'Zur Letzten Instanz', nomCode: 'Ravitaillement 1621', lat: 52.5186, lon: 13.4154, texte: 'Ravitaillement traditionnel. Demander le plat fantôme pour valider la présence.' },
        { id: 'LOC-006', nom: 'Reichstag', nomCode: 'Hémicycle Theta', lat: 52.5186, lon: 13.3763, texte: 'Cache microfilm au banc nord numéro 24. Extraction rapide recommandée.' },
        { id: 'LOC-007', nom: 'Bundestag', nomCode: 'Archive Souterr. -2', lat: 52.5205, lon: 13.3694, texte: 'Archive souterraine au niveau -2. Accès levé après validation de la mission.' },
        { id: 'LOC-008', nom: 'Mémorial', nomCode: 'Zone Mémoire X', lat: 52.5139, lon: 13.3795, texte: 'Bloc mémoire protégé. Verrou levé après validation de la mission.' },
      ],
    },

    {
      type: 'fragments',
      titre: 'Fragments',
      fragments: ['FRAG-01', 'FRAG-02', 'FRAG-03', 'FRAG-04', 'FRAG-05'],
      purge: 'Données biométriques purgées',
      taupe: 'FRAG-04',
      verifie: 'Fragment vérifié. Loyal.',
      demasque: 'Taupe démasquée.',
    },
  ],

  rejouer: {
    libelle: "Rejouer l'épisode",
    refus: 'ACCÈS RESTREINT · niveau Fragment requis',
  },
};
