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
    <em class="ac-why"><strong>Why :</strong> Representatives count the messages they receive on a topic. On AI they receive very few, so yours carries real weight.</em>
  </a>
  <a class="action-card" href="/{lang}/declaration">
    <span class="ac-emoji">✍️</span>
    <strong>Sign the statement</strong>
    <small>Add your name to the call for a moratorium on the most dangerous AI systems.</small>
    <em class="ac-why"><strong>Why :</strong> In front of a decision-maker, the number of signatures is the argument you put on the table. A call carried by thousands is no longer one association’s opinion.</em>
  </a>
  <a class="action-card" href="/{lang}/dons">
    <span class="ac-emoji">💶</span>
    <strong>Make a donation</strong>
    <small>Every euro helps us act more, and faster.</small>
    <em class="ac-why"><strong>Why :</strong> We live on our members and donors. Every euro buys working time, travel, campaign materials.</em>
  </a>
</div>

## Going further

<div class="action-grid">
  <a class="action-card" href="/{lang}/rejoindre">
    <span class="ac-emoji">✊</span>
    <strong>Join Pause AI</strong>
    <small>Join the movement and help us grow.</small>
    <em class="ac-why"><strong>Why :</strong> A movement is measured first by its size. That is what makes an official grant a meeting and a journalist call back.</em>
  </a>
  <a class="action-card" href="/{lang}/groupes-locaux">
    <span class="ac-emoji">📍</span>
    <strong>Act near you</strong>
    <small>Join or start a local group.</small>
    <em class="ac-why"><strong>Why :</strong> A street action reaches people our posts never will, and the local press covers what national media ignore.</em>
  </a>
  <a class="action-card" href="/{lang}/relayer-nos-messages">
    <span class="ac-emoji">📣</span>
    <strong>Share our messages</strong>
    <small>Share our posts, join Pause Action.</small>
    <em class="ac-why"><strong>Why :</strong> Shared by a real person, a message travels much further than one posted by a page. Your account is worth more than ours.</em>
  </a>
  <a class="action-card" href="/sensibiliser-votre-entourage">
    <span class="ac-emoji">🗣️</span>
    <strong>Raise awareness around you</strong>
    <small>Our guides to mobilise effectively around you.</small>
    <em class="ac-why"><strong>Why :</strong> People rarely change their mind reading a stranger. They change it talking to someone they trust.</em>
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
