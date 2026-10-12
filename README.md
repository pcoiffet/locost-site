# locost.fr

Code source de [www.locost.fr](https://www.locost.fr), un petit site perso qui regroupe plusieurs projets.

L'accès au menu se fait par un écran de chargement avec mot de passe.

## Contenu

| Page | Description |
|---|---|
| `/` | Écran de chargement et menu des apps |
| `/jeu/` | P.R.O.T.O.C.O.L.E, un jeu immersif, en cours de développement |
| `/qui-ma-troll/` | Un rapport hebdomadaire, mis à jour chaque semaine |

## Technique

- HTML, CSS et JavaScript, sans framework ni étape de build.
- Une feuille de style commune (`css/locost.css`) pour toutes les pages.
- Hébergé sur GitHub Pages : chaque push sur `main` met le site à jour.

Pour le lancer en local :

```bash
python3 -m http.server 8000
```
