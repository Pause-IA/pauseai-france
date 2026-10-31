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

## L'action la plus utile, en 5 minutes

<a class="lead-action" href="/{lang}/ecrire-a-mes-elus">
  <span class="lead-emoji">✉️</span>
  <span class="lead-text">
    <strong>Écrire à mes élus et à la presse</strong>
    <small>Un email prêt à personnaliser pour votre député, votre sénateur ou une grande rédaction. C'est court, et bien plus efficace qu'une pétition : un message d'un vrai citoyen est lu et compté.</small>
  </span>
  <span class="lead-arrow" aria-hidden="true">→</span>
</a>

## Les actions qui comptent le plus

<div class="action-grid">
  <a class="action-card" href="/{lang}/rejoindre">
    <span class="ac-emoji">✊</span>
    <strong>Rejoindre Pause IA</strong>
    <small>Rejoignez le mouvement et aidez-nous à prendre de l'ampleur.</small>
  </a>
  <a class="action-card" href="/{lang}/groupes-locaux">
    <span class="ac-emoji">📍</span>
    <strong>Agir près de chez vous</strong>
    <small>Rejoignez ou lancez un groupe local.</small>
  </a>
  <a class="action-card" href="/{lang}/relayer-nos-messages">
    <span class="ac-emoji">📣</span>
    <strong>Relayer nos messages</strong>
    <small>Partager nos publications, rejoindre Pause Action.</small>
  </a>
  <a class="action-card" href="/{lang}/dons">
    <span class="ac-emoji">💶</span>
    <strong>Faire un don</strong>
    <small>Chaque euro nous aide à agir plus et plus vite.</small>
  </a>
  <a class="action-card" href="/recrutement">
    <span class="ac-emoji">🗣️</span>
    <strong>Convaincre votre entourage</strong>
    <small>Nos guides pour mobiliser efficacement autour de vous.</small>
  </a>
</div>

<style>
  .lead-action {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border: 2px solid var(--brand);
    border-radius: 16px;
    background: var(--brand-light);
    text-decoration: none;
    color: var(--text);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .lead-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }

  .lead-emoji {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .lead-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .lead-text strong {
    font-size: 1.15rem;
  }

  .lead-text small {
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--text-2);
  }

  .lead-arrow {
    margin-left: auto;
    font-size: 1.5rem;
    color: var(--brand-subtle);
    flex-shrink: 0;
  }

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

  .action-card:hover {
    transform: translateY(-2px);
    border-color: var(--brand);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
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
