---
title: All the ways to act
rubrique: agir
description: The most useful actions to help keep AI under control, from 5 minutes to a lasting commitment.
---

<script lang="ts">
  import { page } from '$app/stores'
  $: lang = $page.params.lang ?? 'en'
</script>

The number of people aware of AI risks is still small. You are now one of them, and **your actions carry more weight than you imagine.**

You don't need to devote your life to it: here are the most useful actions, from five minutes to a deeper commitment.

## In a few minutes

<div class="action-grid">
  <a class="action-card primaire" href="/{lang}/ecrire-a-mes-elus">
    <span class="ac-emoji">✉️</span>
    <strong>Write to your representatives</strong>
    <small>A ready-to-personalise email for your MP or your senator. It's short, and far more effective than a petition: a message from a real citizen gets read and counted.</small>
  </a>
  <a class="action-card" href="/{lang}/declaration">
    <span class="ac-emoji">✍️</span>
    <strong>Sign the statement</strong>
    <small>Add your name to the call for a moratorium on the most dangerous AI systems.</small>
  </a>
  <a class="action-card" href="/{lang}/dons">
    <span class="ac-emoji">💶</span>
    <strong>Make a donation</strong>
    <small>Every euro helps us act more, and faster.</small>
  </a>
</div>

## Going further

<div class="action-grid">
  <a class="action-card" href="/{lang}/rejoindre">
    <span class="ac-emoji">✊</span>
    <strong>Join Pause AI</strong>
    <small>Join the movement and help us grow.</small>
  </a>
  <a class="action-card" href="/{lang}/groupes-locaux">
    <span class="ac-emoji">📍</span>
    <strong>Act near you</strong>
    <small>Join or start a local group.</small>
  </a>
  <a class="action-card" href="/{lang}/relayer-nos-messages">
    <span class="ac-emoji">📣</span>
    <strong>Share our messages</strong>
    <small>Share our posts, join Pause Action.</small>
  </a>
  <a class="action-card" href="/recrutement">
    <span class="ac-emoji">🗣️</span>
    <strong>Convince those around you</strong>
    <small>Our guides to mobilise effectively around you.</small>
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
