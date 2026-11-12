<script lang="ts">
	import { Badge, PageHero } from '$components/ui'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import DonVirement from '$components/DonVirement.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { title as siteName } from '$config'
	import { CreditCard, Landmark } from 'lucide-svelte'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)

	// Le don par virement affiche directement nos coordonnées bancaires et une
	// référence DON-XXXXXX : l'argent arrive sur notre compte, sans intermédiaire
	// ni commission. Le webhook Wise solde ensuite la contribution dans CiviCRM.
	let showVirement = false
</script>

<PostMeta title={`${t.dons.meta_title} | ${siteName}`} description={t.dons.meta_desc} />

<article>
	<!-- Main donation page -->
	<section class="hero">
		<PageHero eyebrow={t.nav.agir}>
			{t.dons.title}
			<svelte:fragment slot="lede">
				{#if lang === 'en'}
					AI companies are in an unbridled race to develop increasingly powerful systems.
					<strong>Let’s act fast to keep AI under control</strong> before it’s too late.
				{:else}
					Les entreprises d’IA sont dans une course effrénée pour développer des systèmes de plus en
					plus puissants.
					<strong>Agissons vite pour garder l’IA sous contrôle</strong> avant qu’il ne soit trop tard.
				{/if}
			</svelte:fragment>
		</PageHero>
		{#if lang === 'en'}
			<div class="tax-benefit">
				<strong>Your donations are 66% tax-deductible</strong><br />
				<small>A donation of €100 only costs you €34<sup>*</sup></small>
				<p class="tax-note">
					* If you are liable for French income tax, and within the limit of 20% of your taxable
					income.
				</p>
			</div>
		{:else}
			<div class="tax-benefit">
				<strong>Vos dons sont déductibles à hauteur de 66 % de vos impôts</strong><br />
				<small>Un don de 100 € ne vous coûte réellement que 34 €<sup>*</sup></small>
				<p class="tax-note">
					* Si vous êtes imposable sur le revenu, et dans la limite de 20 % de votre revenu
					imposable.
				</p>
			</div>
		{/if}
	</section>

	<section class="donation-options">
		<div class="donation-card helloasso-card">
			<h2 class="title-with-icon">
				<span class="icon-and-text">
					<CreditCard size="1em" />
					{#if lang === 'en'}
						<span class="title-text">Credit card donation</span>
					{:else}
						<span class="title-text">Don par carte bancaire</span>
					{/if}
				</span>
				<Badge size="sm">{lang === 'en' ? 'Simple & fast' : 'Simple & rapide'}</Badge>
			</h2>
			{#if lang === 'en'}
				<p>
					Choose between a one-time or monthly donation. Secure payment by credit card via
					HelloAsso.
				</p>
			{:else}
				<p>
					Choisissez entre un don ponctuel ou un soutien mensuel. Paiement sécurisé par carte
					bancaire via HelloAsso.
				</p>
			{/if}
			<Button href="https://www.helloasso.com/associations/pause-ia/formulaires/1">
				{lang === 'en' ? 'Donate by card' : 'Donner par carte'}
			</Button>
			<small class="donation-note">
				<CreditCard size="1em" />
				{lang === 'en' ? 'One-time or monthly donation' : 'Don ponctuel ou mensuel au choix'}
			</small>
		</div>

		<div class="donation-card">
			<h2 class="title-with-icon">
				<span class="icon-and-text">
					<Landmark size="1em" />
					{#if lang === 'en'}
						<span class="title-text">Bank transfer donation</span>
					{:else}
						<span class="title-text">Don par virement bancaire</span>
					{/if}
				</span>
			</h2>
			{#if lang === 'en'}
				<p>Ideal for larger amounts.</p>
			{:else}
				<p>Idéal pour les montants importants.</p>
			{/if}
			<Button on:click={() => (showVirement = true)}>
				{lang === 'en' ? 'Make a transfer' : 'Faire un virement'}
			</Button>
			<small class="donation-note">
				<Landmark size="1em" />
				{lang === 'en' ? 'Recommended for donations > €500' : 'Recommandé pour les dons > 500€'}
			</small>
		</div>
	</section>

	<div class="impact-highlight aplat-marque">
		{#if lang === 'en'}
			<h2>What are your donations used for?</h2>
			<p>
				They fund our awareness campaigns, the production of educational content, the running of
				events, and the infrastructure that carries all of it. Concretely: informing the public,
				alerting decision-makers, and building a movement able to slow this race down.
			</p>
		{:else}
			<h2>À quoi servent vos dons ?</h2>
			<p>
				Ils financent nos campagnes de sensibilisation, la production de contenus éducatifs,
				l’organisation d’événements et l’infrastructure qui porte le tout. Concrètement : informer
				le public, alerter les décideurs, et construire un mouvement capable de ralentir cette
				course.
			</p>
		{/if}
	</div>

	<section class="faq-section">
		<UnderlinedTitle
			>{lang === 'en' ? 'Frequently asked questions' : 'Questions fréquentes'}</UnderlinedTitle
		>

		{#if lang === 'en'}
			<Accordion id="faq-payment" open={false}>
				<svelte:fragment slot="head">What payment methods do you accept?</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						Card payments through HelloAsso (one-off or monthly) and bank transfers, which we
						recommend for larger amounts.
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-helloasso" open={false}>
				<svelte:fragment slot="head">What is HelloAsso, and who issues my receipt?</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						HelloAsso is a French payment platform reserved for non-profits. It takes
						<strong>no commission on your donation</strong>: it is funded by the voluntary
						contribution it offers to add at checkout. You can lower that contribution or set it to
						zero, and your donation then reaches us in full.
					</p>
					<p>
						HelloAsso also issues your tax receipt: it is generated automatically and emailed to the
						address you gave, usually within minutes. You can download it again at any time from
						your HelloAsso account. For a bank transfer, we issue the receipt ourselves.
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-tax" open={false}>
				<svelte:fragment slot="head">How is my donation deducted from my taxes?</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						A donation to Pause IA entitles you to a tax reduction of 66% of the amount, up to 20%
						of your taxable income.
					</p>
					<p>
						<strong>It is a tax reduction, not a tax credit</strong>: it is subtracted from the
						income tax you owe. So it only benefits people who actually pay French income tax. If
						you are not taxable, nothing is refunded to you, and your donation is worth exactly as
						much to us.
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-about" open={false}>
				<svelte:fragment slot="head">
					What is Pause AI, and how does it relate to PauseAI Global?
				</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						Pause AI is the French branch of PauseAI Global, a non-profit campaigning for a pause in
						the development of the most dangerous AI systems. It is autonomous: your donations stay
						entirely in France to fund our local actions, and no share is passed on to the
						international organisation.
					</p>
				</svelte:fragment>
			</Accordion>
		{:else}
			<Accordion id="faq-payment" open={false}>
				<svelte:fragment slot="head">Quels moyens de paiement acceptez-vous ?</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						La carte bancaire via HelloAsso (don ponctuel ou mensuel) et le virement bancaire, que
						nous recommandons pour les montants importants.
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-helloasso" open={false}>
				<svelte:fragment slot="head">
					Qu’est-ce que HelloAsso, et qui émet mon reçu fiscal ?
				</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						HelloAsso est une plateforme de paiement française réservée aux associations. Elle ne
						prélève <strong>aucune commission sur votre don</strong> : son service est financé par la
						contribution volontaire qu’elle propose d’ajouter au moment du paiement. Vous pouvez la modifier
						ou la ramener à zéro, et l’intégralité de votre don nous revient alors.
					</p>
					<p>
						C’est également HelloAsso qui émet votre reçu fiscal : il est généré automatiquement et
						envoyé par courriel à l’adresse indiquée lors du don, en général dans les minutes qui
						suivent. Vous pouvez le retrouver à tout moment depuis votre compte HelloAsso. Pour un
						don par virement, c’est nous qui l’établissons.
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-tax" open={false}>
				<svelte:fragment slot="head">
					Comment puis-je déduire mon don de mes impôts ?
				</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						Un don à Pause IA ouvre droit à une réduction d’impôt de 66 % du montant versé, dans la
						limite de 20 % de votre revenu imposable.
					</p>
					<p>
						<strong>Il s’agit d’une réduction d’impôt, et non d’un crédit d’impôt</strong> : elle se soustrait
						à l’impôt sur le revenu que vous devez. Elle ne profite donc qu’aux personnes qui paient effectivement
						cet impôt. Si vous n’êtes pas imposable, rien ne vous est remboursé, et votre don a exactement
						la même valeur pour nous.
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-about" open={false}>
				<svelte:fragment slot="head">
					Qu’est-ce que Pause IA, et quel est le lien avec PauseAI Global ?
				</svelte:fragment>
				<svelte:fragment slot="details">
					<p>
						Pause IA est la branche française de PauseAI Global, une organisation à but non lucratif
						qui milite pour une pause dans le développement des systèmes d’IA les plus dangereux.
						Elle est autonome : vos dons restent entièrement en France pour financer nos actions
						locales, et aucune part n’est reversée à l’organisation internationale.
					</p>
				</svelte:fragment>
			</Accordion>
		{/if}
	</section>
	<DonVirement bind:show={showVirement} />
</article>

<style>
	article {
		max-inline-size: var(--width-content);
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	/* En-tête au modèle : aligné à gauche, sans carte. C'était un encadré
	   blanc posé sur un fond devenu blanc, que seule son ombre trahissait. */
	.hero {
		margin-bottom: 3rem;
	}

	/* L'étiquette, le titre et le chapô étaient recopiés à la main ici. Ils
	   viennent maintenant de PageHero : une seule définition du modèle, au
	   lieu d'une copie par page qui finit par diverger. */

	/* L'avantage fiscal est une information, pas une confirmation : le vert
	   vif le faisait lire comme un message de succès, et c'était la seule
	   tache verte du site. Il prend le panneau de la charte, avec le filet
	   orange qui rattache à la marque. */
	.tax-benefit {
		padding: 1.1rem 1.25rem;
		border: 0;
		border-left: 3px solid var(--brand);
		border-radius: 2px;
		background: var(--panneau-bg);
		margin: 1.5rem 0;
	}

	/* La réduction de 66 % ne vaut que pour qui paie l'impôt sur le revenu.
	   Sans cette réserve, la page promettait à tout le monde un don à 34 € :
	   c'est faux pour les foyers non imposables, qui sont nombreux. */
	.tax-note {
		margin: 0.5rem 0 0;
		font-size: 0.8rem;
		line-height: 1.45;
		opacity: 0.8;
	}

	.tax-benefit strong {
		color: var(--text);
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

		.donation-options:has(.amount-form-card) {
			grid-template-columns: 1fr;
		}
	}

	.donation-card {
		background: var(--bg);
		border-radius: var(--radius-md);
		padding: 2rem;
		box-shadow: var(--shadow-raised);
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

	.donation-card h2 {
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
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
		flex-grow: 1;
	}

	.donation-card :global(a),
	.donation-card :global(button) {
		width: 100% !important;
		min-width: 100% !important;
		max-width: 100% !important;
	}

	.title-with-icon :global(.ui-badge) {
		align-self: flex-start;
	}

	.donation-note {
		display: flex;
		align-items: center;
		gap: 0.4em;
		margin-top: 1rem;
		color: var(--text-secondary);
		font-size: 0.9rem;
		text-align: left;
	}

	/* « À quoi servent vos dons ? » : c'est la réponse à la seule objection
	   sérieuse du visiteur, et c'était une carte blanche sur un fond devenu
	   blanc, avec un texte centré que rien d'autre sur le site ne fait. Elle
	   prend l'aplat de marque et s'aligne à gauche comme le reste. */
	.impact-highlight :global(h2) {
		margin-block: 0 0.9rem;
		color: var(--on-dark);
	}

	@keyframes slideInFade {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
