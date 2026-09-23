<script lang="ts">
	// Liste complète des signataires de la déclaration PauseAI (pauseia.fr +
	// PauseAI Global), avec recherche et filtres.
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { PageHero } from '$components/ui'
	import SignatoryList from '$components/declaration/SignatoryList.svelte'
	import { counts, loadDeclaration, toEntries, type DeclarationData } from '$lib/declaration'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = `/${data.lang}`
	$: title = isEn
		? 'Signatories of the PauseAI statement'
		: 'Les signataires de la déclaration PauseAI'
	$: description = isEn
		? 'Everyone who signed the PauseAI statement for an international treaty on AI, and why it matters to them.'
		: 'Toutes les personnes qui ont signé la déclaration PauseAI pour un traité international sur l’IA, et pourquoi c’est important pour elles.'

	let d: DeclarationData | null = null
	onMount(async () => {
		d = await loadDeclaration()
	})
	$: entries = d ? toEntries(d) : []
	$: c = d ? counts(d) : null
	const fmt = (n: number) => n.toLocaleString(isEn ? 'en-GB' : 'fr-FR')
	const fmtDate = (iso: string) =>
		new Date(iso).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
</script>

<PostMeta {title} {description} />

<article>
	<PageHero>
		{isEn ? 'The signatories' : 'Les signataires'}
		<svelte:fragment slot="lede">
			{#if c?.worldCount != null}
				{#if isEn}
					{fmt(c.worldCount)} people have signed the PauseAI statement worldwide, including
					{fmt(c.franceCount)} in France. Discover who they are and why it matters to them.
				{:else}
					{fmt(c.worldCount)} personnes ont signé la déclaration PauseAI dans le monde, dont
					{fmt(c.franceCount)} en France. Découvrez qui elles sont et pourquoi c’est important pour elles.
				{/if}
			{:else if isEn}
				Discover who signed the PauseAI statement and why it matters to them.
			{:else}
				Découvrez qui a signé la déclaration PauseAI et pourquoi c’est important pour eux.
			{/if}
		</svelte:fragment>
		<div slot="actions" class="actions">
			<Button href="{prefix}/declaration#signer">
				{isEn ? 'Sign the statement' : 'Signer la déclaration'}
			</Button>
			<a href="{prefix}/declaration">{isEn ? 'Read the statement' : 'Lire la déclaration'}</a>
		</div>
	</PageHero>

	<section data-pagefind-ignore>
		{#if d}
			<SignatoryList {entries} lang={data.lang} />
			<p class="legal">
				{#if isEn}
					Includes the signatories collected by PauseAI Global on
					<a href="https://pauseai.info/statement" target="_blank" rel="noopener">pauseai.info</a
					>{#if d.globalFromSnapshot && d.global?.fetchedAt}&nbsp;(list as of {fmtDate(
							d.global.fetchedAt
						)}){/if}. Signatories who chose not to show their name appear as “Anonymous”.
				{:else}
					Inclut les signataires recueillis par PauseAI Global sur
					<a href="https://pauseai.info/statement" target="_blank" rel="noopener">pauseai.info</a
					>{#if d.globalFromSnapshot && d.global?.fetchedAt}&nbsp;(liste au {fmtDate(
							d.global.fetchedAt
						)}){/if}. Les signataires qui n’ont pas souhaité afficher leur nom apparaissent comme «
					Anonyme ».
				{/if}
			</p>
		{:else}
			<p class="loading">{isEn ? 'Loading signatories…' : 'Chargement des signataires…'}</p>
		{/if}
	</section>
</article>

<style>
	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.25rem;
		margin-top: 1.5rem;
	}

	.legal,
	.loading {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.6;
		margin-top: 1.5rem;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
