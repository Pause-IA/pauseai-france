<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { UserCheck, Users, Zap, Briefcase } from 'lucide-svelte'
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
				<h3 class="title-with-icon">
					<span class="icon-and-text">
						<UserCheck size="1em" />
						<span class="title-text">Become a Member</span>
					</span>
					<span class="badge support-badge">Official support</span>
				</h3>
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
				<h3 class="title-with-icon">
					<span class="icon-and-text">
						<Users size="1em" />
						<span class="title-text">Join the Community</span>
					</span>
					<span class="badge community-badge">The heart of action</span>
				</h3>
				<p>
					Join our Discord community to exchange, stay informed and, if you wish, take action.
					<b>This is the single entry point to become a volunteer</b>, whatever time you can
					dedicate.
				</p>
				<Button href="https://discord.gg/vyXGd7AeGc">Join the community</Button>
				<small class="engagement-note">To exchange or become a volunteer.</small>
			</div>
		</section>

		<div class="impact-highlight">
			<h3><Zap size="1.2em" /> Quick action: Join Pause Action!</h3>
			<p>
				Have little time but a strong desire to act? Join our WhatsApp group "Pause Action" to
				receive simple and quick actions to carry out in a few minutes per week.
			</p>
			<Button alt href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU">Join Pause Action</Button>
		</div>

		<aside class="recruit-card">
			<div class="recruit-body">
				<span class="recruit-eyebrow"><Briefcase size="1em" /> We're hiring</span>
				<h3>Communications Officer (fixed-term, 60%)</h3>
				<p>
					Beyond volunteering, Pause IA is offering a paid position to structure our communications
					and grow our media presence. Applications are open until 6 September.
				</p>
			</div>
			<Button alt href="/en/recrutement-emploi">See the offer</Button>
		</aside>

		<section class="faq-section">
			<UnderlinedTitle>Frequently asked questions</UnderlinedTitle>

			<Accordion id="faq-diff" open={false}>
				<svelte:fragment slot="head"
					>What is the difference between a member and a volunteer?</svelte:fragment
				>
				<svelte:fragment slot="details">
					<p>
						A <strong>member</strong> formally supports the association through a membership fee and
						participates in its governance (AGM). A <strong>volunteer</strong> gives their time to carry
						out our missions. You can be one, the other, or both!
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-time" open={false}>
				<svelte:fragment slot="head"
					>How much time do I need to commit as a volunteer?</svelte:fragment
				>
				<svelte:fragment slot="details">
					<p>You decide!</p>
					<ul>
						<li><strong>Tier 0 (~10 min/week):</strong> Simple actions via the WhatsApp group.</li>
						<li>
							<strong>Tier 1 (1-4h/week):</strong> Participation in recruitment or advocacy campaigns.
						</li>
						<li>
							<strong>Tier 2 (+5h/week):</strong> Integration into a team (Tech, Communication, etc.)
							with project tracking and clear responsibilities.
						</li>
					</ul>
				</svelte:fragment>
			</Accordion>

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
				<h3 class="title-with-icon">
					<span class="icon-and-text">
						<UserCheck size="1em" />
						<span class="title-text">Devenir Membre</span>
					</span>
					<span class="badge support-badge">Soutien officiel</span>
				</h3>
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
				<h3 class="title-with-icon">
					<span class="icon-and-text">
						<Users size="1em" />
						<span class="title-text">Rejoindre la Communauté</span>
					</span>
					<span class="badge community-badge">Le cœur de l'action</span>
				</h3>
				<p>
					Rejoignez notre communauté sur Discord pour échanger, vous informer et, si vous le
					souhaitez, passer à l'action.
				</p>
				<Button href="https://discord.gg/vyXGd7AeGc">Rejoindre la communauté</Button>
				<small class="engagement-note">Pour échanger ou devenir bénévole.</small>
			</div>
		</section>

		<div class="impact-highlight">
			<h3><Zap size="1.2em" /> L'action rapide : Rejoignez Pause Action !</h3>
			<p>
				Vous avez peu de temps mais une grande envie d'agir ? Rejoignez notre groupe WhatsApp "Pause
				Action".
			</p>
			<Button alt href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU"
				>Rejoindre Pause Action</Button
			>
		</div>

		<aside class="recruit-card">
			<div class="recruit-body">
				<span class="recruit-eyebrow"><Briefcase size="1em" /> Nous recrutons</span>
				<h3>Responsable communication (CDD, 60 %)</h3>
				<p>
					Au-delà du bénévolat, Pause IA propose un poste salarié pour structurer sa communication
					et développer sa présence médiatique. Les candidatures sont ouvertes jusqu'au 6 septembre.
				</p>
			</div>
			<Button alt href="/fr/recrutement-emploi">Voir l'offre</Button>
		</aside>

		<section class="faq-section">
			<UnderlinedTitle>Questions fréquentes</UnderlinedTitle>

			<Accordion id="faq-diff" open={false}>
				<svelte:fragment slot="head"
					>Quelle est la différence entre un membre et un bénévole ?</svelte:fragment
				>
				<svelte:fragment slot="details">
					<p>
						Un <strong>membre</strong> soutient formellement l'association via une cotisation. Un
						<strong>bénévole</strong> donne de son temps. Vous pouvez être l'un, l'autre, ou les deux
						!
					</p>
				</svelte:fragment>
			</Accordion>

			<Accordion id="faq-time" open={false}>
				<svelte:fragment slot="head"
					>Combien de temps dois-je consacrer en tant que bénévole ?</svelte:fragment
				>
				<svelte:fragment slot="details">
					<p>C'est vous qui décidez !</p>
					<ul>
						<li><strong>Tier 0 (~10 min/semaine) :</strong> Actions simples via WhatsApp.</li>
						<li><strong>Tier 1 (1-4h/semaine) :</strong> Campagnes de plaidoyer.</li>
						<li><strong>Tier 2 (+5h/semaine) :</strong> Intégration dans une équipe.</li>
					</ul>
				</svelte:fragment>
			</Accordion>
		</section>
	{/if}
</article>

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
		background: #4caf50;
	}

	.community-badge {
		background: #3498db;
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

	.recruit-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: flex-start;
		margin: 2rem 0;
		padding: 1.75rem 2rem;
		border: 1px solid var(--border);
		border-left: 4px solid var(--brand);
		border-radius: 12px;
		background: var(--bg);
	}

	.recruit-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--brand);
	}

	.recruit-card h3 {
		margin: 0.5rem 0 0.5rem;
		font-size: 1.2rem;
		color: var(--text);
	}

	.recruit-card p {
		margin: 0;
		color: #666;
	}

	.recruit-card :global(a) {
		width: auto !important;
		min-width: auto !important;
		max-width: 300px !important;
	}

	@media (min-width: 768px) {
		.recruit-card {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 2rem;
		}

		.recruit-card :global(a) {
			flex-shrink: 0;
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
