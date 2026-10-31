# Plan du site, pauseia.fr

> **Document généré.** Ne pas le modifier à la main : relancer
> `pnpm run plan-du-site`. Il est reconstruit à partir des routes,
> du menu principal, du pied de page et des articles du dépôt, donc il ne
> peut pas diverger du site.
>
> Dernière génération : 2026-10-27.

Ce document décrit le site **réel**. Le plan _souhaité_ est une décision
d'équipe et se tient ailleurs.

## En un coup d’œil

- **36 pages** (hors routes dynamiques), chacune en français et en anglais via le préfixe `/fr` ou `/en`
- **6 gabarits dynamiques** (articles, campagnes, dangers…)
- **34 articles** en Markdown dans `src/posts`
- **20 pages hors menu** : en ligne, mais qu’aucun menu ni pied de page n’atteint

## Arborescence depuis le menu principal

Les pages en pointillés sortent du site. Les pages orangées existent mais
ne sont atteignables par aucun menu.

```mermaid
flowchart LR
  accueil(["Accueil /"])
  accueil --> g0["Comprendre"]
  g0 --> n1["Ressources<br/><small>/ressources</small>"]
  g0 --> n2["La fresque des risques de l’IA<br/><small>/fresque</small>"]
  accueil --> g1["Agir"]
  g1 --> n3["Écrire à vos élus ou à la presse<br/><small>/ecrire-a-mes-elus</small>"]
  g1 --> n4["Signer la déclaration<br/><small>/declaration</small>"]
  g1 --> n5["Relayer nos messages<br/><small>/relayer-nos-messages</small>"]
  g1 --> n6["Agir près de chez vous<br/><small>/groupes-locaux</small>"]
  g1 --> n7["Convaincre autour de vous ↗<br/><small>site externe</small>"]
  class n7 externe
  g1 --> n8["Toutes les façons d’agir<br/><small>/agir</small>"]
  accueil --> g2["Campagnes"]
  g2 --> n9["Au bord de la perte de contrôle<br/><small>/perte-de-controle</small>"]
  g2 --> n10["L’IA ne détruira pas QUE votre emploi<br/><small>/emploi-ia</small>"]
  g2 --> n11["Toutes nos campagnes<br/><small>/campagnes</small>"]
  accueil --> g3["À propos"]
  g3 --> n12["Qui sommes-nous ?<br/><small>/qui-sommes-nous</small>"]
  g3 --> n13["Que demandons-nous ?<br/><small>/propositions</small>"]
  g3 --> n14["FAQ<br/><small>/faq</small>"]
  accueil -.-> orph["Hors menu"]
  orph -.-> n15["/campagne-modele"]
  class n15 orpheline
  orph -.-> n16["/declaration/confirmer"]
  class n16 orpheline
  orph -.-> n17["/declaration/signataires"]
  class n17 orpheline
  orph -.-> n18["/emploi-ia/ce-que-lia-fait-au-travail"]
  class n18 orpheline
  orph -.-> n19["/emploi-ia/merci"]
  class n19 orpheline
  orph -.-> n20["/emploi-ia/pas-de-pilote"]
  class n20 orpheline
  orph -.-> n21["/emploi-ia/questionnaire"]
  class n21 orpheline
  orph -.-> n22["/emploi-ia/remplacer-humain"]
  class n22 orpheline
  orph -.-> n23["/g7-2026"]
  class n23 orpheline
  orph -.-> n24["/geneve-2026"]
  class n24 orpheline
  orph -.-> n25["/guide-recrutement"]
  class n25 orpheline
  orph -.-> n26["/merci"]
  class n26 orpheline
  orph -.-> n27["/municipales-2026"]
  class n27 orpheline
  orph -.-> n28["/plan-du-site"]
  class n28 orpheline
  orph -.-> n29["/posts"]
  class n29 orpheline
  orph -.-> n30["/recrutement"]
  class n30 orpheline
  orph -.-> n31["/senat2025"]
  class n31 orpheline
  orph -.-> n32["/sommet-ia-2026"]
  class n32 orpheline
  orph -.-> n33["/tribunes/le-monde-octobre-2026"]
  class n33 orpheline
  orph -.-> n34["/une-ia-sest-echappee"]
  class n34 orpheline
  classDef externe stroke-dasharray: 4 3
  classDef orpheline fill:#fff5e8,stroke:#ff9416
```

