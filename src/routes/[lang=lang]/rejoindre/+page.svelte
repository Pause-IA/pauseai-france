<script lang="ts">
	import { Badge } from '$components/ui'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { UserCheck, Users, Zap } from 'lucide-svelte'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)
</script>

<PostMeta title={t.rejoindre.meta_title} description={t.rejoindre.meta_desc} />

<article>
	{#if lang === 'en'}
		<section class="hero">
			<UnderlinedTitle as="h1">Join Pause AI</UnderlinedTitle>
			<p class="hero-description">
				Faced with a technological race that accelerates every day, <strong
					>collective action is our greatest strength</strong
				>. Every voice, every hour of volunteering, every membership strengthens our ability to
				influence public debate and regain control.
				<br /><br />
				Whether you have 10 minutes a week or several hours to dedicate to us, there is a place for you
				at Pause AI. Discover how you can act alongside us.
			</p>
		</section>

		<section class="engagement-options">
			<div class="engagement-card">
				<h2 class="title-with-icon">
					<span class="icon-and-text">
						<UserCheck size="1em" />
						<span class="title-text">Become a Member</span>
					</span>
					<Badge>Official support</Badge>
				</h2>
				<p>
					Officially support our mission and bylaws. As a member, you strengthen our collective
					weight and participate in the life of the association. It's the strong signal of your
					commitment.
				</p>
				<Button
					href="https://www.helloasso.com/associations/pause-ia/adhesions/formulaire-d-adhesion-a-pause-ia"
					>Join the association</Button
				>
				<small class="engagement-note">Pay what you want, minimum €24/year.</small>
			</div>

			<div class="engagement-card">
				<h2 class="title-with-icon">
					<span class="icon-and-text">
						<Users size="1em" />
						<span class="title-text">Join the Community</span>
					</span>
					<Badge variant="neutral">The heart of action</Badge>
				</h2>
				<p>
					Join our Discord community to exchange, stay informed and, if you wish, take action.
					<b>This is the single entry point to become a volunteer</b>, whatever time you can
					dedicate.
				</p>
				<Button href="https://discord.gg/vyXGd7AeGc">Join the community</Button>
				<small class="engagement-note">To exchange or become a volunteer.</small>
			</div>
		</section>

		<section class="difference">
			<h2>What is the difference between a member and a volunteer?</h2>
			<p>
				A <strong>member</strong> formally supports the association through a membership fee and
				participates in its governance (AGM). A <strong>volunteer</strong> gives their time to carry
				out our missions. You can be one, the other, or both!
			</p>
		</section>

		<div class="impact-highlight">
			<h2><Zap size="1.2em" /> Quick action: Join Pause Action!</h2>
			<p>
				Have little time but a strong desire to act? Join our WhatsApp group "Pause Action" to
				receive simple and quick actions to carry out in a few minutes per week.
			</p>
			<Button alt href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU">Join Pause Action</Button>
		</div>

		<section class="faq-section">
			<UnderlinedTitle>Frequently asked questions</UnderlinedTitle>

			<Accordion id="faq-skills" open={false}>
				<svelte:fragment slot="head">I have no particular skills, can I still help?</svelte:fragment
				>
				<svelte:fragment slot="details">
					<p>
						Absolutely. Our Tier 0 and Tier 1 actions are designed to be accessible to everyone. We
						provide guides and coaching. Your motivation is your best skill.
					</p>
				</svelte:fragment>
			</Accordion>
		</section>
	{:else}
		<section class="hero">
			<UnderlinedTitle as="h1">Rejoindre Pause IA</UnderlinedTitle>
			<p class="hero-description">
				Face à une course technologique qui s'accélère chaque jour, <strong
					>l'action collective est notre plus grande force</strong
				>. Chaque voix, chaque heure de bénévolat, chaque adhésion renforce notre capacité à
				influencer le débat public et à reprendre le contrôle.
				<br /><br />
				Que vous ayez 10 minutes par semaine ou plusieurs heures à nous consacrer, il existe une place
				pour vous chez Pause IA. Découvrez comment vous pouvez agir à nos côtés.
			</p>
		</section>

		<section class="engagement-options">
			<div class="engagement-card">
				<h2 class="title-with-icon">
					<span class="icon-and-text">
						<UserCheck size="1em" />
						<span class="title-text">Devenir Membre</span>
					</span>
					<Badge>Soutien officiel</Badge>
				</h2>
				<p>
					Soutenez officiellement notre mission et nos statuts. En tant que membre, vous renforcez
					notre poids collectif et participez à la vie de l'association.
				</p>
				<Button
					href="https://www.helloasso.com/associations/pause-ia/adhesions/formulaire-d-adhesion-a-pause-ia"
					>Adhérer à l'association</Button
				>
				<small class="engagement-note">Prix libre, minimum 24 €/an.</small>
			</div>

			<div class="engagement-card">
				<h2 class="title-with-icon">
					<span class="icon-and-text">
						<Users size="1em" />
						<span class="title-text">Rejoindre la Communauté</span>
					</span>
					<Badge variant="neutral">Le cœur de l'action</Badge>
				</h2>
				<p>
					Rejoignez notre communauté sur Discord pour échanger, vous informer et, si vous le
					souhaitez, passer à l'action.
				</p>
				<Button href="https://discord.gg/vyXGd7AeGc">Rejoindre la communauté</Button>
				<small class="engagement-note">Pour échanger ou devenir bénévole.</small>
			</div>
		</section>

		<!-- Ce texte départageait membre et bénévole au fond d'un accordéon, tout
		     en bas de page. Il répond à la question que posent les deux cartes
		     ci-dessus : il est remonté juste après elles, et déplié. -->
		<section class="difference">
			<h2>Quelle est la différence entre un membre et un bénévole ?</h2>
			<p>
				Un <strong>membre</strong> soutient formellement l'association via une cotisation. Un
				<strong>bénévole</strong> donne de son temps. Vous pouvez être l'un, l'autre, ou les deux !
			</p>
		</section>

		<div class="impact-highlight">
			<h2><Zap size="1.2em" /> L'action rapide : Rejoignez Pause Action !</h2>
			<p>
				Vous avez peu de temps mais une grande envie d'agir ? Rejoignez notre groupe WhatsApp "Pause
				Action".
			</p>
			<Button alt href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU"
				>Rejoindre Pause Action</Button
			>
		</div>
	{/if}
</article>

<style>
	article {
		max-inline-size: var(--width-content);
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
		background: var(--bg);
		padding: 3rem 2rem;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-raised);
	}

	.hero-description {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
	}

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

	.engagement-card {
		background: var(--bg);
		border-radius: var(--radius-md);
		padding: 2rem;
		box-shadow: var(--shadow-raised);
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

	.engagement-card h2 {
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
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
		flex-grow: 1;
	}

	.engagement-card :global(a) {
		width: 100% !important;
		min-width: 100% !important;
		max-width: 100% !important;
	}

	/* Les pastilles viennent du composant Badge ; seul l'alignement
	   dans la carte reste local. */
	.engagement-card :global(.ui-badge) {
		align-self: flex-start;
	}

	.engagement-note {
		display: flex;
		align-items: center;
		gap: 0.4em;
		margin-top: 1rem;
		color: var(--text-secondary);
		font-size: 0.9rem;
		text-align: left;
	}

	.impact-highlight {
		background: linear-gradient(135deg, var(--brand), var(--brand-deep));
		color: var(--black);
		padding: 2rem;
		border-radius: var(--radius-md);
		margin: 2rem 0;
		text-align: center;
	}

	.impact-highlight h2 {
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

	@media (min-width: 768px) {
	}

	.faq-section {
		margin-top: 3rem;
	}

	.difference {
		margin: 2rem 0;
	}

	.difference h2 {
		margin: 0 0 0.75rem;
		font-size: 1.5rem;
	}

	.difference p {
		margin: 0;
		max-inline-size: var(--width-text);
		line-height: 1.7;
	}

	@media (max-width: 480px) {
		article {
			padding: 0 1rem;
		}
	}
</style>
