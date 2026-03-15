<script lang="ts">
	import Logo from './Logo.svelte'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let lang: Lang = 'fr'

	$: t = getT(lang)
</script>

<a href="/{lang}/emploi-ia/questionnaire" title={t.emploi_ia.survey_card_title_attr}>
	<h3>{t.emploi_ia.survey_card_title}</h3>
	<div class="logo"><Logo fill_circle="white" fill_ai="white" emploi_ia={true} /></div>
	<p>{t.emploi_ia.survey_card_text}</p>
</a>

<style>
	h3 {
		color: var(--text);
	}

	p {
		color: white;
	}

	.logo {
		width: 16rem;
		height: 10rem;
	}

	a {
		display: flex;
		background-color: #ff9416;
		text-decoration: none;
		max-width: 500px;
		height: 200px;
		flex-direction: column;
		justify-content: center;
		padding: 1rem;
		margin: 5rem 0;
		border-radius: 16px;
		transition: transform 150ms ease;
	}

	a:hover {
		transform: translateY(-2px);
	}
</style>
