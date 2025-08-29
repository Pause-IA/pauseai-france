<script lang="ts">
	// Import des composants réutilisés depuis la page "Donner"
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { title as siteName } from '$config'

	// Import des icônes pour illustrer les cartes et les notes
	import { UserCheck, Users, Zap } from 'lucide-svelte'

	// Métadonnées de la page pour le SEO
	const title = 'Nous rejoindre | Pause IA'
	const description = "Rejoignez notre communauté pour agir avec nous ou devenez membre pour soutenir officiellement notre mission."

</script>

<PostMeta {title} {description} />

<article>
	<!-- Section d'introduction (Hero) -->
	<section class="hero">
		<UnderlinedTitle as="h1">Rejoindre Pause IA</UnderlinedTitle>
		<p class="hero-description">
			Face à une course technologique qui s'accélère chaque jour, <strong>l'action collective est notre plus grande force</strong>. Chaque voix, chaque heure de bénévolat, chaque adhésion renforce notre capacité à influencer le débat public et à reprendre le contrôle.
			<br/><br/>
			Que vous ayez 10 minutes par semaine ou plusieurs heures à nous consacrer, il existe une place pour vous chez Pause IA. Découvrez comment vous pouvez agir à nos côtés.
		</p>
	</section>

	<!-- Section des options d'engagement -->
	<section class="engagement-options">
		<div class="engagement-card">
			<h3 class="title-with-icon">
				<span class="icon-and-text">
					<UserCheck size="1em" />
					<span class="title-text">Devenir Membre</span>
				</span>
				<span class="badge support-badge">Soutien officiel</span>
			</h3>
			<p>
				Soutenez officiellement notre mission et nos statuts. En tant que membre, vous renforcez notre poids collectif et participez à la vie de l'association. C'est le signal fort de votre engagement.
			</p>
			<!-- IMPORTANT: Remplacer ce lien par l'URL de votre formulaire d'adhésion HelloAsso -->
			<Button href="https://www.helloasso.com/associations/pause-ia/adhesions/formulaire-d-adhesion-a-pause-ia">Adhérer à l'association</Button>
			<small class="engagement-note">
				Prix libre, minimum 24 €/an.
			</small>
		</div>

		<div class="engagement-card">
			<h3 class="title-with-icon">
				<span class="icon-and-text">
					<Users size="1em" />
					<span class="title-text">Rejoindre la Communauté</span>
				</span>
				<span class="badge community-badge">Le cœur de l'action</span>
			</h3>
			<p>
				Rejoignez notre communauté sur Discord pour échanger, vous informer et, si vous le souhaitez, passer à l'action. <b>C'est la porte d'entrée unique pour devenir bénévole</b>, quel que soit le temps que vous pouvez y consacrer.
			</p>
			<!-- IMPORTANT: Remplacer ce lien par votre lien d'invitation Discord permanent -->
			<Button href="https://discord.gg/vyXGd7AeGc">Rejoindre la communauté</Button>
			<small class="engagement-note">
				Pour échanger ou devenir bénévole.
			</small>
		</div>
	</section>

	<!-- Bannière spéciale "Pause Action" -->
	<div class="impact-highlight">
		<h3><Zap size="1.2em" /> L'action rapide : Rejoignez Pause Action !</h3>
		<p>
			Vous avez peu de temps mais une grande envie d'agir ? Rejoignez notre groupe WhatsApp "Pause Action" pour recevoir des actions simples et rapides à réaliser en quelques minutes par semaine.
		</p>
		<!-- IMPORTANT: Remplacer ce lien par votre lien d'invitation au groupe WhatsApp -->
		<Button href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU">Rejoindre Pause Action</Button>
	</div>

	<!-- Section FAQ -->
	<section class="faq-section">
		<UnderlinedTitle>Questions fréquentes</UnderlinedTitle>

		<Accordion id="faq-diff" open={false}>
			<svelte:fragment slot="head">Quelle est la différence entre un membre et un bénévole ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Un <strong>membre</strong> soutient formellement l'association via une cotisation et participe à sa gouvernance (AG). Un <strong>bénévole</strong> donne de son temps pour réaliser nos missions. Vous pouvez être l'un, l'autre, ou les deux ! Nous encourageons d'ailleurs tous nos bénévoles réguliers (Tier 2 et plus) à devenir membres.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-time" open={false}>
			<svelte:fragment slot="head">Combien de temps dois-je consacrer en tant que bénévole ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>C'est vous qui décidez !</p>
				<ul>
					<li><strong>Tier 0 (~10 min/semaine) :</strong> Actions simples via le groupe WhatsApp.</li>
					<li><strong>Tier 1 (1-4h/semaine) :</strong> Participation aux campagnes de recrutement ou de plaidoyer, avec un accompagnement léger.</li>
					<li><strong>Tier 2 (+5h/semaine) :</strong> Intégration dans une équipe (Tech, Communication, etc.) avec un suivi de projet et des responsabilités claires.</li>
				</ul>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-skills" open={false}>
			<svelte:fragment slot="head">Je n'ai pas de compétence particulière, puis-je quand même aider ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
                    Absolument. Nos actions de Tier 0 et Tier 1 (plaidoyer citoyen, recrutement) sont conçues pour être accessibles à tous. Nous vous fournissons les guides et le coaching nécessaire. Votre motivation est votre meilleure compétence.
                </p>
                <p>
                    Et cela vaut aussi pour un engagement plus important (Tier 2) ! La motivation, la fiabilité et le sens de l'organisation sont des compétences précieuses en soi. De nombreuses missions au sein de nos équipes ne demandent pas d'expertise technique préalable, et c'est une excellente occasion de développer de nouvelles compétences à nos côtés.
                </p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-onboarding" open={false}>
			<svelte:fragment slot="head">Comment se passe l'accueil (onboarding) des bénévoles ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Tout commence sur notre serveur Discord. Un processus automatisé vous guidera pour choisir votre niveau d'engagement. Si vous souhaitez vous investir en Tier 2, un membre de notre équipe d'accueil prendra contact avec vous pour un entretien personnalisé.
				</p>
			</svelte:fragment>
		</Accordion>
	</section>
