---
title: Share our messages
rubrique: agir
description: "Social media and Pause Action: a few minutes a week to carry Pause AI's voice far beyond our usual circle."
---

<script lang="ts">
  import { page } from '$app/stores'
  import { LinkCard, LinkGrid } from '$components/ui'
  $: lang = $page.params.lang ?? 'en'
</script>

Our posts mostly reach people who already agree with us. Getting beyond that
circle takes other accounts sharing them, and yours is worth more than ours.
Three ways to do it, in a few minutes a week.

<LinkGrid min="14rem">
  <LinkCard href="#reseaux" icon="📣" title="Follow and share our social media">One share a week is enough to take the topic beyond our circle.</LinkCard>
  <LinkCard href="#pause-action" icon="⚡" title="Join Pause Action">One concrete action a week, in a few minutes, on WhatsApp.</LinkCard>
  <LinkCard href={`/${lang}/campagnes`} icon="🎯" title="Take part in our campaigns">Our current mobilisations, and how to join them.</LinkCard>
</LinkGrid>

<h2 id="reseaux">Follow and share our social media</h2>

This is the shortest and most useful day-to-day commitment: a share, a comment or
a like takes our posts beyond our usual circle.

- Follow us on [LinkedIn](https://www.linkedin.com/company/pause-ia/),
  [Twitter/X](https://twitter.com/pause_ia),
  [Facebook](https://www.facebook.com/Pause.IA),
  [Instagram](https://www.instagram.com/pause_ia),
  [TikTok](https://www.tiktok.com/@pause_ia),
  [Threads](https://www.threads.net/@pause_ia) and
  [YouTube](https://www.youtube.com/@Pause_IA).
- On LinkedIn, add Pause IA to your profile and turn on "share these updates with
  your network": your professional contacts will see the topic come up.
- Share one post a week, adding a sentence of your own. A commented share travels
  much further than a bare one.

<h2 id="pause-action">Join Pause Action</h2>

Pause Action is our WhatsApp group for quick actions: every week, one concrete
action, explained in three lines, doable in a few minutes: sign, write, share,
respond to a consultation.

<a class="cta-ligne" href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU" target="_blank" rel="noopener noreferrer">
  <span>
    <strong>Join Pause Action</strong>
    <small>WhatsApp group · one action a week · no commitment</small>
  </span>
  <span class="cta-fleche" aria-hidden="true">&rarr;</span>
</a>

<h2 id="campagnes">Take part in our campaigns</h2>

Every campaign has its own page, with what we are asking for and what you can do:
write, sign, share, come and march. That is when a relay counts most, because the
attention is already there.

<p class="renvoi-detail">
  <a href={`/${lang}/campagnes`}>See our current campaigns &rarr;</a>
</p>

Want to get more involved? <a href="/{lang}/rejoindre">Join a volunteer team</a>,
or <a href="/{lang}/agir">see all the ways to act</a>.

<style>
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
