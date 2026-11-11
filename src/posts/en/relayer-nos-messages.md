---
title: Share our messages
rubrique: agir
description: "Social media and Pause Action: a few minutes a week to carry Pause AI’s voice far beyond our usual circle."
---

<script lang="ts">
  import { page } from '$app/stores'
  import Socials from '$components/Socials.svelte'
  $: lang = $page.params.lang ?? 'en'
</script>

Our posts circulate in a closed loop: they mostly reach people who already
agree with us. Your account reaches people we never will.

<ol class="actions">
<li>
<h2 id="reseaux">Follow us, and share</h2>

A share, a comment or a like is enough to take a post beyond our circle.

<div class="reseaux-page"><Socials /></div>

<p class="astuce">A commented share travels much further than a bare one: add a
sentence of your own. And on LinkedIn, add Pause IA to your profile, then turn
on “share these updates with your network”.</p>
</li>

<li>
<h2 id="pause-action">Get one action a week</h2>

One concrete action, explained in three lines, doable in a few minutes. For
instance:

<ul class="exemples">
  <li><strong>Invite someone you know to a march</strong>, using a ready-made
  message. 5 minutes.</li>
  <li><strong>Boost an op-ed published in the press</strong>: like, comment and
  share the post on one network. 3 minutes.</li>
  <li><strong>Write to a newspaper’s letters page</strong> after an article that
  plays down the risks, with drafting advice and a sample letter. 10
  minutes.</li>
</ul>

You do the ones that speak to you and skip the rest.

<a class="cta-ligne" href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU" target="_blank" rel="noopener noreferrer">
  <span>
    <strong>Join Pause Action</strong>
    <small>WhatsApp group · one action a week · no commitment</small>
  </span>
  <span class="cta-fleche" aria-hidden="true">&rarr;</span>
</a>
</li>

<li>
<h2 id="campagnes">Speak up during our campaigns</h2>

That is when a relay counts most, because the attention is already there.
Every campaign has its own page: what we ask for, and what you can do.

<p class="renvoi-detail">
  <a href={`/${lang}/campagnes`}>See our current campaigns &rarr;</a>
</p>
</li>
</ol>

<p class="plus-loin">Want to get more involved? <a href="/{lang}/rejoindre">Join a volunteer team</a>,
or <a href="/{lang}/agir">see all the ways to act</a>.</p>

<style>
  /* Trois actions réellement envoyées : la seule question qui retient
     quelqu'un avant de rejoindre le groupe est « concrètement, je reçois
     quoi ? ». Une promesse n'y répond pas, trois exemples oui. Ils disent la
     nature de l'action et son coût en minutes, jamais un événement ni une
     date : personne ne rouvrira cette page pour la rafraîchir. */
  .exemples {
    margin: 1rem 0 1.25rem;
    padding-left: 1.1rem;
  }

  .exemples li {
    margin-bottom: 0.6rem;
    font-size: 0.95rem;
    line-height: 1.55;
    color: var(--text-2);
  }

  .exemples strong {
    color: var(--text);
  }

  /* Trois actions numérotées plutôt qu'un essai en trois paragraphes : la
     page se parcourt d'un coup d'œil, et on voit tout de suite qu'il n'y a
     que trois choses à faire. Le filet orange et le chiffre reprennent le
     langage de la note de synthèse pour les décideurs. */
  .actions {
    margin: 2rem 0 2.5rem;
    padding: 0;
    list-style: none;
    counter-reset: action;
  }

  .actions > li {
    counter-increment: action;
    border-top: 2px solid var(--brand);
    padding-top: 1rem;
    margin-bottom: 2.75rem;
  }

  .actions > li :global(h2) {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-top: 0;
  }

  .actions > li :global(h2)::before {
    content: counter(action);
    font-size: 0.85em;
    font-weight: 700;
    color: var(--brand-subtle);
  }

  .astuce {
    font-size: 0.95rem;
    line-height: 1.55;
    color: var(--text-2);
  }

  .plus-loin {
    margin-top: 2.5rem;
  }

  /* Les sept réseaux étaient une phrase de liens séparés par des virgules :
     illisible, et rien n'indiquait de quel réseau il s'agissait avant de
     lire le nom. Le composant Socials du pied de page donne les logos, que
     tout le monde reconnaît d'un coup d'œil. Agrandis ici, parce que c'est
     l'action que la page demande, pas une mention de bas de page. */
  .reseaux-page {
    margin: 1.25rem 0 1.75rem;
  }

  .reseaux-page :global(.social) {
    justify-content: flex-start;
    gap: 0.9rem;
  }

  .reseaux-page :global(.social svg) {
    width: 2rem;
    height: 2rem;
  }

  .cta-ligne {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.35rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    text-decoration: none;
    color: var(--text);
    transition:
      transform 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .cta-ligne:hover {
    transform: translateY(-2px);
    border-color: var(--brand);
    box-shadow: var(--shadow-raised);
  }

  .cta-ligne span {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .cta-ligne small {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-2);
  }

  .cta-fleche {
    margin-inline-start: auto;
    font-size: 1.4rem;
    color: var(--brand-subtle);
    flex-shrink: 0;
  }

  .renvoi-detail a {
    display: inline-block;
    padding: 0.7rem 1.1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    text-decoration: none;
    color: var(--text);
  }

  .renvoi-detail a:hover {
    border-color: var(--brand);
  }
</style>
