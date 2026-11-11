<script lang="ts">
	import { openActivoiceForm } from '$lib/activoice'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: t = getT(data.lang)

	function openActivoice() {
		void openActivoiceForm(
			'activoice-embed-a0fa93be_f050_4d77_8a0c_9e70e3fe02b6',
			'a0fa93be-f050-4d77-8a0c-9e70e3fe02b6'
		)
	}
</script>

<svelte:head>
	<script src="https://activoice.online/embed/activoice-12.0.0.js"></script>
</svelte:head>

<PostMeta title={t.sommet.title} description={t.sommet.description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">{t.sommet.title}</UnderlinedTitle>
	</section>

	<section class="campaign-content">
		<div class="content-header">
			<p>{t.sommet.description}</p>
		</div>

		<div class="cta-container">
			<Button href="https://www.change.org/fr-ia-sommet-inde" target="_blank">
				{t.sommet.sign_petition}
			</Button>
			<Button on:click={openActivoice}>{t.sommet.contact_politicians}</Button>
		</div>

		<activoice-embed id="activoice-embed-a0fa93be_f050_4d77_8a0c_9e70e3fe02b6"></activoice-embed>
	</section>
</article>

<style>
	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: left;
		margin-bottom: 4rem;
	}

	.campaign-content {
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		padding: 3rem 2rem;
		border: 1px solid var(--border);
		box-shadow: var(--shadow-card);
		text-align: center;
		margin-bottom: 5rem;
	}

	.content-header {
		max-width: 45rem;
		margin: 0 auto 2rem;
	}

	.campaign-content p {
		font-size: 1.1rem;
		line-height: 1.7;
		margin-bottom: 0;
	}

	.cta-container {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 2rem;
	}

	@media (max-width: 600px) {
		.campaign-content {
			padding: 1.5rem;
		}

		.cta-container {
			flex-direction: column;
		}
	}
</style>
