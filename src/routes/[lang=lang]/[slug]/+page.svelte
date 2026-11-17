<script lang="ts">
	import type { PageData } from './$types'
	import PostMeta from '$components/PostMeta.svelte'
	import { Page } from '$components/ui'
	import { getT } from '$lib/i18n'

	import { title as siteName } from '$config'

	export let data: PageData

	const { metadata, slug, content } = data
	const { title = slug, date, description, image, original, rubrique, chapo, modele } = metadata

	// Modèle de page, choisi dans le frontmatter (« modele: standard »).
	//
	// Par défaut « note » : la plupart de ces pages sont des textes longs qui
	// se lisent d'un bout à l'autre (charte des valeurs, mentions légales,
	// guide de sensibilisation), et la colonne de lecture étroite est faite
	// pour cela. Mais quelques-unes sont des hubs — une liste de cartes vers
	// d'autres pages — et une grille de cartes dans une colonne de 44 rem est
	// à l'étroit. Celles-là déclarent « modele: standard ».
	const standard = String(modele ?? '') === 'standard'

	// Surtitre : la rubrique du menu (frontmatter « rubrique: agir »…), qui
	// rattache la page à sa section. Clés : comprendre, agir, campagnes,
	// actualites, apropos.
	$: t = getT(data.lang)
	$: eyebrow = rubrique ? (t.nav as Record<string, string>)[String(rubrique)] : undefined
</script>

<PostMeta title={`${title} | ${siteName}`} {description} {date} {image} />

<Page
	{title}
	{eyebrow}
	lede={chapo ? String(chapo) : undefined}
	width={standard ? 'content' : 'text'}
	variant={standard ? 'standard' : 'note'}
	as="article"
>
	<div class="prose">
		<svelte:component this={content} />
	</div>
	{#if original}
		<footer>
			Adaptée de '<a href={original.url}>{original.title}</a>' par PauseAI, sous
			<a
				href="https://creativecommons.org/licenses/by/4.0/deed.fr"
				target="_blank"
				rel="noopener noreferrer">licence CC BY 4.0</a
			>.
		</footer>
	{/if}
</Page>

<style>
	footer {
		color: var(--text-secondary);
		font-size: 0.8rem;
		margin-top: 4rem;
	}
</style>
