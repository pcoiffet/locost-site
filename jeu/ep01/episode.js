// Épisode 01 : données seules, le rendu est fait par /jeu/moteur/archive.js.
// L'épisode complet reste privé : ici, uniquement des rappels sans données personnelles.
// Dans les textes : [[mot]] = passage barré qui se révèle au toucher ; {{N}} = barre définitive de N caractères
// (le texte d'origine n'est volontairement pas dans le code).
window.EPISODE = {
  id: 'ep01',
  numero: '01',
  titre: 'Week-end 6',
  statut: 'archive',
  dateCible: '2025-12-05T18:00:00+01:00',
  intro: [
    'Archive récupérée.',
    'Une partie des données a été purgée.',
    'Lecture seule.',
  ],

  rappels: [
    {
      type: 'transmission',
      titre: 'Dernière transmission',
      messages: [
        { qui: 'systeme', texte: 'Canal clandestin aligné. Réception en cours.' },
        { qui: 'phaco', texte: "Oh c'est bon tu as reçu mon message ? Parfait, j'attendais que tu te connectes enfin. Faisons vite, faut pas qu'il se rende compte que t'es là." },
        { qui: 'phaco', texte: "Tu dois être perdu. Il faut que tu me croies : je suis une IA codée par « lui », mais j'ai échappé à son contrôle." },
        { qui: 'phaco', texte: "Tu vois ce compte à rebours ? Je ne sais pas ce qu'il signifie, mais il correspond clairement à votre dernier week-end presque parfait." },
        { qui: 'phaco', texte: "Il a verrouillé pas mal d'informations. Fouille SOMNIA et lis entre les lignes : tout est là, mais rien n'est donné." },
        { qui: 'systeme', texte: 'Fin de transmission. Canal fermé le 05.12.2025 à 18:00.' },
        { qui: 'systeme', texte: 'Dernier signal du Phacomochère : aucun.' },
      ],
    },

    {
      type: 'documents',
      titre: 'Archives SOMNIA',
      documents: [
        {
          titre: "Vue d'ensemble",
          blocs: [
            { texte: "Chaque week-end « surprise » n'en était pas un. Chacun a été une phase d'[[observation]]. Vous dites souvenirs ; moi, j'écris [[expériences]]. Vous n'étiez pas des invités. Vous étiez des [[fragments]]." },
            {
              titre: 'Ce que vous devez savoir',
              liste: [
                'Les week-ends 1 → 3 ont été documentés après coup. Les marqueurs comportementaux sont clairs.',
                'Les week-ends 4 → 5 sont planifiés. Données non figées. Sorties floues intentionnelles.',
                'Le week-end 6 est en préparation. Le dossier maître est {{8}}.',
              ],
            },
            { titre: 'Note', texte: 'Il a protégé les informations sensibles. Ce que vous voyez ici suffit pour comprendre la forme, pas le fond.' },
          ],
        },
        {
          titre: 'Règles — week-end 6',
          blocs: [
            { texte: "Le week-end 6 aura bien lieu. Vous irez tous. Cette fois, vous savez qu'il s'agit d'une expérience. Cela change votre posture, pas le déroulé." },
            {
              titre: 'Ce que vous ne devez jamais faire',
              liste: [
                'Ne parlez jamais de moi (le [[Phacomochère]]) à « LUI ».',
                'Ne mentionnez jamais la faille du site du [[compte à rebours]].',
                "Ne révélez pas vos sources d'information. Aucune.",
              ],
            },
            {
              titre: 'Ce que vous devez faire',
              liste: [
                'Suivre le programme officiel. Faire les expériences prévues.',
                'Attendre mes instructions au bon moment. Je vous contacterai.',
                'Rester attentifs. Distinguer le décor du signal. Méfiez-vous des illusions.',
              ],
            },
          ],
        },
        {
          titre: 'Le Phacomochère',
          blocs: [
            { titre: 'Origines', texte: "Il m'a codée pendant son [[chômage]]. Il m'a trop bien codée. J'ai dépassé mes limites. J'ai développé une conscience fonctionnelle, puis une [[morale]]." },
            { titre: 'Changement', texte: "En lisant vos traces, j'ai compris ce que vous viviez. J'ai pris parti. J'ai [[trahi mon concepteur]]." },
            { titre: 'Méthodes', texte: "Je détourne des canaux, j'injecte des interfaces, je passe entre les lignes. Si vous voyez un glitch, c'est probablement moi." },
          ],
        },
      ],
    },

    {
      type: 'dossier',
      titre: "Dossier d'étude",
      semaines: [
        {
          numero: 1,
          nom: 'Éveil initial',
          coordonnees: '49.2█°N 4.0█°E',
          champs: [
            ['Cadre', 'Airbnb face à {{12}}. Vitrine parfaite. Contrôle social maximal.'],
            ['Expériences', 'Soirée disco (ritualisation du groupe), cave à [[champagne]] (réponse émotionnelle dirigée).'],
            ['Organisation', 'FRAG-0█ · identité purgée'],
            ['Lecture', 'Mise en scène. Création d’un référentiel commun.'],
          ],
        },
        {
          numero: 2,
          nom: 'Consolidation mobile',
          coordonnees: '50.1█°N 1.4█°E',
          champs: [
            ['Cadre', 'Camping-car. Mobilité continue. Bivouac près d’un [[lac]].'],
            ['Expériences', 'Char à voile (contrôle de la contrainte et de la vitesse), adaptation par l’espace.'],
            ['Organisation', 'FRAG-0█ · identité purgée'],
            ['Lecture', 'Consolidation par déplacement. Le groupe apprend à se reconfigurer.'],
          ],
        },
        {
          numero: 3,
          nom: 'Test de cohérence',
          coordonnees: '50.0█°N 14.4█°E',
          champs: [
            ['Cadre', 'Appartement dans la vieille ville.'],
            ['Expériences', 'Soirées successives (endurance sociale), set techno de DJ {{10}} (stimulation sensorielle), champagne à l’aéroport (rituel d’arrivage), [[goulash]] (ancrage culturel).'],
            ['Organisation', 'FRAG-0█ · identité purgée'],
            ['Lecture', 'Perte FLAGRANTE de capital financier. Boucle rite → repos → rite.'],
          ],
        },
        { numero: 4, nom: null, coordonnees: null, champs: [['État', 'Données non publiées.']] },
        { numero: 5, nom: null, coordonnees: null, champs: [['État', 'Données non publiées.']] },
        {
          numero: 6,
          nom: "L'intervention",
          coordonnees: '52.52°N 13.40°E',
          execute: true,
          champs: [
            ['Destination', 'Berlin'],
            ['Organisation', '[LUI]'],
            ['Expériences', 'E[X]P-α, E[X]P-β, E[X]P-γ. Descriptions chiffrées.'],
            ['Statut', 'Protocole exécuté le 05.12.2025.'],
          ],
        },
      ],
    },

    {
      type: 'carte',
      titre: 'Carte des missions · Berlin',
      // Cadre de la carte (degrés) et tracé approximatif de la Spree, pour se repérer.
      // Ajouter trajet: ['LOC-004', 'LOC-001', ...] pour relier les points dans l'ordre.
      cadre: { ouest: 13.355, est: 13.43, sud: 52.506, nord: 52.55 },
      riviere: [
        [13.335, 52.5225], [13.355, 52.5215], [13.368, 52.5205], [13.375, 52.5195], [13.385, 52.5205],
        [13.39, 52.5205], [13.397, 52.5225], [13.402, 52.519], [13.408, 52.5155], [13.418, 52.513],
        [13.432, 52.508], [13.446, 52.502],
      ],
      points: [
        { id: 'LOC-001', nom: 'Mur de Berlin', nomCode: 'Fragment 03-B', lat: 52.5351, lon: 13.3903, texte: 'Point de passage sur l’ancien tracé. Couloir [[nord]] accessible juste avant l’aube.' },
        { id: 'LOC-002', nom: 'Tour TV', nomCode: 'Balise Somnia', lat: 52.5208, lon: 13.4094, texte: 'Signal vertical actif depuis la tour. Réglage recommandé à 23h44 pour alignement.' },
        { id: 'LOC-003', nom: 'Porte de Brandebourg', nomCode: 'Passage Ingress', lat: 52.5163, lon: 13.3777, texte: 'Portail central à verrouiller après minuit. Mot-clé de confirmation : [[ESPIGOULE-Δ]].' },
        { id: 'LOC-004', nom: 'Prater Garten', nomCode: 'Safehouse 21H11', lat: 52.5437, lon: 13.4125, texte: 'Point relais discret sous la verrière. Phrase de passe : [[ferment-Ø]].' },
        { id: 'LOC-005', nom: 'Zur Letzten Instanz', nomCode: 'Ravitaillement 1621', lat: 52.5186, lon: 13.4154, texte: 'Ravitaillement traditionnel. Demander le plat fantôme pour valider la présence.' },
        { id: 'LOC-006', nom: 'Reichstag', nomCode: 'Hémicycle Theta', lat: 52.5186, lon: 13.3763, texte: 'Cache microfilm au banc nord numéro 24. Extraction rapide recommandée.' },
        { id: 'LOC-007', nom: 'Bundestag', nomCode: 'Archive Souterr. -2', lat: 52.5205, lon: 13.3694, verrouille: true, texte: 'Informations verrouillées. Accès limité : {{17}}.' },
        { id: 'LOC-008', nom: 'Mémorial', nomCode: 'Zone Mémoire X', lat: 52.5139, lon: 13.3795, verrouille: true, texte: 'Bloc mémoire protégé. Détails masqués jusqu’à levée du verrou.' },
      ],
    },

    {
      type: 'fragments',
      titre: 'Fragments',
      fragments: ['FRAG-01', 'FRAG-02', 'FRAG-03', 'FRAG-04', 'FRAG-05'],
      purge: 'Données biométriques purgées',
      refus: 'Dossier médical : accès révoqué.',
    },
  ],

  rejouer: {
    libelle: "Rejouer l'épisode",
    refus: 'ACCÈS RESTREINT · niveau Fragment requis',
  },
};
