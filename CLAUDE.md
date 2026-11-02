# Site locost.fr

- Répondre en français.
- Le site est un hub qui mène à plusieurs expériences ; chaque expérience vit dans son propre dossier (`/jeu/`, `/qui-ma-troll/`, ...).
- Direction artistique à respecter partout : sobre et réaliste, façon site caché du dark web (pas de néon « cheap ») : fond noir, texte gris, police monospace, filets fins, glitchs rares et brefs ; le vert terminal `#00ff41` ne sert que d'accent (états, curseur). Logo en version grise (`/assets/images/locost-gris.png`). Les variables et composants communs sont dans `css/locost.css` ; les réutiliser plutôt que de redéfinir des couleurs.
- HTML/CSS/JS vanilla, sans build ni dépendance npm. Mobile d'abord (portrait), correct sur ordinateur.
- Chemins absolus (`/css/locost.css`) : le site est servi à la racine de www.locost.fr.
- Le dépôt est public (GitHub Pages gratuit) : aucun secret, clé d'API ou donnée privée dans le code.
- `qui-ma-troll/index.html` est un export de l'artifact https://claude.ai/artifact/VNbGXhxESHp1WJKxEQgVP6 ; sa DA (or « Hextech ») est volontairement différente pour l'instant.
- Épisode 02 du jeu (`/jeu/ep02/`, « Le Bureau des Doublons », voyage en Chine de deux Paul) : DA « formulaire officiel » (papier crème, encre, tampons rouges) volontairement différente, dans `jeu/ep02/bureau.css`. Moteur à deux téléphones dans `jeu/moteur/missions.js`. `jeu/ep02/episode.js` est généré (textes brouillés, réponses en empreintes SHA-256) : Paul y joue, ne jamais lui dévoiler énigmes ni réponses.
- Anciennes versions du jeu, à utiliser comme réserve d'idées, d'images et de sons : `pcoiffet/LocostV2.0` et `pcoiffet/Locost`.
- Après toute modification de `css/` ou `js/`, incrémenter le `?v=N` des liens dans les pages HTML : GitHub Pages met ces fichiers en cache 10 minutes, sinon les visiteurs mélangent ancienne et nouvelle version.
- Jeu (`/jeu/`) : un moteur commun dans `jeu/moteur/` et un dossier par épisode (`jeu/epXX/episode.js` = données seules), déclaré dans `jeu/episodes.js` avec ses coordonnées : la page `/jeu/` affiche la Terre (`jeu/moteur/globe.js`, contours dans `jeu/moteur/terre.js` générés depuis Natural Earth) et un point GPS par épisode. L'épisode 1 complet reste privé (photos, prénoms, dossiers des potes) : seule sa fiche d'archive sans données personnelles est publique.
