<script lang="ts">
	import ExternalLink from '$components/custom/a.svelte'
	import Logo from '$components/Logo.svelte'
	import Socials from '$components/Socials.svelte'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import { theme } from '$lib/stores/theme'

	export let lang: Lang = 'fr'

	$: t = getT(lang)
	$: prefix = lang === 'fr' ? '/fr' : '/en'

	let email = ''
	let isSubmitting = false
	let message = ''
	let isError = false

	interface ApiResponse {
		success?: boolean
		message?: string
		error?: string
	}

	async function handleNewsletterSubmit(event: Event) {
		event.preventDefault()
		message = ''
		isError = false

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			message = t.footer.newsletter_invalid_email
			isError = true
			return
		}

		isSubmitting = true

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					subscribeNewsletter: true,
					subscribeSubstack: false,
					source: 'footer'
				})
			})

			const result = (await response.json()) as ApiResponse

			if (response.ok) {
				message = t.footer.newsletter_success
				isError = false
				email = ''
			} else {
				message = result.error ?? t.footer.newsletter_error
				isError = true
			}
		} catch {
			message = t.footer.newsletter_connection_error
			isError = true
		} finally {
			isSubmitting = false
		}
	}
</script>

<footer>
	<div class="brand">
		<a href={prefix} class="logo">
			<div class="logo">
				<Logo
					animate
					fill_pause={$theme === 'dark' ? '#f0ede8' : 'black'}
					fill_circle="white"
					fill_ai={$theme === 'dark' ? '#f0ede8' : 'white'}
				/>
			</div>
		</a>
	</div>
	<div id="newsletter" class="newsletter-section">
		<h2>{t.footer.newsletter_title}</h2>
		<p class="newsletter-desc">{t.footer.newsletter_desc}</p>
		<form on:submit={handleNewsletterSubmit} class="newsletter-form">
			<div class="input-group">
				<input
					type="email"
					bind:value={email}
					placeholder={t.footer.newsletter_placeholder}
					disabled={isSubmitting}
					aria-label={t.footer.newsletter_placeholder}
				/>
				<button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}{t.footer.newsletter_loading}{:else}{t.footer.newsletter_subscribe}{/if}
				</button>
			</div>
			{#if message}
				<p class="newsletter-message" class:error={isError} class:success={!isError}>
					{message}
				</p>
			{/if}
		</form>
	</div>
	<div class="socials">
		<h2>{t.footer.follow_us}</h2>
		<Socials />
	</div>
	<div class="footer-links">
		<div class="column">
			<h2>{t.footer.nav_title}</h2>
			<a href="{prefix}#faq">{t.footer.faq}</a>
			<a href="{prefix}/propositions">{t.footer.propositions}</a>
			<a href="{prefix}/newsletters">{t.footer.newsletters}</a>
			<a href="https://pauseia.substack.com/">{t.footer.blog}</a>
			<ExternalLink href="https://fresquedesrisquesdelia.org/" target="_blank"
				>{t.footer.fresque}</ExternalLink
			>
			<a href="{prefix}/agir">{t.footer.agir}</a>
			<a href="{prefix}/dons">{t.footer.donner}</a>
			<a href="{prefix}/rejoindre">{t.footer.rejoindre}</a>
			<a href="{prefix}/qui-sommes-nous">{t.footer.qui_sommes_nous}</a>
		</div>
		<div class="column">
			<h2>{t.footer.act_title}</h2>
			<a href="{prefix}/ecrire-a-mes-elus">{t.footer.ecrire_elus}</a>
			<a href="{prefix}/declaration">{t.footer.declaration}</a>
			<a href="{prefix}/rejoindre">{t.footer.join_pauseia}</a>
			<a href="{prefix}/agir">{t.footer.how_to_help}</a>
			<a href="{prefix}/dons">{t.footer.make_donation}</a>
			<ExternalLink href="https://pauseai-shop.fourthwall.com" target="_blank"
				>{t.footer.merchandise}</ExternalLink
			>
			<a href="https://pauseai.info/protests">{t.footer.protests}</a>
			<a href="{prefix}/recrutement-emploi">{t.footer.jobs}</a>
		</div>
		<div class="column">
			<h2>{t.footer.other_title}</h2>
			<a href="{prefix}/presse">{t.footer.press}</a>
			<a href="{prefix}/financements">{t.footer.funding}</a>
			<a href="{prefix}/mentions-legales">{t.footer.legal}</a>
			<a href="{prefix}/politique-de-confidentialite">{t.footer.privacy}</a>
			<a href="{prefix}/charte-des-valeurs">{t.footer.values}</a>
			<ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank"
				>{t.footer.license}</ExternalLink
			>
		</div>
	</div>
</footer>

<style>
	footer {
		/* Aplat orange de marque, identique dans les deux thèmes : le texte y
		   est donc foncé et fixe (7,9:1), pas la couleur d'encre de la page. */
		background-color: var(--brand);
		color: var(--on-brand);
		display: flex;
		flex-direction: column;
		gap: 2rem;
		overflow: hidden;
		padding: 2rem;
		font-size: 1rem;
	}

	.logo {
		height: 66px;
	}

	.socials {
		display: flex;
		flex-direction: column;
		align-items: start;
	}

	.footer-links {
		display: flex;
		gap: 2.5rem;
		flex-direction: column;
	}

	.brand,
	.socials,
	.column {
		gap: 0.5rem;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	h2 {
		font-size: 1.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		margin-bottom: 0rem;
		margin-top: 0;
	}

	.footer-links :global(a) {
		color: inherit;
		text-decoration: none;
		opacity: 0.85;
	}

	.footer-links :global(a:hover) {
		text-decoration: underline;
	}

	/* Newsletter section styles */
	.newsletter-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.newsletter-desc {
		margin: 0;
		font-size: 0.95rem;
		opacity: 0.9;
	}

	.newsletter-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.input-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.newsletter-form input[type='email'] {
		flex: 1;
		min-width: 180px;
		padding: 0.6rem 0.75rem;
		border: 2px solid rgba(0, 0, 0, 0.15);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		font-family: inherit;
		background: white;
		color: black;
		transition: border-color 0.2s;
	}

	.newsletter-form input[type='email']:focus {
		outline: none;
		border-color: black;
	}

	.newsletter-form input[type='email']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.newsletter-form button {
		padding: 0.6rem 1.25rem;
		background: black;
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: opacity 0.2s;
		white-space: nowrap;
	}

	.newsletter-form button:hover:not(:disabled) {
		opacity: 0.85;
	}

	.newsletter-form button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.newsletter-message {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.newsletter-message.success {
		color: var(--success);
	}

	.newsletter-message.error {
		color: var(--error);
	}

	/* En mode sombre, app.css repasse le pied de page sur le fond de la page :
	   le texte reprend alors l'encre courante, pas l'encre « sur orange ». */
	:global([data-theme='dark']) footer {
		color: var(--text);
	}
	@media (min-width: 480px) {
		.footer-links {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
		}
	}
	@media (min-width: 768px) {
		footer {
			padding: 4rem 6rem;
			display: grid;
			gap: 3rem;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto auto auto;
		}

		.brand {
			grid-column: 1;
			grid-row: 1;
		}

		.logo {
			height: fit-content;
		}

		.newsletter-section {
			grid-column: 2;
			grid-row: 1;
		}

		.socials {
			grid-column: 1;
			grid-row: 2;
			align-items: start;
		}

		.footer-links {
			display: flex;
			grid-column: 1 / -1;
			grid-row: 3;
			flex-direction: row;
		}
	}
	@media (min-width: 1280px) {
		footer {
			padding: 6rem;
			grid-template-columns: minmax(1rem, auto) 1fr 1fr;
			grid-template-rows: auto auto;
			gap: 3rem;
		}

		.brand {
			grid-column: 1;
			grid-row: 1;
		}

		.newsletter-section {
			grid-column: 2;
			grid-row: 1;
		}

		.socials {
			grid-column: 3;
			grid-row: 1;
			align-items: center;
		}

		.footer-links {
			grid-column: 1 / -1;
			grid-row: 2;
		}
	}

	/* ─── Dark mode (input + messages uniquement, le reste est dans app.css) ── */
	:global([data-theme='dark']) .newsletter-form input[type='email'] {
		border-color: var(--border);
		background: var(--bg-card);
		color: var(--text);
	}

	:global([data-theme='dark']) .newsletter-form button {
		background: var(--bg-card);
		color: var(--text);
		border: 1px solid var(--border);
	}
</style>
