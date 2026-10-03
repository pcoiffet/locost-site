# Site locost.fr

- Répondre en français.
- Le site est un hub qui mène à plusieurs expériences ; chaque expérience vit dans son propre dossier (`/jeu/`, `/qui-ma-troll/`, ...).
- Direction artistique à respecter partout : sobre et réaliste, façon site caché du dark web (pas de néon « cheap ») : fond noir, texte gris, police monospace, filets fins, glitchs rares et brefs ; le vert terminal `#00ff41` ne sert que d'accent (états, curseur). Logo en version grise (`/assets/images/locost-gris.png`). Les variables et composants communs sont dans `css/locost.css` ; les réutiliser plutôt que de redéfinir des couleurs.
- HTML/CSS/JS vanilla, sans build ni dépendance npm. Mobile d'abord (portrait), correct sur ordinateur.
- Chemins absolus (`/css/locost.css`) : le site est servi à la racine de www.locost.fr.
- Le dépôt est public (GitHub Pages gratuit) : aucun secret, clé d'API ou donnée privée dans le code.
- `qui-ma-troll/index.html` est un export de l'artifact https://claude.ai/artifact/VNbGXhxESHp1WJKxEQgVP6 ; sa DA (or « Hextech ») est volontairement différente pour l'instant.
- Anciennes versions du jeu, à utiliser comme réserve d'idées, d'images et de sons : `pcoiffet/LocostV2.0` et `pcoiffet/Locost`.
