<script lang="ts">
	import ExternalLink from '$components/custom/a.svelte'
	import Logo from '$components/Logo.svelte'
	import Socials from '$components/Socials.svelte'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import { theme } from '$lib/stores/theme'
	import { page } from '$app/stores'
	import { switchLangHref } from '$lib/langSwitch'

	export let lang: Lang = 'fr'

	$: t = getT(lang)
	$: prefix = lang === 'fr' ? '/fr' : '/en'
	let otherLang: 'fr' | 'en'
	$: otherLang = lang === 'fr' ? 'en' : 'fr'
	$: langHref = switchLangHref($page.url.pathname, lang, otherLang)

	const CONTACT = 'contact@pauseia.fr'

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

<!--
  Organisation (validée par l'équipe) : une colonne d'identité, trois colonnes
  de liens (S'informer, Agir, Pause IA), puis une barre du bas pour les mentions
  légales et la langue. Plan du site : docs/plan-du-site.md.
-->
<footer>
	<div class="top">
		<section class="identity" aria-label="Pause IA">
			<a href={prefix} class="logo" aria-label="Pause IA">
				<!-- Hauteur explicite : sans elle, le SVG est mesuré à sa taille
				     intrinsèque pendant le calcul de la grille et ajoute un grand vide. -->
				<Logo
					height={56}
					animate
					fill_pause={$theme === 'dark' ? '#f0ede8' : 'black'}
					fill_circle="white"
					fill_ai={$theme === 'dark' ? '#f0ede8' : 'white'}
				/>
			</a>
			<p class="association">
				{t.footer.association_before}<ExternalLink href="https://pauseai.info" target="_blank"
					>PauseAI</ExternalLink
				>{t.footer.association_after}
			</p>
			<p class="contact">
				{t.footer.contact} : <a href="mailto:{CONTACT}">{CONTACT}</a>
			</p>
			<div class="socials">
				<h2 class="sr-only">{t.footer.follow_us}</h2>
				<Socials />
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
							{#if isSubmitting}{t.footer.newsletter_loading}{:else}{t.footer
									.newsletter_subscribe}{/if}
						</button>
					</div>
					{#if message}
						<p class="newsletter-message" class:error={isError} class:success={!isError}>
							{message}
						</p>
					{/if}
				</form>
			</div>
		</section>

		<nav class="footer-links" aria-label={lang === 'en' ? 'Site map' : 'Plan du site'}>
			<div class="column">
				<h2>{t.footer.inform_title}</h2>
				<!-- « Les dangers de l'IA » est retiré, comme dans le menu, le temps de
				     retravailler le discours (t.footer.dangers reste prêt). -->
				<a href="{prefix}/ressources">{t.footer.resources}</a>
				<a href="{prefix}/fresque">{t.footer.fresque}</a>
				<a href="{prefix}/newsletters">{t.footer.newsletter}</a>
				<ExternalLink href="https://pauseia.substack.com/" target="_blank"
					>{t.footer.blog}</ExternalLink
				>
			</div>
			<div class="column">
				<h2>{t.footer.act_title}</h2>
				<a href="{prefix}/rejoindre">{t.footer.join_pauseia}</a>
				<a href="{prefix}/groupes-locaux">{t.footer.local_groups}</a>
				<a href="{prefix}/agir">{t.footer.all_ways}</a>
				<a href="{prefix}/ecrire-a-mes-elus">{t.footer.ecrire_elus}</a>
				<a href="{prefix}/declaration">{t.footer.declaration}</a>
				<a href="{prefix}/dons">{t.footer.make_donation}</a>
				<ExternalLink href="https://pauseai-shop.fourthwall.com" target="_blank"
					>{t.footer.shop}</ExternalLink
				>
			</div>
			<div class="column">
				<h2>{t.footer.about_title}</h2>
				<a href="{prefix}/qui-sommes-nous">{t.footer.qui_sommes_nous}</a>
				<a href="{prefix}/charte-des-valeurs">{t.footer.values}</a>
				<a href="{prefix}/propositions">{t.footer.demands}</a>
				<a href="{prefix}/financements">{t.footer.funding}</a>
				<a href="{prefix}/presse">{t.footer.press}</a>
				<a href="{prefix}/faq">{t.footer.faq}</a>
				<a href="{prefix}/recrutement-emploi">{t.footer.jobs}</a>
			</div>
		</nav>
	</div>

	<div class="bottom">
		<!-- Titre lu par les lecteurs d'écran (et par scripts/plan-du-site.mjs). -->
		<div class="sr-only"><h2>{t.footer.legal_title}</h2></div>
		<a href="{prefix}/mentions-legales">{t.footer.legal}</a>
		<span aria-hidden="true">·</span>
		<a href="{prefix}/politique-de-confidentialite">{t.footer.privacy}</a>
		<span aria-hidden="true">·</span>
		<ExternalLink
			href={lang === 'en'
				? 'https://creativecommons.org/licenses/by/4.0/'
				: 'https://creativecommons.org/licenses/by/4.0/deed.fr'}
			target="_blank">{t.footer.license}</ExternalLink
		>
		<span aria-hidden="true">·</span>
		<a href={langHref} hreflang={otherLang} lang={otherLang} aria-label={t.footer.switch_lang_label}
			>{otherLang.toUpperCase()}</a
		>
	</div>
</footer>

<style>
	footer {
		/* Aplat orange de marque, identique dans les deux thèmes : le texte y
		   est donc foncé et fixe (7,9:1), pas la couleur d'encre de la page. */
		background-color: var(--brand);
		color: var(--on-brand);
		overflow: hidden;
		padding: 2.5rem 1.25rem 1.5rem;
		font-size: 1rem;
	}

	.top {
		display: grid;
		gap: 2.5rem;
	}

	h2 {
		font-size: 1.25rem;
		font-family: var(--font-heading);
		font-weight: 700;
		margin: 0 0 0.25rem;
	}

	/* ── Identité ── */
	.identity {
		/* app.css espace les <section> du contenu (5 à 10 rem) : pas ici. */
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.logo {
		display: block;
		inline-size: fit-content;
	}

	.association,
	.contact {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.identity :global(a),
	.bottom :global(a) {
		color: inherit;
	}

	/* Socials centre ses icônes à partir de 768 px : ici, la colonne est alignée à gauche. */
	.socials :global(.social) {
		justify-content: flex-start;
	}

	.sr-only {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* ── Colonnes de liens ── */
	.footer-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 2rem;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.footer-links :global(a) {
		color: inherit;
		text-decoration: none;
		line-height: 1.35;
	}

	.footer-links :global(a:hover),
	.bottom :global(a:hover) {
		text-decoration: underline;
	}

	/* ── Barre du bas ── */
	.bottom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.6rem;
		margin-top: 2.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(var(--ink-rgb), 0.2);
		font-size: 0.9rem;
	}

	.bottom :global(a) {
		text-decoration: none;
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
		border: 2px solid rgba(var(--ink-rgb), 0.15);
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

	.newsletter-section {
		margin-top: 0.5rem;
	}

	/* En mode sombre, app.css repasse le pied de page sur le fond de la page :
	   le texte reprend alors l'encre courante, pas l'encre « sur orange ». */
	:global([data-theme='dark']) footer {
		color: var(--text);
	}

	@media (min-width: 768px) {
		footer {
			padding: 4rem 3rem 2rem;
		}
	}

	@media (min-width: 1100px) {
		footer {
			padding: 5rem 6rem 2rem;
		}

		.top {
			grid-template-columns: minmax(18rem, 1.1fr) 3fr;
			gap: 4rem;
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
