# locost.fr

Site d'accueil Locost : une porte d'entrée vers plusieurs expériences, avec une direction artistique commune (noir, vert terminal, glitch).

| Chemin | Contenu |
|---|---|
| `/` | Hub : intro glitch + une carte par expérience |
| `/jeu/` | Protocole Espigoule, le jeu immersif (en reconstruction) |
| `/qui-ma-troll/` | « Qui m'a troll ? », rapport hebdo League of Legends du groupe |

## Structure

```
index.html          hub
css/locost.css      charte commune, importée par toutes les pages
js/terminal.js      effet « texte tapé »
jeu/                le jeu immersif
qui-ma-troll/       le rapport hebdo (page autonome)
404.html            page d'erreur
CNAME               domaine personnalisé GitHub Pages
```

## Développement

Aucun build. Pour tester en local :

```bash
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Mise en ligne

GitHub Pages publie automatiquement la branche `main` sur https://www.locost.fr à chaque push.
