<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { PageHero } from '$components/ui'
	import { miseAJour, signataires, tribuneTitre } from '$lib/data/tribunes/le-monde-octobre-2026'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: title = isEn ? 'Signatories' : 'Signataires de la tribune'
	$: dateEdition = new Intl.DateTimeFormat(isEn ? 'en-GB' : 'fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(miseAJour))
</script>

<!-- Page demandée par la rédaction : la liste des signataires et rien d’autre
     (pas de texte de tribune, pas d’appel à l’action). Hors menu, hors sitemap
     et non indexée : on y arrive par le lien publié avec la tribune. -->
<PostMeta
	{title}
	description={isEn ? 'List of signatories of the op-ed.' : 'Liste des signataires de la tribune.'}
/>
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<PageHero>
		{title}
		<svelte:fragment slot="lede">
			{#if tribuneTitre}« {tribuneTitre} »<br />{/if}
			<time datetime={miseAJour}>
				{isEn ? `Updated ${dateEdition}` : `Mise à jour le ${dateEdition}`}
			</time>
		</svelte:fragment>
	</PageHero>

	{#if signataires.length}
		<ul class="signataires">
			{#each signataires as s}
				<li>
					<strong>{s.nom}</strong>{#if s.qualite}, {s.qualite}{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p class="attente">
			{isEn ? 'The list is being finalised.' : 'La liste est en cours de finalisation.'}
		</p>
	{/if}
</div>

<style>
	.page {
		inline-size: 100%;
		max-inline-size: var(--width-content);
		margin: 0 auto;
		padding: 2.5rem 1.5rem 5rem;
	}

	.signataires {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.signataires li {
		padding-block: 0.6rem;
		border-bottom: 1px solid var(--border);
		line-height: 1.5;
		color: var(--text-2);
	}

	.signataires strong {
		color: var(--text);
	}

	.attente {
		color: var(--text-2);
	}

	@media (max-width: 600px) {
		.page {
			padding: 2rem 1.1rem 4rem;
		}
	}
</style>
