<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$lib/components/Button.svelte'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'
	import { page } from '$app/stores'

	$: lang = $page.params.lang as Lang
	$: t = getT(lang)
</script>

<PostMeta title={`${t.emploi_merci.title} | Pause IA`} description={t.emploi_merci.p1} />

<article class="thank-you-page">
	<div class="content">
		<h1>{t.emploi_merci.title}</h1>

		<div class="message">
			<p>
				{t.emploi_merci.p1}
			</p>

			<p>{t.emploi_merci.p2}</p>

			<ul>
				<li>{t.emploi_merci.li1}</li>
				<li>{t.emploi_merci.li2}</li>
				<li>{t.emploi_merci.li3}</li>
				<li>{t.emploi_merci.li4}</li>
			</ul>
		</div>

		<div class="cta-buttons">
			<Button href="https://pauseia.fr" target="_blank">{t.emploi_merci.visit_site}</Button>
			<Button href="https://discord.com/invite/YkKvW9APP9" target="_blank" alt>
				{t.emploi_merci.join_discord}
			</Button>
		</div>

		<div class="back-link">
			<a href="/{lang}/emploi-ia">{t.emploi_merci.back_link}</a>
		</div>
	</div>
</article>

<style>
	.thank-you-page {
		max-inline-size: var(--width-text);
		margin: 4rem auto;
		padding: 0 1rem;
	}

	.content {
		background-color: var(--bg);
		padding: 3rem;
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-card);
		text-align: center;
	}

	h1 {
		color: var(--brand-subtle);
		margin-top: 0;
		margin-bottom: 2rem;
	}

	.message {
		text-align: left;
		margin-bottom: 2rem;
	}

	.message p {
		margin-bottom: 1.5rem;
	}

	.message ul {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	.message li {
		margin: 0.75rem 0;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin: 2rem 0;
	}

	.back-link {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.back-link a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.95rem;
	}

	.back-link a:hover {
		color: var(--brand-subtle);
	}

	@media (max-width: 640px) {
		.content {
			padding: 2rem 1.5rem;
		}

		.cta-buttons {
			flex-direction: column;
		}

		.cta-buttons :global(button),
		.cta-buttons :global(a) {
			width: 100%;
		}
	}
</style>
