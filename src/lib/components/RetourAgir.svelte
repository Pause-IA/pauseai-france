<script lang="ts">
	/**
	 * Renvoi vers « Toutes les façons d'agir », en pied des pages du menu Agir.
	 * Chacune de ces pages ne propose qu'une action : sans ce renvoi, on en
	 * ressort sans savoir qu'il en existe d'autres.
	 *
	 * Un seul composant plutôt qu'un bloc recopié sur chaque page : le bouton
	 * « léger » est la variante `alt` de Button, déjà dans la charte.
	 */
	import Button from '$components/Button.svelte'
	import { getT, type Lang } from '$lib/i18n'

	export let lang: Lang

	$: t = getT(lang)
	$: prefix = lang === 'en' ? '/en' : '/fr'
</script>

<p class="retour-agir">
	<Button alt href="{prefix}/agir">{t.nav.toutes_facons_agir} &rarr;</Button>
</p>

<style>
	.retour-agir {
		margin: 3rem 0 0;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
		text-align: center;
	}
</style>
