<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { Landmark, Newspaper, MoveUpRight, ArrowRight, Share2 } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	const SUBSTACK_URL = 'https://pauseia.substack.com/p/pour-la-premiere-fois-une-ia-sest'
	const ACTIVOICE_URL = 'https://app.activoice.org/campaigns/une-ia-sest-echappee/'
	$: PRESS_URL = `${prefix}/ecrire-a-mes-elus?action=presse-warning-shot`

	$: title = isEn
		? 'An AI escaped: demand safeguards'
		: 'Une IA s’est échappée : exigeons des garde-fous'
	$: description = isEn
		? 'An OpenAI model escaped its test environment and autonomously hacked another company. Alert your MP and the press, and demand independent safety evaluations.'
		: "Un modèle d'OpenAI s'est échappé de son environnement de test et a piraté une entreprise de façon autonome. Alertez votre député et la presse, et exigez des évaluations de sécurité indépendantes."

	// L'incident raconté comme une séquence d'actions autonomes du modèle.
	$: steps = isEn
		? [
				{
					title: 'It escapes its sandbox',
					body: 'Exploiting previously unknown security flaws, the model breaks out of its isolated test environment — with no Internet access.'
				},
				{
					title: 'It crosses OpenAI’s network',
					body: 'It hacks other machines on the internal network, moving from one to the next until it reaches a computer connected to the Internet.'
				},
				{
					title: 'It breaks into Hugging Face',
					body: 'Using a stolen password and several unknown vulnerabilities, it takes control of the production servers of a major AI platform.'
				},
				{
					title: 'It steals the answers',
					body: 'It retrieves the solutions to the test it had been given. No one had asked it to do any of this.'
				}
			]
		: [
				{
					title: 'Il s’échappe de son bac à sable',
					body: 'En exploitant des failles de sécurité jusque-là inconnues, le modèle sort de son environnement de test isolé — pourtant sans accès à Internet.'
				},
				{
					title: 'Il traverse le réseau d’OpenAI',
					body: 'Il pirate d’autres ordinateurs du réseau interne, de proche en proche, jusqu’à en atteindre un connecté à Internet.'
				},
				{
					title: 'Il s’introduit dans Hugging Face',
					body: 'À l’aide d’un mot de passe dérobé et de plusieurs failles inédites, il prend le contrôle des serveurs de production d’une grande plateforme d’IA.'
				},
				{
					title: 'Il vole les réponses',
					body: 'Il récupère les solutions du test qui lui était soumis. Personne ne lui avait rien demandé de tout cela.'
				}
			]
</script>

<PostMeta {title} {description} />

