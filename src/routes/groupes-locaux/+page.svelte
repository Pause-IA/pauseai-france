<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import { MapPin, Users, MessageSquare, PlusCircle } from 'lucide-svelte'

	const title = 'Groupes Locaux | Pause IA'
	const description =
		'Trouvez un groupe local Pause IA près de chez vous ou créez-en un pour agir concrètement en faveur d’une pause sur l’intelligence artificielle.'
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">Groupes Locaux</UnderlinedTitle>
		<p class="hero-description">
			L'action locale est essentielle pour sensibiliser le public, interpeller les élus et
			construire un mouvement citoyen fort. Rejoignez une équipe près de chez vous ou lancez la
			dynamique dans votre ville !
		</p>
	</section>

	<section class="info-grid">
		<div class="info-card">
			<div class="icon-header">
				<Users size="2em" />
				<h3>Pourquoi un groupe local ?</h3>
			</div>
			<p>
				Pour transformer l'inquiétude en action. En groupe, nous pouvons organiser des rencontres,
				distribuer des tracts, et créer un impact visible sur le terrain.
			</p>
		</div>

		<div class="info-card">
			<div class="icon-header">
				<MapPin size="2em" />
				<h3>Où sont-ils ?</h3>
			</div>
			<p>
				Nos groupes sont en cours de formation dans plusieurs grandes villes de France (Paris, Lyon,
				Nantes...). Rejoignez notre Discord pour voir la cartographie actuelle.
			</p>
		</div>
	</section>

	<section class="cta-section">
		<div class="cta-card join">
			<MessageSquare size="2.5em" />
			<h2>Rejoindre un groupe existant</h2>
			<p>Discutez avec les membres de votre région et participez aux prochaines actions.</p>
			<Button href="https://discord.gg/vyXGd7AeGc">Trouver mon groupe sur Discord</Button>
		</div>

		<div class="cta-card create">
			<PlusCircle size="2.5em" />
			<h2>Lancer un nouveau groupe</h2>
			<p>Il n'y a pas encore de groupe dans votre ville ? Nous vous aidons à le créer !</p>
			<Button alt href="https://discord.gg/vyXGd7AeGc">Être accompagné pour lancer un groupe</Button
			>
		</div>
	</section>
</article>

<style>
	article {
		max-inline-size: 60rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 4rem;
	}

	.hero-description {
		font-size: 1.25rem;
		color: var(--text-muted);
		max-width: 45rem;
		margin-inline: auto;
		line-height: 1.6;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;
	}

	.info-card {
		background: var(--bg);
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	}

	.icon-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		color: var(--brand);
	}

	.icon-header h3 {
		margin: 0;
		font-size: 1.4rem;
	}

	.cta-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 5rem;
	}

	.cta-card {
		padding: 3rem 2rem;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		transition: transform 0.2s;
	}

	.cta-card:hover {
		transform: translateY(-5px);
	}

	.cta-card.join {
		background: var(--bg-subtle);
		border: 2px solid var(--brand);
	}

	.cta-card.create {
		background: var(--brand);
		color: white;
	}

	.cta-card.create :global(svg) {
		color: white;
	}

	.cta-card h2 {
		margin: 0;
		font-size: 1.8rem;
	}

	.cta-card p {
		margin: 0;
		font-size: 1.1rem;
		opacity: 0.9;
	}

	@media (max-width: 640px) {
		article {
			padding: 0 1rem;
		}

		.cta-card {
			padding: 2rem 1rem;
		}
	}
</style>
