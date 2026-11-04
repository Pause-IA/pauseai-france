---
title: Relayer nos messages
rubrique: agir
description: 'Réseaux sociaux et Pause Action : quelques minutes par semaine pour faire porter la voix de Pause IA bien au-delà de notre cercle.'
---

<script lang="ts">
  import { page } from '$app/stores'
  $: lang = $page.params.lang ?? 'fr'
</script>

Nos idées ne manquent pas de relais : elles manquent de volume. Plus nous sommes
nombreux à les porter, plus elles pèsent sur le débat public et sur les décisions
politiques. Deux façons d'y contribuer, en quelques minutes par semaine.

## Suivre et relayer nos réseaux sociaux

C'est l'engagement le plus court et le plus utile au quotidien : un partage, un
commentaire, un « j'aime » font sortir nos publications de notre cercle habituel.

- Suivez-nous sur [LinkedIn](https://www.linkedin.com/company/pause-ia/),
  [Twitter/X](https://twitter.com/pause_ia),
  [Facebook](https://www.facebook.com/Pause.IA),
  [Instagram](https://www.instagram.com/pause_ia),
  [TikTok](https://www.tiktok.com/@pause_ia),
  [Threads](https://www.threads.net/@pause_ia) et
  [YouTube](https://www.youtube.com/@Pause_IA).
- Sur LinkedIn, ajoutez Pause IA à votre profil et activez « partager ces mises à
  jour avec votre réseau » : vos contacts professionnels verront passer le sujet.
- Relayez une publication par semaine, en ajoutant une phrase à vous. Un partage
  commenté porte bien plus loin qu'un partage sec.

## Rejoindre Pause Action

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

Vous voulez vous engager davantage ? <a href="/{lang}/rejoindre">Rejoignez une
équipe de bénévoles</a>, ou <a href="/{lang}/agir">découvrez toutes les façons d'agir</a>.

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
</style>
