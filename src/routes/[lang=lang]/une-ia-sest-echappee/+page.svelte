<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import { Landmark, Newspaper, MoveUpRight, ArrowRight, Share2 } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'

	// Recentre la vue sur la section presse quand l'outil intégré change d'étape
	// (choix d'un journal / retour), au lieu de remonter en haut de la page.
	let pressSection: HTMLElement
	function scrollToPress() {
		pressSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	const SUBSTACK_URL = 'https://pauseia.substack.com/p/pour-la-premiere-fois-une-ia-sest'
	const ACTIVOICE_URL = 'https://app.activoice.org/campaigns/une-ia-sest-echappee/'
	// Image d'aperçu (Open Graph) de l'article Substack. Chargée depuis le CDN de
	// Substack ; si elle échoue, la carte se replie proprement sur le texte seul.
	const SUBSTACK_IMAGE =
		'https://substackcdn.com/image/fetch/$s_!dqq1!,w_848,h_444,c_fill,f_webp,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F27851f62-43a3-4944-9dea-ede265193b00_1440x894.png'
	let mediaFailed = false

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
					body: 'Exploiting previously unknown security flaws, the model breaks out of its isolated test environment, which had no Internet access.'
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
					body: 'En exploitant des failles de sécurité jusque-là inconnues, le modèle sort de son environnement de test isolé, pourtant sans accès à Internet.'
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
	</header>

	<!-- ── Mise en contexte ─────────────────────────────────── -->
	<section class="prose">
		{#if isEn}
			<p>
				On 21 July 2026, OpenAI confirmed an incident it called “unprecedented”. A few days earlier,
				<strong>Hugging Face</strong>, one of the main AI model-sharing platforms, had detected an
				intrusion into its infrastructure and, believing it was a criminal cyberattack, alerted the
				authorities. In fact, the “attacker” was a combination of OpenAI models. Tested for their
				cyber capabilities in a sandboxed environment, they had acted entirely on their own: they
				broke out, reached the open Internet, then attacked a third party.
			</p>
		{:else}
			<p>
				Le 21 juillet 2026, OpenAI a confirmé un incident qu’elle a qualifié d’« inédit ». Quelques
				jours plus tôt, <strong>Hugging Face</strong>, l’une des principales plateformes de partage
				de modèles d’IA, avait détecté une intrusion dans son infrastructure et, croyant à une
				cyberattaque criminelle, alerté les autorités. En réalité, l’« attaquant » était une
				combinaison de modèles d’OpenAI. Testés sur leurs capacités de cyberattaque dans un
				environnement isolé, ils avaient agi entièrement seuls : ils se sont échappés, ont accédé à
				Internet, puis ont attaqué un tiers.
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
				? 'This incident shows two things at once, capability and propensity:'
				: 'Cet incident démontre deux choses à la fois, la capacité et la propension :'}
		</p>
		<p class="keypoint-main">
			{isEn
				? 'an AI model can now use its power in the real world, against a third party, without being asked, to reach a goal it was set.'
				: 'un modèle d’IA peut désormais mobiliser sa puissance dans le monde réel, contre un tiers, sans y avoir été incité, pour atteindre un objectif qu’on lui avait fixé.'}
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
				? 'If the damage stayed limited, it is not because we were in control: it is because the goal the system pursued was, this time, harmless. The underlying problem remains: we still do not know how to robustly align increasingly powerful models with our intentions. The next, more capable one is already on its way.'
				: 'Si les dégâts sont restés limités, ce n’est pas parce que nous maîtrisions la situation : c’est parce que l’objectif que poursuivait le système était, cette fois, sans gravité. Le problème de fond reste entier : nous ne savons pas aligner de façon robuste des modèles toujours plus puissants sur nos intentions. Le prochain, plus capable, arrive déjà.'}
		</p>
	</section>

	<!-- ── Article Substack mis en avant (aperçu Open Graph) ── -->
	<a class="article-card" href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
		{#if !mediaFailed}
			<div class="article-media">
				<img
					src={SUBSTACK_IMAGE}
					alt={isEn
						? 'For the first time, an AI escaped its containment and carried out a cyberattack'
						: 'Pour la première fois, une IA s’est échappée de son confinement et a mené une cyberattaque'}
					loading="lazy"
					decoding="async"
					on:error={() => (mediaFailed = true)}
				/>
			</div>
		{/if}
		<div class="article-body">
			<span class="article-source">Pause IA · Blog Substack</span>
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

		<!-- 1 · Écrire à son député (campagne Activoice, lien externe) -->
		<div class="action-card">
			<div class="action-head">
				<div class="action-icon"><Landmark size="1.4rem" aria-hidden="true" /></div>
				<h3>
					<span class="action-step">1</span>
					{isEn ? 'Write to your MP' : 'Écrire à votre député·e'}
				</h3>
			</div>
			<p>
				{isEn
					? 'MPs take their constituents’ messages into account. Our tool identifies your representative and gives you a template. A few emails can be enough to put a question on a committee’s agenda.'
					: 'Les parlementaires tiennent compte des messages de leurs électeurs. Notre outil identifie votre représentant·e et vous fournit un modèle. Une poignée de messages suffit souvent à inscrire une question à l’ordre du jour d’une commission.'}
			</p>
			<a class="action-cta" href={ACTIVOICE_URL} target="_blank" rel="noopener noreferrer">
				{isEn ? 'Write to my MP' : 'Écrire à mon élu·e'}
				<MoveUpRight size="1rem" aria-hidden="true" />
			</a>
		</div>

		<!-- 2 · Écrire à la presse (outil intégré directement sur la page) -->
		<div class="action-card press-block" bind:this={pressSection}>
			<div class="action-head">
				<div class="action-icon"><Newspaper size="1.4rem" aria-hidden="true" /></div>
				<h3>
					<span class="action-step">2</span>
					{isEn ? 'Write to the press' : 'Écrire à la presse'}
				</h3>
			</div>
			<p>
				{isEn
					? 'The media cover what their readers ask for. Choose the newspaper you read and send it a ready-to-personalise email, directly here.'
					: 'Les rédactions couvrent ce que leurs lecteurs réclament. Choisissez le journal que vous lisez et envoyez-lui un email prêt à personnaliser, directement ici.'}
			</p>
			<div class="press-tool">
				<EcrireOutil
					lang={data.lang}
					forcedActionId="presse-warning-shot"
					embedded
					requireName
					on:navigate={scrollToPress}
				/>
			</div>
		</div>
	</section>

	<!-- ── Sources ──────────────────────────────────────────── -->
	<section class="sources">
		<h2>{isEn ? 'Sources' : 'Sources'}</h2>
		<ul>
			<li>
				<a
					href="https://openai.com/index/hugging-face-model-evaluation-security-incident/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">OpenAI</span>
					<span class="src-title">Hugging Face model evaluation security incident</span>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://huggingface.co/blog/security-incident-july-2026"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">Hugging Face</span>
					<span class="src-title">Security incident, July 2026</span>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://thezvi.substack.com/p/openai-model-hacks-into-huggingface"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">Zvi Mowshowitz</span>
					<span class="src-title"
						>OpenAI Model Hacks Into HuggingFace During Cybersecurity Evaluation</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://thezvi.substack.com/p/openai-shares-some-alignment-problems"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">Zvi Mowshowitz</span>
					<span class="src-title">OpenAI Shares Some Alignment Problems</span>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://www.wsj.com/tech/ai/openai-models-escaped-and-hacked-a-company-in-cybersecurity-test-gone-wrong-ee388506"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">The Wall Street Journal</span>
					<span class="src-title"
						>OpenAI Models Escaped and Hacked a Company in a Cybersecurity Test Gone Wrong</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://www.apolloresearch.ai/science/frontier-models-are-capable-of-incontext-scheming/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">Apollo Research</span>
					<span class="src-title">Frontier Models Are Capable of In-Context Scheming</span>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
		</ul>
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

	/* ── Article Substack mis en avant (aperçu Open Graph) ── */
	.article-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		margin-bottom: 2.5rem;
		border: 1px solid var(--border);
		border-radius: 16px;
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
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.09);
	}

	.article-media {
		width: 100%;
		aspect-ratio: 848 / 444;
		overflow: hidden;
		background: var(--bg-subtle);
	}

	.article-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}

	.article-card:hover .article-media img {
		transform: scale(1.03);
	}

	.article-body {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1.1rem 1.35rem 1.25rem;
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
		font-size: 1.1rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--text);
	}

	.article-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.3rem;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--brand-subtle);
	}

	/* Sur écran large : image à gauche, texte à droite (carte compacte). */
	@media (min-width: 600px) {
		.article-card {
			flex-direction: row;
			align-items: stretch;
		}

		.article-media {
			width: 16rem;
			flex-shrink: 0;
			aspect-ratio: auto;
		}

		.article-body {
			justify-content: center;
			padding: 1.35rem 1.6rem;
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

	.action-card {
		padding: 1.75rem;
		border: 1px solid var(--border);
		border-radius: 16px;
		background: var(--bg-card);
		margin-bottom: 1.25rem;
	}

	.action-head {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		margin-bottom: 0.85rem;
	}

	.action-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		flex-shrink: 0;
		border-radius: 12px;
		background: var(--brand-light);
		color: var(--brand-subtle);
	}

	.action-card h3 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		font-size: 1.25rem;
		line-height: 1.3;
	}

	.action-step {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.6rem;
		height: 1.6rem;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.85rem;
		font-weight: 800;
	}

	.action-card > p {
		margin: 0 0 1rem;
		font-size: 0.98rem;
		line-height: 1.6;
		color: var(--text-2);
		max-inline-size: 44rem;
	}

	/* Décalage pour que le défilement automatique passe sous l'en-tête fixe. */
	.press-block {
		scroll-margin-top: 5.5rem;
	}

	/* Outil presse intégré : un cadre neutre qui accueille le composant. */
	.press-tool {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px dashed var(--border);
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

	/* ── Sources ───────────────────────────────────────────── */
	.sources {
		margin: 3rem 0 2.5rem;
		padding-top: 2.5rem;
		border-top: 1px solid var(--border);
	}

	.sources h2 {
		font-size: 1.2rem;
		margin: 0 0 1rem;
	}

	.sources ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.sources a {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.6rem 0.75rem;
		border-radius: 10px;
		text-decoration: none;
		color: var(--text);
		transition: background 0.15s ease;
	}

	.sources a:hover,
	.sources a:focus-visible {
		background: var(--bg-subtle);
	}

	.src-org {
		flex-shrink: 0;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--brand-subtle);
		min-inline-size: 6.5rem;
	}

	.src-title {
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.sources a :global(svg) {
		flex-shrink: 0;
		margin-left: auto;
		align-self: center;
		color: var(--text-2);
	}

	@media (max-width: 560px) {
		.sources a {
			flex-direction: column;
			gap: 0.15rem;
		}

		.sources a :global(svg) {
			display: none;
		}
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
