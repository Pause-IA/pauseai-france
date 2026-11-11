<script lang="ts">
	import PostMeta from '$lib/components/PostMeta.svelte'
	import UnderlinedTitle from '$lib/components/UnderlinedTitle.svelte'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)
	$: prefix = lang === 'en' ? '/en' : '/fr'
</script>

<PostMeta title={t.merci.meta_title} description={t.merci.meta_desc} />

<main class="container">
	<section class="success-content">
		<UnderlinedTitle>{t.merci.title}</UnderlinedTitle>

		<div class="success-message">
			<div class="success-icon">✅</div>
			<h2>{t.merci.success_title}</h2>
			<p>{t.merci.success_p1}</p>
			<p>{t.merci.success_p2}</p>
		</div>

		<div class="next-steps">
			<h3>{t.merci.next_steps}</h3>
			<ul>
				<li>{t.merci.step_newsletter}</li>
				<li>{t.merci.step_social}</li>
				<li>{t.merci.step_share}</li>
				<li>{t.merci.step_action}</li>
			</ul>
		</div>

		<div class="return-link">
			<a href={prefix}>{t.merci.back_home}</a>
		</div>
	</section>
</main>

<style>
	.container {
		max-inline-size: var(--width-content);
		margin: 0 auto;
		padding: 2rem;
	}

	.success-content {
		text-align: center;
	}

	.success-message {
		background: var(--white);
		border-radius: var(--radius-md);
		padding: 3rem 2rem;
		box-shadow: var(--shadow-raised);
		margin: 2rem 0;
	}

	.success-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.success-message h2 {
		color: var(--brand-subtle);
		margin-bottom: 1.5rem;
		font-size: 1.75rem;
	}

	.success-message p {
		color: var(--text);
		line-height: 1.6;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.next-steps {
		background: var(--bg);
		border-radius: var(--radius-md);
		padding: 2rem;
		margin: 2rem 0;
		border: 2px solid var(--brand-light);
	}

	.next-steps h3 {
		color: var(--brand-subtle);
		margin-bottom: 1rem;
	}

	.next-steps ul {
		list-style: none;
		padding: 0;
		text-align: left;
		display: inline-block;
	}

	.next-steps li {
		color: var(--text);
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
	}

	.return-link {
		margin-top: 2rem;
	}

	.return-link a {
		color: var(--brand-subtle);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
		border: 2px solid var(--brand);
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-sm);
		transition: all 0.3s;
	}

	.return-link a:hover {
		background-color: var(--brand);
		color: var(--on-brand);
	}
</style>
