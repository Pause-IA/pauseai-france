<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import DonVirement from '$components/DonVirement.svelte'
	import { title as siteName } from '$config'
	import { CreditCard, Landmark } from 'lucide-svelte'

	const title = 'Faire un don à Pause IA'
	const description = 'Grâce à votre soutien financier, nous pouvons avoir un plus grand impact.'

	let showDonVirementModal = false
</script>

<PostMeta title={`${title} | ${siteName}`} {description} />

<article>
	<!-- Main donation page -->
	<section class="hero">
		<UnderlinedTitle as="h1">{title}</UnderlinedTitle>
		<p class="hero-description">
			Les entreprises d'IA sont dans une course effrénée pour développer des systèmes de plus en
			plus puissants.
			<strong>Agissons vite pour garder l'IA sous contrôle</strong> avant qu'il ne soit trop tard.
		</p>

		<div class="tax-benefit">
			<strong>Vos dons sont déductibles à hauteur de 66% de vos impôts</strong><br />
			<small>Un don de 100€ ne vous coûte réellement que 34€</small>
		</div>
	</section>

	<section class="donation-options">
		<div class="donation-card helloasso-card">
			<h3 class="title-with-icon">
				<span class="icon-and-text">
					<CreditCard size="1em" />
					<span class="title-text">Don par carte bancaire</span>
				</span>
				<span class="monthly-badge">Simple & rapide</span>
			</h3>
			<p>
				Choisissez entre un don ponctuel ou un soutien mensuel. Paiement sécurisé par carte bancaire
				via HelloAsso.
			</p>
			<Button href="https://www.helloasso.com/associations/pause-ia/formulaires/1"
				>Donner par carte</Button
			>
			<small class="donation-note"><CreditCard size="1em" /> Don ponctuel ou mensuel au choix</small
			>
		</div>

		<div class="donation-card">
			<h3 class="title-with-icon">
				<span class="icon-and-text">
					<Landmark size="1em" />
					<span class="title-text">Don par virement bancaire</span>
				</span>
			</h3>
			<p>Idéal pour les montants importants.</p>
			<Button on:click={() => (showDonVirementModal = true)}>Faire un virement</Button>
			<small class="donation-note"><Landmark size="1em" /> Recommandé pour les dons > 500€</small>
		</div>
	</section>

	<div class="impact-highlight">
		<h3>Votre impact face à l'urgence</h3>
		<p>
			Chaque jour compte face à l'accélération du développement de l'IA. Vos dons nous permettent
			d'éduquer le public, d'alerter les décideurs et de construire un mouvement pour ralentir cette
			course dangereuse.
		</p>
	</div>

	<section class="faq-section">
		<UnderlinedTitle>Questions fréquentes</UnderlinedTitle>

		<Accordion id="faq-usage" open={false}>
			<svelte:fragment slot="head">À quoi servent vos dons ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Vos dons financent nos campagnes de sensibilisation, la production de contenus éducatifs,
					l'organisation d'événements, et le développement de notre infrastructure pour amplifier
					notre impact en France.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-payment" open={false}>
			<svelte:fragment slot="head">Quels moyens de paiement acceptez-vous ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Nous acceptons les paiements par carte bancaire via HelloAsso (don ponctuel ou mensuel) et
					les virements bancaires (recommandé pour les montants importants).
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-about" open={false}>
			<svelte:fragment slot="head">Qu'est-ce que Pause IA ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Pause IA est la branche française de PauseAI Global, une organisation à but non lucratif
					dédiée à promouvoir le développement responsable de l'intelligence artificielle. Nous
					militons pour une pause dans le développement des systèmes d'IA les plus dangereux.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-tax" open={false}>
			<svelte:fragment slot="head">Comment puis-je déduire mon don de mes impôts ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					En tant qu'organisation à but non lucratif, vos dons à Pause IA sont déductibles à 66% de
					vos impôts sur le revenu (cette réduction s'appliquant dans la limite de 20% de votre
					revenu imposable). Nous vous enverrons automatiquement un reçu fiscal après votre don.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-global" open={false}>
			<svelte:fragment slot="head">Quel est le lien avec PauseAI Global ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Pause IA est la branche française autonome de PauseAI Global. Vos dons restent entièrement
					en France pour financer nos actions locales. Nous ne reversons aucune partie de ces dons à
					l'organisation internationale.
				</p>
			</svelte:fragment>
		</Accordion>
	</section>
</article>

<DonVirement bind:show={showDonVirementModal} />

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
		background: var(--bg);
		padding: 3rem 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.hero-description {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 1.5rem;
	}

	.tax-benefit {
		background: #e8f5e8;
		border: 2px solid #4caf50;
		border-radius: 8px;
		padding: 1rem;
		margin: 1.5rem 0;
		text-align: center;
	}

	.tax-benefit strong {
		color: #2e7d32;
		font-size: 1.1rem;
	}

	.donation-options {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 3rem;
		transition: all 0.3s ease-out;
	}

	@media (min-width: 768px) {
		.donation-options {
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
		}
	}

	.donation-card {
		background: var(--bg);
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border: 2px solid transparent;
		transition: all 0.3s ease-out;
		display: flex;
		flex-direction: column;
		height: 100%;
		animation: slideInFade 0.3s ease-out;
	}

	.donation-card:hover {
		border-color: var(--brand);
		transform: translateY(-2px);
	}

	.donation-card h3 {
		font-size: 1.3rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.title-with-icon {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}

	.icon-and-text {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
	}

	.icon-and-text :global(svg) {
		display: inline-block;
		line-height: 1;
	}

	.donation-card p {
		color: #666;
		margin-bottom: 1.5rem;
		flex-grow: 1;
	}

	.donation-card :global(a),
	.donation-card :global(button) {
		width: 100% !important;
		min-width: 100% !important;
		max-width: 100% !important;
	}

	.monthly-badge {
		background: #4caf50;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 500;
	}

	/* Place badge under the whole heading, left-aligned with the icon */
	.title-with-icon .monthly-badge {
		display: inline-flex;
		align-self: flex-start;
		margin-top: 0;
	}

	.donation-note {
		display: flex;
		align-items: center;
		gap: 0.4em;
		margin-top: 1rem;
		color: #666;
		font-size: 0.9rem;
		text-align: left;
	}

	.impact-highlight {
		background: linear-gradient(135deg, var(--brand), #ff6b35);
		color: var(--black);
		padding: 2rem;
		border-radius: 12px;
		margin: 2rem 0;
		text-align: center;
	}

	.impact-highlight h3 {
		margin-bottom: 1rem;
		color: var(--black);
	}

	.faq-section {
		margin-top: 3rem;
	}

	@media (max-width: 480px) {
		article {
			padding: 0 1rem;
		}
	}
</style>
