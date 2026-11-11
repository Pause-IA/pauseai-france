---
title: Relayer nos messages
rubrique: agir
description: 'Réseaux sociaux et Pause Action : quelques minutes par semaine pour faire porter la voix de Pause IA bien au-delà de notre cercle.'
---

<script lang="ts">
  import { page } from '$app/stores'
  import Socials from '$components/Socials.svelte'
  $: lang = $page.params.lang ?? 'fr'
</script>

Nos publications tournent en vase clos : elles touchent surtout des gens déjà
convaincus. Votre compte, lui, atteint des gens que nous n'atteindrons jamais.

<ol class="actions">
<li>
<h2 id="reseaux">Suivez-nous, et relayez</h2>

Un partage, un commentaire, un « j'aime » suffisent à faire sortir une
publication de notre cercle.

<div class="reseaux-page"><Socials /></div>

<p class="astuce">Un partage commenté porte bien plus loin qu’un partage sec :
ajoutez une phrase à vous. Et sur LinkedIn, ajoutez Pause IA à votre profil,
puis activez « partager ces mises à jour avec votre réseau ».</p>
</li>

<li>
<h2 id="pause-action">Recevez une action par semaine</h2>

Une action concrète, expliquée en trois lignes, faisable en quelques minutes.
Ces dernières semaines, le groupe a reçu :

<ul class="exemples">
  <li><strong>Inviter une personne à la marche du 14 novembre</strong> : contacter
  un proche en Île-de-France, avec un modèle de message à reprendre. 5 minutes.</li>
  <li><strong>Donner de la visibilité à notre tribune dans <i>Le Monde</i></strong> :
  aimer, commenter et partager la publication sur un réseau. 3 minutes.</li>
  <li><strong>Écrire au courrier des lecteurs du <i>Monde</i></strong> après une
  interview affirmant que l’IA « se contrôle » sans contrepoint scientifique,
  avec des conseils de rédaction et un exemple. 10 minutes.</li>
</ul>

Vous faites celles qui vous parlent, vous laissez les autres.

<a class="cta-ligne" href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU" target="_blank" rel="noopener noreferrer">
  <span>
    <strong>Rejoindre Pause Action</strong>
    <small>Groupe WhatsApp · une action par semaine · aucune obligation</small>
  </span>
  <span class="cta-fleche" aria-hidden="true">&rarr;</span>
</a>
</li>

<li>
<h2 id="campagnes">Donnez de la voix pendant nos campagnes</h2>

C'est là qu'un relais compte le plus, parce que l'attention est déjà là.
Chaque campagne a sa page : ce que nous demandons, et ce que vous pouvez faire.

<p class="renvoi-detail">
  <a href={`/${lang}/campagnes`}>Voir nos campagnes en cours &rarr;</a>
</p>
</li>
</ol>

<p class="plus-loin">Vous voulez vous engager davantage ? <a href="/{lang}/rejoindre">Rejoignez une
équipe de bénévoles</a>, ou <a href="/{lang}/agir">découvrez toutes les façons d’agir</a>.</p>

<style>
  /* Trois actions réellement envoyées : la seule question qui retient
     quelqu'un avant de rejoindre le groupe est « concrètement, je reçois
     quoi ? ». Une promesse n'y répond pas, trois exemples datés oui. */
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