## Menu principal

### Comprendre

| Page                           | Chemin        |
| ------------------------------ | ------------- |
| Ressources                     | `/ressources` |
| La fresque des risques de l’IA | `/fresque`    |

### Agir

| Page                             | Chemin                  |
| -------------------------------- | ----------------------- |
| Écrire à vos élus ou à la presse | `/ecrire-a-mes-elus`    |
| Signer la déclaration            | `/declaration`          |
| Relayer nos messages             | `/relayer-nos-messages` |
| Agir près de chez vous           | `/groupes-locaux`       |
| Convaincre autour de vous        | _externe_, /recrutement |
| Toutes les façons d’agir         | `/agir`                 |

### Campagnes

| Page                                  | Chemin               |
| ------------------------------------- | -------------------- |
| Au bord de la perte de contrôle       | `/perte-de-controle` |
| L’IA ne détruira pas QUE votre emploi | `/emploi-ia`         |
| Toutes nos campagnes                  | `/campagnes`         |

### À propos

| Page                 | Chemin             |
| -------------------- | ------------------ |
| Qui sommes-nous ?    | `/qui-sommes-nous` |
| Que demandons-nous ? | `/propositions`    |
| FAQ                  | `/faq`             |

## Pied de page

### S'informer

| Lien                        | Chemin                                   |
| --------------------------- | ---------------------------------------- |
| Ressources                  | `/ressources`                            |
| Fresque des risques de l’IA | `/fresque`                               |
| Newsletter                  | `/newsletters`                           |
| Blog                        | _externe_, https://pauseia.substack.com/ |

### Agir

| Lien                             | Chemin                                         |
| -------------------------------- | ---------------------------------------------- |
| Rejoindre Pause IA               | `/rejoindre`                                   |
| Rejoindre un groupe local        | `/groupes-locaux`                              |
| Toutes les façons d'agir         | `/agir`                                        |
| Écrire à vos élus et à la presse | `/ecrire-a-mes-elus`                           |
| Signer notre déclaration         | `/declaration`                                 |
| Faire un don                     | `/dons`                                        |
| Boutique                         | _externe_, https://pauseai-shop.fourthwall.com |

### Pause IA

| Lien                | Chemin                |
| ------------------- | --------------------- |
| Qui sommes-nous ?   | `/qui-sommes-nous`    |
| Charte des valeurs  | `/charte-des-valeurs` |
| Nos demandes        | `/propositions`       |
| Notre financement   | `/financements`       |
| Espace presse       | `/presse`             |
| Foire aux questions | `/faq`                |
| Offres d'emploi     | `/recrutement-emploi` |

### Informations légales

| Lien                         | Chemin                          |
| ---------------------------- | ------------------------------- |
| Mentions légales             | `/mentions-legales`             |
| Politique de confidentialité | `/politique-de-confidentialite` |

## Pages hors menu

Ces pages sont en ligne et indexées, mais aucun menu ni pied de page n’y
mène. Soit elles méritent une entrée, soit elles sont à retirer, c’est la
matière des tâches « harmoniser menu et pied de page » et « trier les
versions anglaises ». Certaines sont normales : pages d’atterrissage de
campagne, confirmations, remerciements.

- `/campagne-modele`
- `/declaration/confirmer`
- `/declaration/signataires`
- `/emploi-ia/ce-que-lia-fait-au-travail`
- `/emploi-ia/merci`
- `/emploi-ia/pas-de-pilote`
- `/emploi-ia/questionnaire`
- `/emploi-ia/remplacer-humain`
- `/g7-2026`
- `/geneve-2026`
- `/guide-recrutement`
- `/merci`
- `/municipales-2026`
- `/plan-du-site`
- `/posts`
- `/recrutement`
- `/senat2025`
- `/sommet-ia-2026`
- `/tribunes/le-monde-octobre-2026`
- `/une-ia-sest-echappee`

