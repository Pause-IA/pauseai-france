<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { PageHero, SectionTitle } from '$components/ui'
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
     d'introduction au risque. -->
<PostMeta {title} {description} />
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="note">
	<PageHero eyebrow="Décideurs publics">
		{title}
		<svelte:fragment slot="lede">
			Les travaux sur lesquels nous nous appuyons, rassemblés en une page.
		</svelte:fragment>
	</PageHero>

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
		<section class="groupe" aria-labelledby="g-{groupe.id}">
			<h2 id="g-{groupe.id}">{groupe.titre}</h2>
			<ul class="refs">
				{#each groupe.references as r (r.url)}
					<li>
						<a href={r.url} target="_blank" rel="noopener noreferrer">
							<span class="ref-titre"
								>{r.titre}{#if r.francais}<span class="ref-langue">en français</span>{/if}</span
							>
							<span class="ref-meta">{r.meta}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}

	<section aria-labelledby="t-contact">
		<SectionTitle id="t-contact">Aller plus loin</SectionTitle>
		<p>
			Pause IA est l’antenne française de PauseAI, un mouvement international qui alerte sur le
			risque de perte de contrôle. Nous proposons aux élus et à leurs équipes un point
			d’information, sans jargon et sans engagement, adapté au temps dont vous disposez.
		</p>
		<div class="contact">
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
		</div>
	</section>

	<p class="avertissement">
		Liens et références vérifiés le {dateMaj}. Signalez-nous toute source devenue inaccessible ou
		dépassée.
	</p>
</div>

<style>
	/* Filet orange très atténué : il sépare les références sans découper la
	   page en lignes grises, et garde la couleur de marque présente. */
	.note {
		--filet-note: rgba(var(--brand-rgb), 0.4);

		max-width: 44rem;
		margin: 0 auto;
		padding: 0 1.5rem 1rem;
	}

	/* app.css espace les sections de 10rem, ce qui convient à une page de
	   campagne, pas à une liste de références. */
	.note :global(section:not(:last-child)) {
		margin-bottom: 0;
	}

	.note-langue {
		margin: -0.5rem 0 1.5rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.groupe {
		margin-top: 2.25rem;
	}

	.groupe h2 {
		font-size: 1.05rem;
		line-height: 1.3;
		margin: 0 0 0.5rem;
	}

	.refs {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.refs li {
		margin: 0;
		border-top: 1px solid var(--filet-note);
	}

	.refs li:last-child {
		border-bottom: 1px solid var(--filet-note);
	}

	.refs a {
		display: block;
		padding: 0.7rem 0;
		text-decoration: none;
		color: var(--text);
	}

	.refs a:hover .ref-titre,
	.refs a:focus-visible .ref-titre {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.ref-titre {
		display: block;
		font-weight: 600;
		line-height: 1.35;
	}

	.ref-meta {
		display: block;
		margin-top: 0.1rem;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--text-2);
	}

	/* Une seule exception signalée, plutôt que « en anglais » répété sur
	   vingt et une entrées sur vingt-deux. */
	.ref-langue {
		display: inline-block;
		margin-left: 0.5rem;
		padding: 0.08rem 0.4rem;
		border: 1px solid var(--border);
		border-radius: 3px;
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--text-2);
		vertical-align: 0.1em;
		white-space: nowrap;
	}

	.contact {
		margin-top: 2rem;
		padding: 1.75rem;
		border: 1px solid var(--border);
		border-top: 2px solid var(--brand);
	}

	.contact h3 {
		margin: 0 0 0.4rem;
		font-size: 1.15rem;
		line-height: 1.25;
		letter-spacing: -0.01em;
	}

	.contact :global(p) {
		margin: 0 0 1rem;
		color: var(--text-2);
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
		border-radius: 3px;
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
		margin-top: 3rem;
		padding-top: 1.5rem;
		padding-bottom: 3rem;
		border-top: 1px solid var(--filet-note);
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	@media (max-width: 40rem) {
		.contact {
			padding: 1.25rem;
		}
	}
</style>
