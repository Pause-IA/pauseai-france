# Charte graphique — Pause IA

Extraite du code du site (`src/app.css`, `src/reset.css`, composants de `src/lib/components`).
Source de vérité : **`src/app.css`**. Toute nouvelle page doit utiliser ces variables CSS,
jamais des valeurs en dur — c'est ce qui garantit le fonctionnement du mode sombre.

## 1. Couleurs

### Marque

| Token            | Clair     | Sombre    | Usage                                       |
| ---------------- | --------- | --------- | ------------------------------------------- |
| `--brand`        | `#ff9416` | identique | Orange Pause IA : boutons, soulignés, puces |
| `--brand-light`  | `#fff5e8` | `#2a1f0a` | Fond orangé très clair                      |
| `--brand-subtle` | `#c96900` | `#ffab40` | Orange foncé, lisible en texte et en lien   |

> `--brand` (#ff9416) n'a pas un contraste suffisant pour du texte sur fond blanc.
> Pour un lien ou un chiffre, utiliser `--brand-subtle`. `--brand` reste réservé
> aux aplats (boutons, filets, puces, bordures).

### Neutres et surfaces

| Token              | Clair     | Sombre    | Usage                                  |
| ------------------ | --------- | --------- | -------------------------------------- |
| `--bg`             | blanc     | `#272727` | Fond de page                           |
| `--bg-subtle`      | `#fff5e8` | `#312e29` | Fond de mise en avant (callout, stats) |
| `--bg-card`        | `#fafafa` | `#303030` | Fond de carte / encadré                |
| `--text`           | noir      | `#f0f0f0` | Texte courant                          |
| `--text-2`         | `#555`    | `#a0a8b4` | Texte secondaire, chapô, légendes      |
| `--text-secondary` | `#676e7a` | `#a0a8b4` | Alias UI (`--text-muted` idem)         |
| `--border`         | `#e5e7eb` | `#3e4048` | Bordures et filets                     |

### Boutons

`--btn-bg` / `--btn-hover-bg` (`#ffa945`) / `--btn-active-bg` (`#e6891d`),
et la variante claire `--btn-alt-*`. Focus visible : contour `#0097d8` de `0.25rem`.

### Accent d'alerte

`#d92d20` (rouge) — réservé aux moments critiques d'une chronologie. Pas de rouge
ailleurs dans l'interface.

## 2. Typographie

- Police unique : **IBM Plex Sans** (`--font-body` = `--font-heading`).
- Corps de texte : `1.2rem`, interligne `1.5`.
- `h1`/`h2` : 700, `1.7rem` → `2rem` à partir de 640 px.
- `h3` : 500, `1.5rem`.
- Titres de campagne : `clamp(2rem, 5.5vw, 3rem)` pour le h1, `clamp(1.4rem, 3vw, 1.75rem)` pour les h2.
- Chapô : `clamp(1.05rem, 2vw, 1.25rem)`, couleur `--text-2`, largeur max `44rem`.
- Les liens sont soulignés, en `--brand-subtle`, et passent à `--brand` au survol.
- Typographie française appliquée automatiquement au Markdown
  (`src/lib/typographyPlugin.js`) : espace fine insécable avant `; ? ! %`,
  insécable avant `:`, guillemets `« »`.

## 3. Rythme et mise en page

- Colonne de contenu : **54 rem** (pages éditoriales et campagnes), **60–66 rem**
  pour les pages larges. Gouttière : `1.5rem` (`1.1rem` en mobile).
- Espacement entre sections : `3.5rem` sur les pages campagne (le global d'`app.css`
  est de 5/10 rem, neutralisé par `CampaignPage`).
- Rayons : `12px` pour les médias et les cartes, `16px` pour les grands encadrés,
  `0.625rem` pour les boutons, `999px` pour les badges.
- Ombres : très discrètes — `0 4px 20px rgba(0, 0, 0, 0.03)` sur les encadrés,
  `0 2px 8px rgba(255, 148, 22, 0.3)` sur le bouton principal.
- Cibles tactiles : hauteur de bouton `48px` minimum.

## 4. Motifs récurrents

- **Filet de marque** : trait orange de `3rem × 4px`, arrondi, au-dessus du titre de hero.
- **Titre souligné** (`UnderlinedTitle`) : dégradé orange → transparent sur toute la largeur.
- **Callout** (`Callout`) : fond `--bg-subtle`, bordure `2px` `--brand`.
- **Citation** : fond `--bg-subtle`, barre gauche `4px` `--brand`.
- **Chronologie** : axe vertical orange à 30 % d'opacité, pastilles pleines `--brand`.

## 5. Mode sombre

Piloté par `data-theme="dark"` sur `<html>`, posé avant le premier rendu par le
script anti-FOUC d'`src/app.html`, et basculé via le store `src/lib/stores/theme.ts`.
Une page conforme n'a **rien de spécifique à écrire** pour le mode sombre si elle
n'utilise que les tokens ci-dessus. Les intégrations tierces (iframes) doivent en
revanche recevoir le thème explicitement — voir `LumaCalendar.svelte`.

## 6. Accessibilité

- Mouvement réduit respecté globalement (`prefers-reduced-motion`).
- Focus visible conservé sur tous les éléments interactifs.
- Toute `iframe` doit porter un `title` descriptif.