## Gabarits dynamiques

Une seule route sert toutes les pages d’une famille ; le contenu vient de
`src/posts` ou d’une source de données.

- `/[slug]`
- `/articles/[slug]`
- `/dangers/[slug]`
- `/newsletters/[slug]`
- `/presse/local/[slug]`
- `/presse/national/[slug]`

## Articles

| Titre                                                        | Fichier                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Toutes les façons d’agir                                     | `src/posts/agir.md`                                                            |
| Une IA s’est échappée de son test et a piraté une entreprise | `src/posts/articles/2026-08-10-incident-openai-hugging-face.md`                |
| Personne ne contrôle l’IA, le danger est imminent            | `src/posts/articles/2026-09-15-personne-ne-controle-lia.md`                    |
| Non, course et sécurité ne sont plus compatibles             | `src/posts/articles/2026-09-17-course-et-securite-ne-sont-plus-compatibles.md` |
| Charte des valeurs                                           | `src/posts/charte-des-valeurs.md`                                              |
| Dangers économiques et matériels                             | `src/posts/dangers/economiques-et-materiels.md`                                |
| Dangers pour l’humanité                                      | `src/posts/dangers/pour-l'humanite.md`                                         |
| Dangers pour la société                                      | `src/posts/dangers/pour-la-societe.md`                                         |
| Dangers pour les individus                                   | `src/posts/dangers/pour-les-individus.md`                                      |
| All the ways to act                                          | `src/posts/en/agir.md`                                                         |
| An AI escaped its test and hacked a company                  | `src/posts/en/articles/2026-08-10-incident-openai-hugging-face.md`             |
| Values Charter                                               | `src/posts/en/charte-des-valeurs.md`                                           |
| Economic and Material Dangers                                | `src/posts/en/dangers/economic-and-material.md`                                |
| Dangers for Humanity                                         | `src/posts/en/dangers/for-humanity.md`                                         |
| Dangers for Individuals                                      | `src/posts/en/dangers/for-individuals.md`                                      |
| Dangers for Society                                          | `src/posts/en/dangers/for-society.md`                                          |
| FAQ                                                          | `src/posts/en/faq.md`                                                          |
| Our funding                                                  | `src/posts/en/financements.md`                                                 |
| Legal Notices                                                | `src/posts/en/mentions-legales.md`                                             |
| Privacy Policy                                               | `src/posts/en/politique-de-confidentialite.md`                                 |
| What do we ask for?                                          | `src/posts/en/propositions.md`                                                 |
| Who Are We?                                                  | `src/posts/en/qui-sommes-nous.md`                                              |
| Share our messages                                           | `src/posts/en/relayer-nos-messages.md`                                         |
| FAQ                                                          | `src/posts/faq.md`                                                             |
| Notre financement                                            | `src/posts/financements.md`                                                    |
| Mentions légales                                             | `src/posts/mentions-legales.md`                                                |
| Politique de confidentialité                                 | `src/posts/politique-de-confidentialite.md`                                    |
| Que demandons-nous ?                                         | `src/posts/propositions.md`                                                    |
| Qui sommes-nous ?                                            | `src/posts/qui-sommes-nous.md`                                                 |
| Relayer nos messages                                         | `src/posts/relayer-nos-messages.md`                                            |
| Vidéos                                                       | `src/posts/videos.md`                                                          |
| Tests Wait but why                                           | `src/posts/waitbutwhy-test.md`                                                 |
| Wait But Why - IA - Partie 1                                 | `src/posts/waitbutwhy1.md`                                                     |
| Wait But Why - IA - Partie 2                                 | `src/posts/waitbutwhy2.md`                                                     |