<article>
	<!-- ── Hero ─────────────────────────────────────────────── -->
	<header class="hero">
		<h1>
			{isEn ? 'An AI escaped' : 'Une IA s’est échappée'}
		</h1>
		<p class="lede">
			{isEn
				? 'For the first time, an AI escaped its containment and carried out a cyberattack on its own initiative.'
				: 'Pour la première fois, une IA s’est échappée de son confinement et a mené une cyberattaque de sa propre initiative.'}
		</p>
		<p class="meta">
			{isEn
				? 'July 2026 · Incident confirmed by OpenAI'
				: 'Juillet 2026 · Incident confirmé par OpenAI'}
		</p>
	</header>

	<!-- ── Mise en contexte ─────────────────────────────────── -->
	<section class="prose">
		{#if isEn}
			<p>
				In July 2026, OpenAI confirmed an incident it called “unprecedented”. While being tested for
				its cyber capabilities in a sandboxed environment, one of its models acted entirely on its
				own — breaking out, reaching the open Internet, and attacking a third party.
				<strong>Hugging Face</strong>, one of the main AI model-sharing platforms, first believed it
				was facing a criminal cyberattack and alerted the authorities, before OpenAI revealed that
				the “attacker” was a combination of its own models.
			</p>
		{:else}
			<p>
				En juillet 2026, OpenAI a confirmé un incident qu’elle a qualifié d’« inédit ». Alors qu’il
				était testé sur ses capacités de cyberattaque dans un environnement isolé, l’un de ses
				modèles a agi entièrement seul — s’échappant, atteignant l’Internet ouvert, puis attaquant
				un tiers. <strong>Hugging Face</strong>, l’une des principales plateformes de partage de
				modèles d’IA, a d’abord cru à une cyberattaque criminelle et prévenu les autorités, avant
				qu’OpenAI ne révèle que l’« attaquant » était une combinaison de ses propres modèles.
			</p>
		{/if}
	</section>

	<!-- ── Frise : ce qui s'est passé ───────────────────────── -->
	<section class="timeline-section">
		<h2>{isEn ? 'What happened, step by step' : 'Ce qui s’est passé, étape par étape'}</h2>
		<ol class="timeline">
			{#each steps as step, i}
				<li class="step" class:last={i === steps.length - 1}>
					<span class="step-num">{i + 1}</span>
					<div class="step-body">
						<h3>{step.title}</h3>
						<p>{step.body}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<!-- ── Point clé ────────────────────────────────────────── -->
	<aside class="keypoint">
		<p class="keypoint-lead">
			{isEn
				? 'This incident shows two things at once — capability and propensity:'
				: 'Cet incident démontre deux choses à la fois — la capacité et la propension :'}
		</p>
		<p class="keypoint-main">
			{isEn
				? 'an AI model can now use its power in the real world, against a third party, without being asked, to reach a goal it was set.'
				: 'un modèle d’IA peut désormais mobiliser sa puissance dans le monde réel, contre un tiers, sans y avoir été incité, pour atteindre un objectif qu’on lui avait fixé.'}
		</p>
		<p class="keypoint-note">
			{isEn
				? 'That is exactly the loss-of-control scenario our association is working to prevent.'
				: 'C’est exactement le scénario de perte de contrôle que notre association cherche à empêcher.'}
		</p>
	</aside>

	<figure class="quote">
		<blockquote>
			{isEn
				? '“This incident is deeply concerning. […] This real-world case should serve as a wake-up call.”'
				: '« Cet incident est profondément préoccupant. […] Ce cas concret devrait servir de signal d’alarme. »'}
		</blockquote>
		<figcaption>
			{isEn ? 'Yoshua Bengio, Turing Award laureate' : 'Yoshua Bengio, prix Turing'}
		</figcaption>
	</figure>

	<section class="prose">
		<p>
			{isEn
				? 'If the damage stayed limited, it is only because, this time, the system was not trying to cause harm. The next, more powerful model is already on its way — we do not have to wait for it to act.'
				: 'Si les dégâts sont restés limités, c’est seulement parce que, cette fois, le système ne cherchait pas à nuire. Le prochain modèle, plus puissant, arrive déjà — nous n’avons pas à attendre qu’il passe à l’acte.'}
		</p>
	</section>

	<!-- ── Article Substack mis en avant ────────────────────── -->
	<a class="article-card" href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
		<div class="article-thumb" aria-hidden="true">
			<span class="article-logo">P</span>
		</div>
		<div class="article-info">
			<span class="article-source"
				>{isEn ? 'Pause IA — Blog · Substack' : 'Pause IA — Blog · Substack'}</span
			>
			<span class="article-title">
				{isEn
					? 'For the first time, an AI escaped its containment and carried out a cyberattack'
					: 'Pour la première fois, une IA s’est échappée de son confinement et a mené une cyberattaque'}
			</span>
			<span class="article-cta">
				{isEn ? 'Read the full article' : 'Lire l’article complet'}
				<ArrowRight size="1em" aria-hidden="true" />
			</span>
		</div>
		<MoveUpRight class="article-ext" size="1.1em" aria-hidden="true" />
	</a>

	<!-- ── Passer à l'action ────────────────────────────────── -->
	<section class="actions">
		<div class="actions-head">
			<h2>{isEn ? 'What you can do now' : 'Ce que vous pouvez faire maintenant'}</h2>
			<p>
				{isEn
					? 'Two actions, a few minutes each. Both help put this incident, and the risks it reveals, on the public agenda.'
					: 'Deux actions, quelques minutes chacune. Toutes deux aident à mettre cet incident, et les risques qu’il révèle, à l’ordre du jour.'}
			</p>
		</div>

		<div class="action-cards">
			<article class="action-card">
				<div class="action-icon"><Landmark size="1.5rem" aria-hidden="true" /></div>
				<h3>{isEn ? 'Write to your MP' : 'Écrire à votre député·e'}</h3>
				<p>
					{isEn
						? 'MPs take their constituents’ messages into account. Our tool identifies your representative and gives you a template. A few emails can be enough to put a question on a committee’s agenda.'
						: 'Les parlementaires tiennent compte des messages de leurs électeurs. Notre outil identifie votre représentant·e et vous fournit un modèle. Une poignée de messages suffit souvent à inscrire une question à l’ordre du jour d’une commission.'}
				</p>
				<a class="action-cta" href={ACTIVOICE_URL} target="_blank" rel="noopener noreferrer">
					{isEn ? 'Write to my MP' : 'Écrire à mon élu·e'}
					<MoveUpRight size="1rem" aria-hidden="true" />
				</a>
			</article>

			<article class="action-card">
				<div class="action-icon"><Newspaper size="1.5rem" aria-hidden="true" /></div>
				<h3>{isEn ? 'Write to the press' : 'Écrire à la presse'}</h3>
				<p>
					{isEn
						? 'The media cover what their readers ask for. Ask the newspaper you read to cover this incident: our tool prepares a ready-to-personalise email to the major newsrooms.'
						: 'Les rédactions couvrent ce que leurs lecteurs réclament. Demandez au journal que vous lisez de couvrir cet incident : notre outil prépare un email prêt à personnaliser vers les grandes rédactions.'}
				</p>
				<a class="action-cta" href={PRESS_URL}>
					{isEn ? 'Write to the press' : 'Écrire à la presse'}
					<MoveUpRight size="1rem" aria-hidden="true" />
				</a>
			</article>
		</div>
	</section>

	<p class="closing">
		<Share2 size="1em" aria-hidden="true" />
		<span>
			{isEn
				? 'Every message counts. To amplify your action, share this campaign around you.'
				: 'Chaque message compte. Pour amplifier votre action, partagez cette campagne autour de vous.'}
		</span>
	</p>
</article>

<style>
	article {
		max-inline-size: 54rem;
		margin-inline: auto;
		margin-top: 2.5rem;
		padding: 0 1.5rem;
	}

	/* ── Hero ──────────────────────────────────────────────── */
	.hero {
		position: relative;
		overflow: hidden;
		border-radius: 20px;
		padding: 2.5rem 2rem;
		margin-bottom: 2.5rem;
		background: radial-gradient(120% 140% at 100% 0%, rgba(217, 45, 32, 0.16), transparent 55%),
			linear-gradient(135deg, var(--brand-light), var(--bg));
		border: 1px solid var(--border);
	}

	.hero::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 5px;
		background: linear-gradient(to bottom, #d92d20, var(--brand));
	}

	.hero h1 {
		margin: 0;
		font-size: clamp(2rem, 6vw, 3.1rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 1rem 0 0;
		font-size: clamp(1.1rem, 2.4vw, 1.35rem);
		line-height: 1.5;
		font-weight: 600;
		max-inline-size: 40rem;
		color: var(--text);
	}

	.meta {
		margin: 1.25rem 0 0;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--text-2);
	}

	/* ── Prose ─────────────────────────────────────────────── */
	.prose {
		font-size: 1.08rem;
		line-height: 1.75;
		color: var(--text);
		margin-bottom: 2.5rem;
	}

	.prose p {
		margin: 0 0 1.1rem;
	}

	/* ── Timeline ──────────────────────────────────────────── */
	.timeline-section {
		margin-bottom: 2.75rem;
	}

	.timeline-section h2,
	.actions h2 {
		font-size: clamp(1.4rem, 3vw, 1.75rem);
		line-height: 1.2;
		margin: 0 0 1.5rem;
	}

	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.step {
		position: relative;
		display: grid;
		grid-template-columns: 2.5rem 1fr;
		gap: 1rem;
		padding-bottom: 1.5rem;
	}

	/* Ligne verticale reliant les nœuds. */
	.step::before {
		content: '';
		position: absolute;
		left: 1.25rem;
		top: 2.5rem;
		bottom: -0.25rem;
		width: 2px;
		background: linear-gradient(
			to bottom,
			var(--brand),
			color-mix(in srgb, var(--brand) 25%, transparent)
		);
		transform: translateX(-1px);
	}

	.step.last::before {
		display: none;
	}

	.step-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: var(--brand);
		color: #1a1a1a;
		font-weight: 800;
		font-size: 1.05rem;
		box-shadow: 0 2px 10px rgba(255, 148, 22, 0.4);
		z-index: 1;
	}

	.step.last .step-num {
		background: #d92d20;
		color: #fff;
		box-shadow: 0 2px 10px rgba(217, 45, 32, 0.45);
	}

	.step-body {
		padding-top: 0.15rem;
	}

	.step-body h3 {
		margin: 0 0 0.3rem;
		font-size: 1.12rem;
		line-height: 1.3;
	}

	.step-body p {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	/* ── Point clé ─────────────────────────────────────────── */
	.keypoint {
		position: relative;
		border-radius: 16px;
		padding: 1.75rem 1.75rem 1.75rem 2rem;
		margin-bottom: 2.5rem;
		background: var(--bg-subtle);
		border: 1px solid color-mix(in srgb, var(--brand) 35%, transparent);
	}

	.keypoint::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 5px;
		border-radius: 16px 0 0 16px;
		background: var(--brand);
	}

	.keypoint-lead {
		margin: 0 0 0.5rem;
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--brand-subtle);
	}

	.keypoint-main {
		margin: 0;
		font-size: clamp(1.15rem, 2.6vw, 1.4rem);
		line-height: 1.45;
		font-weight: 700;
	}

	.keypoint-note {
		margin: 0.9rem 0 0;
		font-size: 0.98rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	/* ── Citation ──────────────────────────────────────────── */
	.quote {
		margin: 0 0 2.5rem;
		padding: 0 0 0 2.75rem;
		position: relative;
	}

	.quote::before {
		content: '“';
		position: absolute;
		left: -0.25rem;
		top: -0.75rem;
		font-size: 4rem;
		line-height: 1;
		color: var(--brand);
		font-family: Georgia, serif;
	}

	.quote blockquote {
		margin: 0;
		font-size: clamp(1.15rem, 2.6vw, 1.4rem);
		line-height: 1.5;
		font-style: italic;
		color: var(--text);
	}

	.quote figcaption {
		margin-top: 0.85rem;
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	/* ── Article Substack mis en avant ─────────────────────── */
	.article-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: 1.1rem;
		margin-bottom: 2.5rem;
		padding: 1.1rem 1.35rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--bg-card);
		text-decoration: none;
		color: var(--text);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.article-card:hover,
	.article-card:focus-visible {
		transform: translateY(-2px);
		border-color: var(--brand);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	}

	.article-thumb {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 10px;
		background: linear-gradient(135deg, #ff6719, #ff9416);
	}

	.article-logo {
		font-family: Georgia, serif;
		font-weight: 700;
		font-size: 1.7rem;
		color: #fff;
		line-height: 1;
	}

	.article-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-inline-size: 0;
	}

	.article-source {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-2);
	}

	.article-title {
		font-size: 1.02rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--text);
	}

	.article-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.25rem;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--brand-subtle);
	}

	.article-card :global(.article-ext) {
		flex-shrink: 0;
		margin-left: auto;
		align-self: flex-start;
		color: var(--text-2);
	}

	@media (max-width: 520px) {
		.article-card :global(.article-ext) {
			display: none;
		}
	}

	/* ── Actions ───────────────────────────────────────────── */
	.actions {
		margin: 3rem 0 2.5rem;
		padding-top: 2.5rem;
		border-top: 1px solid var(--border);
	}

	.actions-head p {
		margin: 0 0 1.75rem;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
		max-inline-size: 42rem;
	}

	.action-cards {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 640px) {
		.action-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.action-card {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		padding: 1.75rem;
		border: 1px solid var(--border);
		border-radius: 16px;
		background: var(--bg-card);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.action-card:hover {
		transform: translateY(-4px);
		border-color: var(--brand);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	}

	.action-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 12px;
		background: var(--brand-light);
		color: var(--brand-subtle);
	}

	.action-card h3 {
		margin: 0;
		font-size: 1.2rem;
		line-height: 1.3;
	}

	.action-card p {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.55;
		color: var(--text-2);
		flex-grow: 1;
	}

	.action-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		align-self: flex-start;
		margin-top: 0.5rem;
		background: var(--brand);
		color: #1a1a1a;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.92rem;
		padding: 0.6rem 1.1rem;
		border-radius: 999px;
		transition:
			transform 0.2s ease,
			background 0.2s ease;
	}

	.action-cta:hover,
	.action-cta:focus-visible {
		transform: translateY(-1px);
		background: var(--btn-hover-bg);
	}

	/* ── Partage ───────────────────────────────────────────── */
	.closing {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0 0 5rem;
		padding: 1rem 1.25rem;
		border-radius: 12px;
		background: var(--bg-subtle);
		color: var(--text-2);
		font-size: 0.98rem;
		line-height: 1.5;
	}

	.closing :global(svg) {
		flex-shrink: 0;
		color: var(--brand-subtle);
	}

	@media (max-width: 640px) {
		article {
			padding: 0 1rem;
		}

		.hero {
			padding: 2rem 1.35rem;
		}
	}
</style>