</article>

<style>
	/* Styles de base de la page, repris de la page "Donner" */
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

	/* Grille pour les cartes d'engagement */
	.engagement-options {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	@media (min-width: 768px) {
		.engagement-options {
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
		}
	}

	/* Style des cartes individuelles */
	.engagement-card {
		background: var(--bg);
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border: 2px solid transparent;
		transition: all 0.3s ease-out;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.engagement-card:hover {
		border-color: var(--brand);
		transform: translateY(-2px);
	}

	.engagement-card h3 {
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

	.engagement-card p {
		color: #666;
		margin-bottom: 1.5rem;
		flex-grow: 1;
	}

	.engagement-card :global(a) {
		width: 100% !important;
		min-width: 100% !important;
		max-width: 100% !important;
	}

	/* Style des badges */
	.badge {
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 500;
		display: inline-flex;
		align-self: flex-start;
		margin-top: 0;
	}

	.support-badge {
		background: #4caf50; /* Vert, comme sur la page Don */
	}

	.community-badge {
		background: #3498db; /* Un bleu pour la communauté */
	}

	.engagement-note {
		display: flex;
		align-items: center;
		gap: 0.4em;
		margin-top: 1rem;
		color: #666;
		font-size: 0.9rem;
		text-align: left;
	}

	/* Bannière "Pause Action" */
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
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
	}

	.impact-highlight :global(a) {
		margin-top: 1rem;
		display: inline-block;
		width: auto !important;
		min-width: auto !important;
		max-width: 300px !important;
	}

	/* Section FAQ */
	.faq-section {
		margin-top: 3rem;
	}

	@media (max-width: 480px) {
		article {
			padding: 0 1rem;
		}
	}
</style>