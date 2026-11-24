<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Badge, Card, LinkCard, LinkGrid, Page, SectionTitle } from '$components/ui'
	import { Check, Copy } from 'lucide-svelte'
	import { miseAJour, references } from '$lib/data/ressources-decideurs'

	const CONTACT = 'contact@pauseia.fr'

	/* Objet et amorce pré-remplis : le frein, pour un collaborateur, n'est pas
	   de trouver l'adresse, c'est de savoir quoi écrire. L'objet nous sert
	   aussi à router la demande. Le corps reste neutre et se réécrit.
	   On garde l'adresse en clair et le bouton de copie juste en dessous :
	   « mailto: » n'ouvre rien chez qui lit son courrier dans un navigateur. */
	const SUJET = 'Demande de briefing : perte de contrôle de l’IA'
	const AMORCE = `Bonjour,

Je souhaiterais échanger avec vous au sujet du risque de perte de contrôle de l’intelligence artificielle.

`
	const lienCourriel = `mailto:${CONTACT}?subject=${encodeURIComponent(SUJET)}&body=${encodeURIComponent(AMORCE)}`

	const title = 'Ressources sur le risque de perte de contrôle de l’IA'
	const description =
		'Les travaux sur lesquels nous nous appuyons : déclarations officielles, enquêtes auprès des chercheurs, comportements observés en laboratoire, propositions parlementaires et pistes institutionnelles.'

	const dateMaj = new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(miseAJour))

	let copie = false
	let minuteur: ReturnType<typeof setTimeout>
	async function copierLAdresse() {
		try {
			await navigator.clipboard.writeText(CONTACT)
			copie = true
			clearTimeout(minuteur)
			minuteur = setTimeout(() => (copie = false), 2000)
		} catch {
			// Presse-papiers refusé : l'adresse reste visible et sélectionnable.
		}
	}
</script>

<!-- Page de plaidoyer, hors menu et hors sitemap : on partage son lien à la
     suite d'un rendez-vous, d'où le « noindex ».

     Elle ne cherche pas à convaincre : la personne qui la reçoit nous a déjà
     écoutés. Elle lui donne de quoi vérifier et approfondir par elle-même, et
     de quoi nous recontacter. L'argumentaire, lui, vit sur la page publique
     d'introduction au risque.

     Modèle « compilation » de la charte (Page width="wide", SectionTitle,
     LinkGrid, LinkCard, Card) : c'est une liste de destinations groupées par
     usage, pas un texte suivi. La page avait sa propre colonne de 44 rem, ses
     propres rayons et ses propres tailles de titre ; tout cela vient
     maintenant des composants et des jetons. -->
<PostMeta {title} {description} />
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<Page width="wide" eyebrow="Décideurs publics" {title}>
	<svelte:fragment slot="lede">
		Les travaux sur lesquels nous nous appuyons, rassemblés en une page.
	</svelte:fragment>

	<p>
		Rien ici ne vient de nous : chaque lien mène à sa source, pour que vous puissiez vérifier et
		vous forger votre propre opinion. Les ressources sont classées par usage, de la déclaration
		officielle citable au travail de fond.
	</p>
	<p class="note-langue">
		Sauf mention contraire, ces ressources sont en anglais : c’est la langue de la quasi-totalité
		des travaux de référence sur le sujet.
	</p>

	{#each references as groupe (groupe.id)}
		<section aria-labelledby="g-{groupe.id}">
			<SectionTitle id="g-{groupe.id}">{groupe.titre}</SectionTitle>
			<LinkGrid min="20rem">
				{#each groupe.references as r (r.url)}
					<LinkCard href={r.url} title={r.titre}>
						{r.meta}
						{#if r.francais}
							<span class="langue"><Badge variant="outline" size="sm">En français</Badge></span>
						{/if}
					</LinkCard>
				{/each}
			</LinkGrid>
		</section>
	{/each}

	<section aria-labelledby="t-contact">
		<SectionTitle id="t-contact">Aller plus loin</SectionTitle>
		<p>
			Pause IA est l’antenne française de PauseAI, un mouvement international qui alerte sur le
			risque de perte de contrôle. Nous proposons aux élus et à leurs équipes un point
			d’information, sans jargon et sans engagement, adapté au temps dont vous disposez.
		</p>
		<Card variant="accent">
			<h3>Demander un briefing ou un complément</h3>
			<p>Écrivez-nous ; nous revenons vers vous rapidement pour convenir d’un format.</p>
			<p class="action-contact">
				<Button href={lienCourriel}>Écrire à Pause IA</Button>
			</p>
			<p class="adresse">
				<a href="mailto:{CONTACT}">{CONTACT}</a>
				<button type="button" on:click={copierLAdresse}>
					{#if copie}
						<Check size={15} aria-hidden="true" /> Adresse copiée
					{:else}
						<Copy size={15} aria-hidden="true" /> Copier l’adresse
					{/if}
				</button>
			</p>
		</Card>
	</section>

	<p class="avertissement">
		Liens et références vérifiés le {dateMaj}. Signalez-nous toute source devenue inaccessible ou
		dépassée.
	</p>
</Page>

<style>
	/* app.css espace les sections de 5rem, ce qui convient à une page
	   éditoriale, pas à une suite de grilles : LinkGrid pose déjà sa propre
	   respiration de 2,5rem sous chaque groupe. */
	section:not(:last-of-type) {
		margin-bottom: 0;
	}

	.note-langue {
		margin-top: -0.5rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	/* La pastille est posée sous la phrase de la carte, pas à côté du titre :
	   un titre de référence tient souvent sur deux lignes, et la pastille
	   collée à sa fin se retrouvait seule sur la troisième. */
	.langue {
		display: block;
		margin-top: 0.5rem;
	}

	h3 {
		margin: 0 0 0.4rem;
	}

	.action-contact {
		margin: 0 0 1rem;
	}

	.adresse {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0;
	}

	.adresse button {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.6rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: none;
		font: inherit;
		font-size: 0.85rem;
		color: var(--text-2);
		cursor: pointer;
	}

	.adresse button:hover {
		border-color: var(--brand);
	}

	.avertissement {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		font-size: 0.85rem;
		color: var(--text-2);
	}
</style>
