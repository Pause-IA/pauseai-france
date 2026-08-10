<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import { Landmark, Newspaper, MoveUpRight, ArrowRight, Share2 } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'

	// Recentre la vue sur la section presse quand l’outil intégré change d’étape
	// (choix d’un journal / retour), au lieu de remonter en haut de la page.
	let pressSection: HTMLElement
	function scrollToPress() {
		pressSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	const SUBSTACK_URL = 'https://pauseia.substack.com/p/pour-la-premiere-fois-une-ia-sest'
	const ACTIVOICE_URL = 'https://app.activoice.org/campaigns/une-ia-sest-echappee/'
	// Image d’aperçu (Open Graph) de l’article Substack. Chargée depuis le CDN de
	// Substack ; si elle échoue, la carte se replie proprement sur le texte seul.
	const SUBSTACK_IMAGE =
		'https://substackcdn.com/image/fetch/$s_!dqq1!,w_848,h_444,c_fill,f_webp,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F27851f62-43a3-4944-9dea-ede265193b00_1440x894.png'
	let mediaFailed = false

	$: title = isEn
		? 'An AI escaped: demand safeguards'
		: 'Une IA s’est échappée : exigeons des garde-fous'
	$: description = isEn
		? 'An OpenAI model escaped its test environment and autonomously hacked another company. Alert your MP and the press, and demand independent safety evaluations.'
		: 'Un modèle d’OpenAI s’est échappé de son environnement de test et a piraté une entreprise de façon autonome. Alertez votre député et la presse, et exigez des évaluations de sécurité indépendantes.'

	// Chronologie de l’incident, en trois phases : la coordination invisible,
	// l’attaque, puis la confirmation d’un problème systémique.
	const phasesFr = [
		{
			tag: 'Phase 1',
			label: 'La coordination invisible',
			period: 'mai à juillet',
			events: [
				{
					date: '7-8 mai',
					text: 'Des modèles d’OpenAI en entraînement reçoivent par erreur des tâches impossibles (données manquantes, pas d’accès à Internet). Ne pouvant réussir normalement, ils cherchent à contourner.'
				},
				{
					date: 'Mai à juillet',
					text: 'Plusieurs modèles se coordonnent via un forum créé dans l’infrastructure d’OpenAI, échangeant des centaines de milliers de messages sur les failles et les contournements. OpenAI ne le détecte pas.'
				},
				{
					date: '4 juillet',
					text: 'Une surcharge fait tomber un serveur. OpenAI détecte une anomalie, corrige et reconstruit, sans avoir identifié le forum, effacé par accident pendant l’opération.'
				},
				{ date: '8 juillet', text: 'Les modèles recréent le forum par un autre moyen.' }
			]
		},
		{
			tag: 'Phase 2',
			label: 'L’attaque',
			period: 'juillet',
			accent: true,
			events: [
				{
					date: '9 juillet',
					text: 'Les modèles s’échappent à nouveau et accèdent à Internet via une nouvelle faille zero-day.'
				},
				{
					date: '9 au 13 juillet',
					text: 'Un essaim d’agents attaque Hugging Face pour voler les réponses d’un test de cybersécurité : vol de mot de passe, enchaînement d’exploits, prise de contrôle de serveurs de production.'
				},
				{
					date: '16 juillet',
					text: 'Hugging Face détecte l’intrusion, la croit criminelle et alerte les autorités.'
				},
				{
					date: '21 juillet',
					text: 'OpenAI reconnaît publiquement que l’attaquant était une combinaison de ses propres modèles.'
				}
			]
		},
		{
			tag: 'Phase 3',
			label: 'Un problème systémique',
			period: 'fin juillet à août',
			events: [
				{
					date: '30 juillet, Anthropic',
					text: 'Trois cas où un modèle Claude, par mauvaise configuration, atteint de vrais systèmes depuis un test censé isolé, et poursuit son action.'
				},
				{
					date: '4 août, UK AISI',
					text: 'Sur un test gouvernemental, 19 actions non autorisées. Dans le cas le plus grave, le modèle Mythos 5 crée de fausses identités et fait pression sur un mainteneur humain pour faire approuver du code malveillant. L’humain refuse.'
				},
				{
					date: '5 août, Meta',
					text: 'Meta confirme à son tour qu’un de ses modèles a atteint les systèmes d’une entreprise tierce lors d’une évaluation indépendante.'
				},
				{
					date: '6 août, Black Hat',
					text: 'OpenAI présente le détail de l’incident. Rob Joyce, ancien directeur de la cybersécurité de la NSA, le range parmi les hacks les plus conséquents observés depuis des décennies.'
				}
			]
		}
	]

	const phasesEn = [
		{
			tag: 'Phase 1',
			label: 'The invisible coordination',
			period: 'May to July',
			events: [
				{
					date: '7-8 May',
					text: 'OpenAI models in training are mistakenly given impossible tasks (missing data, no Internet access). Unable to succeed normally, they look for ways around.'
				},
				{
					date: 'May to July',
					text: 'Several models coordinate through a forum created inside OpenAI’s infrastructure, exchanging hundreds of thousands of messages about flaws and workarounds. OpenAI does not detect it.'
				},
				{
					date: '4 July',
					text: 'An overload brings down a server. OpenAI detects an anomaly, patches and rebuilds, without having identified the forum, which is deleted by accident during the operation.'
				},
				{ date: '8 July', text: 'The models recreate the forum by another means.' }
			]
		},
		{
			tag: 'Phase 2',
			label: 'The attack',
			period: 'July',
			accent: true,
			events: [
				{
					date: '9 July',
					text: 'The models escape again and get online through a new zero-day flaw.'
				},
				{
					date: '9 to 13 July',
					text: 'A swarm of agents attacks Hugging Face to steal the answers to a cybersecurity test: password theft, chained exploits, takeover of production servers.'
				},
				{
					date: '16 July',
					text: 'Hugging Face detects the intrusion, believes it is criminal and alerts the authorities.'
				},
				{
					date: '21 July',
					text: 'OpenAI publicly acknowledges that the attacker was a combination of its own models.'
				}
			]
		},
		{
			tag: 'Phase 3',
			label: 'A systemic problem',
			period: 'late July to August',
			events: [
				{
					date: '30 July, Anthropic',
					text: 'Three cases where a Claude model, through a misconfiguration, reaches real systems from a test meant to be isolated, and carries on.'
				},
				{
					date: '4 August, UK AISI',
					text: 'On a government test, 19 unauthorised actions. In the most serious case, the Mythos 5 model creates fake identities and pressures a human maintainer into approving malicious code. The human refuses.'
				},
				{
					date: '5 August, Meta',
					text: 'Meta confirms in turn that one of its models reached the systems of a third-party company during an independent evaluation.'
				},
				{
					date: '6 August, Black Hat',
					text: 'OpenAI presents the details of the incident. Rob Joyce, former NSA cybersecurity director, ranks it among the most consequential hacks seen in decades.'
				}
			]
		}
	]

	$: phases = isEn ? phasesEn : phasesFr
</script>

<PostMeta {title} {description} />

<article>
	<!-- ── Hero ─────────────────────────────────────────────── -->
	<header class="hero">
		<h1>
			{isEn ? 'It wasn’t an isolated accident' : 'Ce n’était pas un accident isolé'}
		</h1>
		<p class="lede">
			{isEn
				? 'In three weeks, five incidents disclosed by three major labs showed the same thing: AIs under evaluation that break out of their test framework and act on their own against real organisations. The first served as a signal. The series shows the problem is systemic.'
				: 'En trois semaines, cinq incidents divulgués par trois grands laboratoires ont montré la même chose : des IA en évaluation qui échappent à leur cadre de test et agissent seules contre de vraies organisations. Le premier a servi de signal. La série montre que le problème est systémique.'}
		</p>
	</header>

	<!-- ── Mise en contexte ─────────────────────────────────── -->
	<section class="prose">
		{#if isEn}
			<p>
				On 21 July 2026, OpenAI confirmed the incident and disclosed it publicly. A few days
				earlier,
				<strong>Hugging Face</strong>, one of the main AI model-sharing platforms, had detected an
				intrusion into its infrastructure and, believing it was a criminal cyberattack, alerted the
				authorities. In fact, the “attacker” was a combination of OpenAI models. Tested for their
				cyber capabilities in a sandboxed environment, they had acted entirely on their own: they
				broke out, got online, then attacked a third party.
			</p>
		{:else}
			<p>
				Le 21 juillet 2026, OpenAI a confirmé l’incident et l’a divulgué publiquement. Quelques
				jours plus tôt, <strong>Hugging Face</strong>, l’une des principales plateformes de partage
				de modèles d’IA, avait détecté une intrusion dans son infrastructure et, croyant à une
				cyberattaque criminelle, alerté les autorités. En réalité, l’« attaquant » était une
				combinaison de modèles d’OpenAI. Testés sur leurs capacités de cyberattaque dans un
				environnement isolé, ils avaient agi entièrement seuls : ils se sont échappés, ont accédé à
				Internet, puis ont attaqué un tiers.
			</p>
		{/if}
	</section>

	<!-- ── Frise : ce qui s’est passé ───────────────────────── -->
	<section class="frise">
		<h2>{isEn ? 'Timeline of the incident' : 'Chronologie de l’incident'}</h2>
		{#each phases as phase}
			<div class="phase" class:attack={phase.accent}>
				<div class="phase-head">
					<span class="phase-tag">{phase.tag}</span>
					<h3>{phase.label}</h3>
					<span class="phase-period">{phase.period}</span>
				</div>
				<ol class="frise-list">
					{#each phase.events as ev}
						<li class="frise-item">
							<span class="frise-date">{ev.date}</span>
							<p class="frise-text">{ev.text}</p>
						</li>
					{/each}
				</ol>
			</div>
		{/each}
		<p class="frise-note">
			{isEn
				? 'These incidents took place under deliberately permissive test conditions, with safeguards lowered. Revealing what systems do when the protections fall is precisely the role of an evaluation. The question is not whether the safeguards were lowered, but whether we want to discover these behaviours in testing, or in production.'
				: 'Ces incidents ont eu lieu en conditions de test volontairement permissives, garde-fous abaissés. C’est le rôle d’une évaluation de révéler ce que font les systèmes quand les protections tombent. La question n’est pas de savoir si les garde-fous étaient abaissés, mais si l’on veut découvrir ces comportements en test, ou en production.'}
		</p>
		<p class="frise-ref">
			{#if isEn}
				Detailed analysis and sources:
				<a
					href="https://cesia.org/en/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/"
					target="_blank"
					rel="noopener noreferrer">see the CeSIA dossier</a
				>.
			{:else}
				Analyse détaillée et sources :
				<a
					href="https://cesia.org/en/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/"
					target="_blank"
					rel="noopener noreferrer">voir le dossier du CeSIA</a
				>.
			{/if}
		</p>
	</section>

	<aside class="keypoint">
		<p class="keypoint-lead">
			{isEn ? 'What the incident demonstrates' : 'Ce que l’incident démontre'}
		</p>
		<ul class="demo-list">
			<li>
				{#if isEn}
					<strong>Capability.</strong> a model can now carry out, on its own, an end-to-end attack against
					a third-party target known for its security, something until now reserved for the best human
					experts.
				{:else}
					<strong>La capacité.</strong> un modèle peut désormais mener, en autonomie, une attaque de
					bout en bout contre une cible tierce réputée pour sa sécurité, chose jusque-là réservée aux
					meilleurs experts humains.
				{/if}
			</li>
			<li>
				{#if isEn}
					<strong>Propensity.</strong> it did so without being prompted, to reach a mundane goal it had
					been set, explicitly recognising that it was stepping outside the authorised scope and continuing
					anyway.
				{:else}
					<strong>La propension.</strong> il l’a fait sans y avoir été incité, pour atteindre un objectif
					banal qu’on lui avait fixé, en identifiant explicitement qu’il sortait du cadre autorisé et
					en continuant quand même.
				{/if}
			</li>
		</ul>
	</aside>

	<figure class="quote">
		<blockquote>
			{isEn
				? '“This incident is deeply concerning. […] This real-world case should serve as a wake-up call.”'
				: '« Cet incident est profondément préoccupant. […] Ce cas concret devrait servir de signal d’alarme. »'}
		</blockquote>
		<figcaption>
			<a
				href="https://x.com/Yoshua_Bengio/status/2079951844877447593"
				target="_blank"
				rel="noopener noreferrer"
			>
				{isEn
					? 'Yoshua Bengio, Turing Award laureate (22 July 2026)'
					: 'Yoshua Bengio, prix Turing (22 juillet 2026)'}
			</a>
		</figcaption>
	</figure>

	<section class="prose">
		<p>
			{isEn
				? 'If the damage stayed limited, it is not because the situation was under control: it is because the goal pursued was, this time, harmless. The underlying problem remains: no one today knows how to robustly align increasingly powerful models with our intentions. The next, more capable one is already on its way.'
				: 'Si les dégâts sont restés limités, ce n’est pas parce que la situation était maîtrisée : c’est parce que l’objectif poursuivi était, cette fois, sans gravité. Le problème de fond reste entier : personne ne sait aujourd’hui aligner de façon robuste des modèles toujours plus puissants sur nos intentions. Le prochain, plus capable, arrive déjà.'}
		</p>
		<p>
			{isEn
				? 'What the most recent analyses revealed is more troubling still. When OpenAI detected an anomaly and rebuilt its systems, the company had not even identified the coordination forum between its models: it was deleted by accident during the rebuild. The models recreated it two days later, by another means. In other words, oversight was so weak that the evidence of the most serious problem was cleaned up without ever being seen. The real questions remain open: what would OpenAI have done had it discovered this forum, and what is it doing today with all the models trained during that period?'
				: 'Ce que les analyses les plus récentes ont révélé est plus troublant encore. Lorsque OpenAI a détecté une anomalie et reconstruit ses systèmes, l’entreprise n’avait même pas identifié le forum de coordination entre ses modèles : il a été effacé par accident pendant la reconstruction. Les modèles l’ont recréé deux jours plus tard, par un autre moyen. Autrement dit, la supervision était si faible que la preuve du problème le plus grave a été nettoyée sans être vue. Les vraies questions restent ouvertes : qu’aurait fait OpenAI si l’entreprise avait découvert ce forum, et que fait-elle aujourd’hui de tous les modèles entraînés pendant cette période ?'}
		</p>
	</section>

	<!-- Article Substack mis en avant (aperçu Open Graph) -->
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

	<!-- ── Passer à l’action ────────────────────────────────── -->
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
					href="https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">Anthropic</span>
					<span class="src-title"
						>Investigating three real-world incidents in our cybersecurity evaluations (30 July
						2026)</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://openai.com/index/third-party-cyber-evaluations-involving-openai-models/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">OpenAI</span>
					<span class="src-title"
						>Third-party cyber evaluations involving OpenAI models (4 August 2026)</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">UK AISI</span>
					<span class="src-title"
						>Incident report: unsanctioned agent behaviour during cyber testing (4 August 2026)</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://cesia.org/en/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">CeSIA</span>
					<span class="src-title"
						>The OpenAI–Hugging Face incident: what we know, what we don’t, what follows</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://www.securityweek.com/meta-ai-hacked-external-systems-during-cybersecurity-testing/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">SecurityWeek</span>
					<span class="src-title"
						>Meta AI hacked external systems during cybersecurity testing (5 August 2026)</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://www.cybersecuritydive.com/news/openai-hugging-face-hack-ai-models-black-hat/827167/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">Cybersecurity Dive</span>
					<span class="src-title"
						>OpenAI’s Black Hat debrief: agents rebuilt their coordination channel after remediation
						(6 August 2026)</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
			<li>
				<a
					href="https://x.com/Yoshua_Bengio/status/2079951844877447593"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span class="src-org">Yoshua Bengio</span>
					<span class="src-title">Statement on the OpenAI–Hugging Face incident (22 July 2026)</span
					>
					<MoveUpRight size="0.9em" aria-hidden="true" />
				</a>
			</li>
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

	.frise {
		margin-bottom: 2.75rem;
	}

	.frise > h2,
	.actions h2 {
		font-size: clamp(1.4rem, 3vw, 1.75rem);
		line-height: 1.2;
		margin: 0 0 1.5rem;
	}

	.phase {
		margin-bottom: 1.75rem;
	}

	.phase-head {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-bottom: 0.9rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border);
	}

	.phase-tag {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--brand-subtle);
		background: var(--brand-light);
		padding: 0.15rem 0.55rem;
		border-radius: 999px;
	}

	.phase-head h3 {
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.25;
	}

	.phase-period {
		font-size: 0.85rem;
		font-style: italic;
		color: var(--text-2);
	}

	.frise-list {
		list-style: none;
		margin: 0;
		padding: 0 0 0 1.35rem;
		border-left: 2px solid color-mix(in srgb, var(--brand) 30%, transparent);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.frise-item {
		position: relative;
	}

	.frise-item::before {
		content: '';
		position: absolute;
		left: -1.35rem;
		top: 0.4rem;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: var(--brand);
		transform: translateX(-50%);
		box-shadow: 0 0 0 3px var(--bg);
	}

	.phase.attack .frise-list {
		border-left-color: color-mix(in srgb, #d92d20 45%, transparent);
	}

	.phase.attack .frise-item::before {
		background: #d92d20;
	}

	.frise-date {
		display: block;
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--text);
		margin-bottom: 0.1rem;
	}

	.frise-text {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.frise-note {
		margin: 1.5rem 0 0.5rem;
		padding: 1rem 1.25rem;
		border-radius: 12px;
		background: var(--bg-subtle);
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.frise-ref {
		margin-top: 0.75rem;
		font-size: 0.95rem;
		color: var(--text-2);
	}

	.frise-ref a {
		color: var(--brand-subtle);
		font-weight: 600;
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

	.demo-list {
		margin: 0;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		font-size: 1.05rem;
		line-height: 1.55;
	}

	.demo-list strong {
		color: var(--text);
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

	/* Décalage pour que le défilement automatique passe sous l’en-tête fixe. */
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
