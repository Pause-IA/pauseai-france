<script lang="ts">
	import type { SubscribeResponse } from '$lib/types'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	let email = ''
	let isSubmitting = false
	let message = ''
	let isError = false

	async function handleSubmit(event: Event) {
		event.preventDefault()
		message = ''
		isError = false

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			message = lang === 'en' ? 'Please enter a valid email address.' : 'Adresse e-mail invalide.'
			isError = true
			return
		}

		isSubmitting = true
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, subscribeNewsletter: true, source: 'homepage-cta' })
			})
			const result = (await res.json()) as SubscribeResponse
			if (res.ok) {
				message =
					lang === 'en'
						? (result.message ?? 'Subscribed!')
						: 'Inscription confirmée, à bientôt\u00a0!'
				isError = false
				email = ''
			} else {
				message =
					result.error ?? (lang === 'en' ? 'An error occurred.' : 'Une erreur est survenue.')
				isError = true
			}
		} catch {
			message = lang === 'en' ? 'Connection error. Please try again.' : 'Erreur de connexion.'
			isError = true
		} finally {
			isSubmitting = false
		}
	}
</script>

<section class="newsletter-cta">
	<div class="text">
		<p class="title">
			{lang === 'en' ? 'Stay informed' : 'Restez informé'}
		</p>
		<p class="desc">
			{#if lang === 'en'}
				Follow our work, get involved, and receive a monthly roundup of the latest AI news.
			{:else}
				Suivez nos actions, impliquez-vous et recevez chaque mois l’essentiel de l’actualité IA.
			{/if}
		</p>
	</div>
	<form on:submit={handleSubmit} class="form">
		<div class="input-row">
			<input
				type="email"
				bind:value={email}
				placeholder={lang === 'en' ? 'your@email.com' : 'votre@email.com'}
				disabled={isSubmitting}
				aria-label={lang === 'en' ? 'Email address' : 'Adresse e-mail'}
			/>
			<button type="submit" disabled={isSubmitting}>
				{#if isSubmitting}
					{lang === 'en' ? 'Subscribing…' : 'Inscription…'}
				{:else}
					{lang === 'en' ? 'Subscribe' : 'S’inscrire'}
				{/if}
			</button>
		</div>
		{#if message}
			<p class="feedback" class:error={isError} aria-live="polite">{message}</p>
		{/if}
	</form>
</section>

<style>
	.newsletter-cta {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem 1.75rem;
		background: var(--panneau-bg);
		border: 1px solid color-mix(in srgb, var(--brand) 35%, transparent);
		border-radius: 1.25rem;
		margin: 0 0 2rem;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.title {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		font-weight: 700;
		margin: 0;
		color: var(--text);
	}

	.desc {
		margin: 0;
		font-size: 1rem;
		color: var(--text-2);
		line-height: 1.5;
	}

	.form {
		width: 100%;
	}

	.input-row {
		display: flex;
		gap: 0.5rem;
	}

	input[type='email'] {
		flex: 1;
		padding: 0.65rem 1rem;
		border: 1.5px solid color-mix(in srgb, var(--brand) 40%, transparent);
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: 1rem;
		background: var(--bg);
		color: var(--text);
		min-width: 0;
	}

	input[type='email']:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 20%, transparent);
	}

	input[type='email']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	button[type='submit'] {
		padding: 0.65rem 1.5rem;
		background: var(--brand);
		color: var(--on-brand);
		border: none;
		border-radius: var(--radius-sm);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1rem;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.15s;
	}

	button[type='submit']:hover:not(:disabled) {
		opacity: 0.85;
	}

	button[type='submit']:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.feedback {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
	}

	.feedback.error {
		color: var(--error);
	}

	@media (min-width: 640px) {
		.newsletter-cta {
			padding: 2.25rem 2.5rem;
		}

		.title {
			font-size: 1.6rem;
		}
	}

	@media (min-width: 1024px) {
		.newsletter-cta {
			flex-direction: row;
			align-items: center;
			gap: 3rem;
			padding: 2.5rem 3rem;
		}

		.text {
			flex: 1;
		}

		.form {
			flex: 0 0 26rem;
		}
	}
</style>
