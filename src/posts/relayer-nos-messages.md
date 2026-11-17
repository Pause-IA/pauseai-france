---
title: Relayer nos messages
rubrique: agir
chapo: 'Quelques minutes par semaine suffisent à porter la voix de Pause IA bien au-delà de notre cercle.'
description: 'Réseaux sociaux et Pause Action : quelques minutes par semaine pour faire porter la voix de Pause IA bien au-delà de notre cercle.'
---

<script lang="ts">
  import { page } from '$app/stores'
  import Socials from '$components/Socials.svelte'
  import { SectionTitle } from '$components/ui'
  import Button from '$components/Button.svelte'
  import RetourAgir from '$components/RetourAgir.svelte'
  $: lang = $page.params.lang ?? 'fr'
</script>

<SectionTitle id="reseaux">Suivez-nous, et relayez</SectionTitle>

Un partage, un commentaire, un « j'aime » suffisent à faire sortir une
publication de notre cercle.

<Socials />

Un partage commenté porte bien plus loin qu'un partage sec : ajoutez une phrase
à vous. Et sur LinkedIn, ajoutez Pause IA à votre profil, puis activez
« partager ces mises à jour avec votre réseau ».

<SectionTitle id="pause-action">Recevez une action par semaine</SectionTitle>

Une action concrète, expliquée en trois lignes, faisable en quelques minutes.
Par exemple :

- **Inviter un proche à une mobilisation**, avec un modèle de message à
  reprendre. 5 minutes.
- **Relayer une tribune parue dans la presse** : aimer, commenter et partager
  la publication sur un réseau. 3 minutes.
- **Écrire au courrier des lecteurs d'un journal** après un article qui
  minimise les risques, avec des conseils de rédaction et un exemple.
  10 minutes.

Vous faites celles qui vous parlent, vous laissez les autres.

<p>
  <Button href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU">Rejoindre Pause Action</Button>
</p>

<p class="precision">Groupe WhatsApp, une action par semaine, aucune obligation.</p>

<SectionTitle id="campagnes">Donnez de la voix pendant nos campagnes</SectionTitle>

C'est là qu'un relais compte le plus, parce que l'attention est déjà là.
Chaque campagne a sa page : ce que nous demandons, et ce que vous pouvez faire.

<p><Button href={`/${lang}/campagnes`}>Voir nos campagnes en cours</Button></p>

Vous voulez vous engager davantage que quelques minutes par semaine ?
[Rejoignez une équipe de bénévoles](/{lang}/rejoindre).

<RetourAgir {lang} />
