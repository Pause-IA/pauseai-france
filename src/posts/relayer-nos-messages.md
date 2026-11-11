---
title: Relayer nos messages
rubrique: agir
description: 'Réseaux sociaux et Pause Action : quelques minutes par semaine pour faire porter la voix de Pause IA bien au-delà de notre cercle.'
---

<script lang="ts">
  import { page } from '$app/stores'
  import { LinkCard, LinkGrid } from '$components/ui'
  import Socials from '$components/Socials.svelte'
  $: lang = $page.params.lang ?? 'fr'
</script>

Nos idées ne manquent pas de relais : elles manquent de volume. Plus nous sommes
nombreux à les porter, plus elles pèsent sur le débat public et sur les décisions
politiques. Trois façons d'y contribuer, en quelques minutes par semaine.

<LinkGrid min="14rem">
  <LinkCard href="#reseaux" icon="📣" title="Suivre et relayer nos réseaux sociaux">Un partage par semaine suffit à sortir le sujet de notre cercle.</LinkCard>
  <LinkCard href="#pause-action" icon="⚡" title="Faire partie de Pause Action">Une action concrète par semaine, en quelques minutes, sur WhatsApp.</LinkCard>
  <LinkCard href={`/${lang}/campagnes`} icon="🎯" title="Participer à nos campagnes">Nos mobilisations en cours, et comment y prendre part.</LinkCard>
</LinkGrid>

<h2 id="reseaux">Suivre et relayer nos réseaux sociaux</h2>

C'est l'engagement le plus court et le plus utile au quotidien : un partage, un
commentaire, un « j'aime » font sortir nos publications de notre cercle habituel.

Suivez-nous là où vous êtes déjà :

<div class="reseaux-page"><Socials /></div>

- Sur LinkedIn, ajoutez Pause IA à votre profil et activez « partager ces mises à
  jour avec votre réseau » : vos contacts professionnels verront passer le sujet.
- Relayez une publication par semaine, en ajoutant une phrase à vous. Un partage
  commenté porte bien plus loin qu'un partage sec.

<h2 id="pause-action">Rejoindre Pause Action</h2>

Pause Action est notre groupe WhatsApp d'actions rapides : chaque semaine, une
action concrète, expliquée en trois lignes, réalisable en quelques minutes :
signer, écrire, relayer, répondre à une consultation.

<a class="cta-ligne" href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU" target="_blank" rel="noopener noreferrer">
  <span>
    <strong>Rejoindre Pause Action</strong>
    <small>Groupe WhatsApp · une action par semaine · aucune obligation</small>
  </span>
  <span class="cta-fleche" aria-hidden="true">&rarr;</span>
</a>

<h2 id="campagnes">Participer à nos campagnes</h2>

Chaque campagne a sa page, avec ce qu'on demande et ce que vous pouvez faire :
écrire, signer, relayer, venir manifester. C'est le moment où un relais compte le
plus, parce que l'attention est déjà là.

<p class="renvoi-detail">
  <a href={`/${lang}/campagnes`}>Voir nos campagnes en cours &rarr;</a>
</p>

Vous voulez vous engager davantage ? <a href="/{lang}/rejoindre">Rejoignez une
équipe de bénévoles</a>, ou <a href="/{lang}/agir">découvrez toutes les façons d'agir</a>.

<style>
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
