<script lang="ts">
	import ExternalLink from '$components/custom/a.svelte'
	import Logo from '$components/Logo.svelte'
	import Socials from '$components/Socials.svelte'

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
			message = 'Adresse e-mail invalide'
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
				message = 'Inscription confirmée !'
				isError = false
				email = ''
			} else {
				message = result.error ?? 'Une erreur est survenue'
				isError = true
			}
		} catch {
			message = 'Erreur de connexion'
			isError = true
		} finally {
			isSubmitting = false
		}
	}
</script>

<footer>
	<div class="brand">
		<a href="/" class="logo">
			<div class="logo">
				<Logo animate fill_circle="white" fill_ai="white" />
			</div>
		</a>
		<p>Pour une IA alignée sur l'humanité.</p>
	</div>
	<div id="newsletter" class="newsletter-section">
		<h2>Newsletter</h2>
		<p class="newsletter-desc">L'essentiel de l'actualité IA décrypté chaque mois</p>
		<form on:submit={handleNewsletterSubmit} class="newsletter-form">
			<div class="input-group">
				<input
					type="email"
					bind:value={email}
					placeholder="votre@email.com"
					disabled={isSubmitting}
					aria-label="Adresse e-mail"
				/>
				<button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}...{:else}S'inscrire{/if}
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
		<h2>Suivez-nous</h2>
		<Socials />
	</div>
	<div class="footer-links">
		<div class="column">
			<h2>Navigation</h2>
			<a href="/faq">FAQ</a>
			<a href="/dangers">Dangers</a>
			<a href="/propositions">Propositions</a>
			<a href="https://pauseia.substack.com/">Blog</a>
			<a href="/agir">Agir</a>
			<a href="/dons">Donner</a>
			<a href="/rejoindre">Nous rejoindre</a>
			<a href="/qui-sommes-nous">Qui sommes-nous ?</a>
		</div>
		<div class="column">
			<h2>Dangers</h2>
			<a href="/dangers/economiques-et-materiels">Économiques et matériels</a>
			<a href="/dangers/pour-les-individus">Pour les individus</a>
			<a href="/dangers/pour-la-societe">Pour la société</a>
			<a href="/dangers/pour-l'humanite">Pour l'humanité</a>
		</div>
		<div class="column">
			<h2>Agir</h2>
			<a href="/rejoindre">Rejoindre Pause IA</a>
			<a href="/agir">Comment pouvez-vous aider ?</a>
			<a href="/dons">Faire un don</a>
			<ExternalLink href="https://pauseai-shop.fourthwall.com" target="_blank"
				>Marchandises</ExternalLink
			>
			<a href="https://pauseai.info/protests">Manifestations</a>
			<a href="/directeur-france">Offres d'emploi</a>
		</div>
		<div class="column">
			<h2>Autres</h2>
			<a href="/presse">Presse</a>
			<a href="/mentions-legales">Mentions légales</a>
			<a href="/politique-de-confidentialite">Politique de confidentialité</a>
			<a href="/charte-des-valeurs">Charte des valeurs</a>
			<ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.fr" target="_blank"
				>Licence: CC-BY 4.0</ExternalLink
			>
		</div>
	</div>
</footer>

<style>
	footer {
		background-color: #ff9416;
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
		color: var(--text-2);
		text-decoration: none;
	}

	.footer-links :global(a:hover) {
		text-decoration: underline;
	}

	.brand p {
		margin-top: 1rem;
		margin-bottom: 0;
		text-align: left;
		font-style: italic;
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
		border-radius: 0.375rem;
		font-size: 0.95rem;
		font-family: inherit;
		background: white;
		color: var(--text);
		transition: border-color 0.2s;
	}

	.newsletter-form input[type='email']:focus {
		outline: none;
		border-color: var(--black);
	}

	.newsletter-form input[type='email']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.newsletter-form button {
		padding: 0.6rem 1.25rem;
		background: var(--black);
		color: white;
		border: none;
		border-radius: 0.375rem;
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
		color: #166534;
	}

	.newsletter-message.error {
		color: #991b1b;
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
</style>
