---
title: Toutes les façons d’agir
rubrique: agir
description: Les actions les plus utiles pour aider à garder l'IA sous contrôle, de 5 minutes à un engagement durable.
original:
  title: Take action
  url: https://github.com/PauseAI/pauseai-website/blob/95be1d5327015a2c41f5c518d92812d7f6c79bda/src/posts/action.md
---

<script lang="ts">
  import { page } from '$app/stores'
  $: lang = $page.params.lang ?? 'fr'
</script>

Le nombre de personnes conscientes des risques liés à l'IA est encore restreint. Vous en faites désormais partie, et **vos actions ont plus de poids que vous ne l'imaginez.**

Pas besoin d'y consacrer votre vie : voici les actions les plus utiles, de cinq minutes à un engagement plus durable.

## En quelques minutes

<div class="action-grid">
  <a class="action-card primaire" href="/{lang}/ecrire-a-mes-elus">
    <span class="ac-emoji">✉️</span>
    <strong>Écrire à mes élus</strong>
    <small>Un email prêt à personnaliser pour votre député ou votre sénateur. C'est court, et bien plus efficace qu'une pétition : un message d'un vrai citoyen est lu et compté.</small>
    <em class="ac-why"><strong>Pourquoi :</strong> Les parlementaires comptent les messages reçus sur un sujet. Sur l’IA, ils en reçoivent très peu : le vôtre pèse donc lourd.</em>
  </a>
  <a class="action-card" href="/{lang}/declaration">
    <span class="ac-emoji">✍️</span>
    <strong>Signer la déclaration</strong>
    <small>Ajoutez votre nom à l'appel pour un moratoire sur les IA les plus dangereuses.</small>
    <em class="ac-why"><strong>Pourquoi :</strong> Face à un décideur, le nombre de signatures est l’argument qu’on pose sur la table. Un appel porté par des milliers de personnes n’est plus l’avis d’une association.</em>
  </a>
  <a class="action-card" href="/{lang}/dons">
    <span class="ac-emoji">💶</span>
    <strong>Faire un don</strong>
    <small>Chaque euro nous aide à agir plus et plus vite.</small>
    <em class="ac-why"><strong>Pourquoi :</strong> Nous vivons de nos membres et de nos donateurs. Chaque euro achète du temps de travail, des déplacements, du matériel de campagne.</em>
  </a>
</div>

## Pour aller plus loin

<div class="action-grid">
  <a class="action-card" href="/{lang}/rejoindre">
    <span class="ac-emoji">✊</span>
    <strong>Rejoindre Pause IA</strong>
    <small>Rejoignez le mouvement et aidez-nous à prendre de l'ampleur.</small>
    <em class="ac-why"><strong>Pourquoi :</strong> Un mouvement se mesure d’abord à son nombre. C’est ce qui fait qu’un élu accepte un rendez-vous et qu’un journaliste rappelle.</em>
  </a>
  <a class="action-card" href="/{lang}/groupes-locaux">
    <span class="ac-emoji">📍</span>
    <strong>Agir près de chez vous</strong>
    <small>Rejoignez ou lancez un groupe local.</small>
    <em class="ac-why"><strong>Pourquoi :</strong> Une action de rue touche des gens que nos publications n’atteindront jamais, et la presse locale couvre ce que la presse nationale ignore.</em>
  </a>
  <a class="action-card" href="/{lang}/relayer-nos-messages">
    <span class="ac-emoji">📣</span>
    <strong>Relayer nos messages</strong>
    <small>Partager nos publications, rejoindre Pause Action.</small>
    <em class="ac-why"><strong>Pourquoi :</strong> Partagé par une personne réelle, un message va bien plus loin que publié par une page. Votre compte vaut mieux que le nôtre.</em>
  </a>
  <a class="action-card" href="/recrutement">
    <span class="ac-emoji">🗣️</span>
    <strong>Convaincre votre entourage</strong>
    <small>Nos guides pour mobiliser efficacement autour de vous.</small>
    <em class="ac-why"><strong>Pourquoi :</strong> On change rarement d’avis en lisant un inconnu. On en change en parlant à quelqu’un en qui on a confiance.</em>
  </a>
</div>

<style>
  .action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1rem;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.1rem 1.25rem;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--bg-card);
    text-decoration: none;
    color: var(--text);
    transition:
      transform 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  /* Reprend le cadre de l'ancienne carte vedette : dans un bloc de trois,
     l'écriture aux élus reste l'action la plus efficace. */
  .action-card.primaire {
    border: 2px solid var(--brand);
    background: var(--brand-light);
  }

  .action-card:hover {
    transform: translateY(-2px);
    border-color: var(--brand);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  }

  .ac-why {
    margin-top: 0.15rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
    font-size: 0.84rem;
    font-style: normal;
    line-height: 1.5;
    color: var(--text-2);
  }

  .ac-emoji {
    font-size: 1.6rem;
  }

  .action-card strong {
    font-size: 1.02rem;
  }

  .action-card small {
    font-size: 0.88rem;
    line-height: 1.5;
    color: var(--text-2);
  }

</style>
