---
title: Share our messages
rubrique: agir
chapo: 'A few minutes a week are enough to carry Pause IA’s voice far beyond our usual circle.'
description: 'Social media and Pause Action: a few minutes a week to carry Pause AI’s voice far beyond our usual circle.'
---

<script lang="ts">
  import { page } from '$app/stores'
  import Socials from '$components/Socials.svelte'
  import { SectionTitle, LinkGrid, LinkCard } from '$components/ui'
  $: lang = $page.params.lang ?? 'en'
</script>

<SectionTitle id="reseaux">Follow us, and share</SectionTitle>

A share, a comment or a like is enough to take a post beyond our circle.

<Socials />

A commented share travels much further than a bare one: add a sentence of your
own. And on LinkedIn, add Pause IA to your profile, then turn on “share these
updates with your network”.

<SectionTitle id="pause-action">Get one action a week</SectionTitle>

One concrete action, explained in three lines, doable in a few minutes. For
instance:

- **Invite someone you know to a march**, using a ready-made message.
  5 minutes.
- **Boost an op-ed published in the press**: like, comment and share the post
  on one network. 3 minutes.
- **Write to a newspaper’s letters page** after an article that plays down the
  risks, with drafting advice and a sample letter. 10 minutes.

You do the ones that speak to you and skip the rest.

<LinkGrid min="100%">
  <LinkCard href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU" title="Join Pause Action" icon="📣" featured>
    WhatsApp group · one action a week · no commitment
  </LinkCard>
</LinkGrid>

<SectionTitle id="campagnes">Speak up during our campaigns</SectionTitle>

That is when a relay counts most, because the attention is already there.
Every campaign has its own page: what we ask for, and what you can do.

<LinkGrid>
  <LinkCard href={`/${lang}/campagnes`} title="Our current campaigns" icon="🗂️">
    What we ask for, and what you can do.
  </LinkCard>
  <LinkCard href={`/${lang}/rejoindre`} title="Join a volunteer team" icon="🤝">
    For more than a few minutes a week.
  </LinkCard>
  <LinkCard href={`/${lang}/agir`} title="All the ways to act" icon="🧭">
    From 5 minutes to a lasting commitment.
  </LinkCard>
</LinkGrid>
