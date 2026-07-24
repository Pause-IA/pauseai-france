---
title: Notre financement
description: D'où vient l'argent de Pause IA, à quoi il sert, et pourquoi nous restons indépendants des entreprises d'IA et des États. Comptes détaillés et rapport financier.
---

<!--
  Notes de maintenance (ne pas publier) :
  Cette page devra être mise à jour :
  - à chaque nouvel exercice comptable validé en assemblée générale ;
  - lorsque la répartition des ressources évolue significativement ;
  - lorsque le nombre d'adhérents change nettement ;
  - lorsqu'un nouveau rapport financier (HTML + PDF) est publié dans /static.
  Pensez à mettre à jour la date « Dernière mise à jour » du chapeau.
-->

<script lang="ts">
  import Button from '$components/Button.svelte'
</script>

<p class="maj"><em>Dernière mise à jour : juillet 2026</em></p>

Pause IA est une association loi 1901 d'intérêt général, enregistrée depuis juin 2024 (RNA W751274610), dont le siège est au 32 boulevard de Strasbourg, 75010 Paris.

## Nos principes

Nous ne recevons aucun financement d'entreprises d'intelligence artificielle ni des États engagés dans la course à l'IA. Notre crédibilité repose sur notre indépendance vis-à-vis des acteurs dont nous questionnons publiquement les pratiques.

Certains de nos donateurs individuels sont engagés de longue date dans la sécurité de l'IA ; aucun, quel qu'il soit, n'a de droit de regard sur nos positions, nos campagnes ou nos prises de parole. Nous refuserions un financement plutôt que d'accepter une contrepartie de cette nature.

## Nos ressources financières

Depuis notre création en juin 2024, nous avons reçu environ 84 000 €, répartis ainsi :

| Source                                          | Part         |
| ----------------------------------------------- | ------------ |
| Dons de particuliers                            | environ 55 % |
| Don fléché pour l'organisation d'une conférence | environ 12 % |
| Subvention de lancement                         | environ 12 % |
| Adhésions                                       | environ 10 % |
| Financement participatif                        | environ 7 %  |

L'unique subvention que nous ayons reçue est une aide au lancement de 10 000 €, versée en juillet 2024 par Stichting PauseAI, l'organisation néerlandaise qui coordonne le réseau international dont nous sommes le chapitre français. Nous n'avons reçu aucune autre subvention depuis.

Le salaire de notre directrice exécutive, recrutée en décembre 2025, a été pris en charge pendant ses premiers mois par PauseAI Global, grâce à une subvention du Future of Life Institute. Ces fonds n'ont jamais transité par nos comptes. Depuis, Pause IA France assume ce salaire sur ses propres ressources.

Nous comptons aujourd'hui 126 adhérents. La cotisation la plus fréquente est de 2 € par mois : nous avons fait le choix d'une adhésion accessible à tous plutôt que d'un montant minimum élevé. Cette base d'adhérents, lancée en septembre 2025, est notre principal levier d'indépendance et elle s'élargit régulièrement.

## Nos points de vigilance

Nos ressources reposent encore sur un nombre restreint de contributeurs. Lors de notre premier exercice, un seul donateur représentait plus d'un tiers de nos recettes ; aujourd'hui, quelques personnes en représentent encore environ un tiers. Réduire progressivement cette dépendance en élargissant notre base d'adhérents est un objectif explicite de notre stratégie financière, et c'est l'une des raisons pour lesquelles nous encourageons l'adhésion plutôt que le don ponctuel.

## Nos dépenses

Sur notre premier exercice (juin 2024 à novembre 2025), nous avons dépensé 21 198 €, dont 56 % pour l'organisation d'événements publics, 21 % pour les déplacements et l'hébergement des bénévoles, 9 % pour du matériel, et le reste en outils et frais de fonctionnement.

L'association a fonctionné entièrement grâce au bénévolat pendant ses dix-huit premiers mois. Elle emploie une directrice exécutive depuis décembre 2025. L'essentiel de notre travail continue de reposer sur nos bénévoles.

## Nos comptes

Nos comptes sont présentés et validés chaque année en assemblée générale. Le rapport de notre premier exercice, validé le 17 décembre 2025, est consultable intégralement :

<ul>
  <li><a href="/rapport-financier-2024-2025.html" data-sveltekit-reload>Consulter le rapport financier 2024-2025 en ligne</a></li>
  <li><a href="/pause-ia-rapport-financier-2024-2025.pdf" data-sveltekit-reload>Télécharger le rapport financier 2024-2025 (PDF)</a></li>
</ul>

<div class="cta">
  <Button href="/dons">Faire un don</Button>
  <p class="cta-note"><em>Votre don ouvre droit à une réduction d'impôt de 66 %.</em></p>
  <a class="cta-secondary" href="https://www.helloasso.com/associations/pause-ia/adhesions/formulaire-d-adhesion-a-pause-ia">Adhérer à Pause IA</a>
</div>

<style>
  .maj {
    color: var(--text-2, #555);
    font-size: 0.95rem;
    margin: 0 0 1.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.98rem;
  }

  th,
  td {
    padding: 0.6rem 0.8rem;
    border: 1px solid var(--border, #dde1e7);
    text-align: left;
  }

  thead th {
    background: var(--brand, #ff9416);
    color: #fff;
    font-weight: 600;
  }

  tbody tr:nth-child(even) {
    background: var(--bg-subtle, #fff5e8);
  }

  td:last-child,
  th:last-child {
    text-align: right;
    white-space: nowrap;
  }

  .cta {
    margin: 3rem 0 1rem;
    text-align: center;
  }

  .cta-note {
    margin: 0.75rem 0 1.5rem;
    font-size: 0.9rem;
    color: var(--text-2, #555);
  }

  .cta-secondary {
    display: inline-block;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 0.5rem 0.55rem;
      font-size: 0.9rem;
    }
  }
</style>
