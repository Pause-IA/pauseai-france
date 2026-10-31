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

## The most useful action, in 5 minutes

<a class="lead-action" href="/{lang}/ecrire-a-mes-elus">
  <span class="lead-emoji">✉️</span>
  <span class="lead-text">
    <strong>Write to your representatives and the press</strong>
    <small>A ready-to-personalise email for your MP, your senator or a major newsroom. It's short, and far more effective than a petition: a message from a real citizen gets read and counted.</small>
  </span>
  <span class="lead-arrow" aria-hidden="true">→</span>
</a>

## The actions that matter most

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
  <a class="action-card" href="/{lang}/dons">
    <span class="ac-emoji">💶</span>
    <strong>Donate</strong>
    <small>Every euro helps us act more and faster.</small>
  </a>
  <a class="action-card" href="/recrutement">
    <span class="ac-emoji">🗣️</span>
    <strong>Convince those around you</strong>
    <small>Our guides to mobilise people effectively.</small>
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
