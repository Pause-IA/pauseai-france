<script lang="ts">
	import Button from '$components/Button.svelte'
	import TabList from '$components/TabList.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Fly from '$components/Fly.svelte'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	$: prefix = lang === 'en' ? '/en' : ''
	$: tabs =
		lang === 'en'
			? ['Economic & material', 'For individuals', 'For society', 'For humanity']
			: [
					'Économiques et matériels',
					'Pour les individus',
					'Pour la société',
					'Pour l\u2019humanité'
				]

	const label_id = 'risks-title'
</script>

<section aria-labelledby={label_id}>
	<Fly>
		<TabList {tabs} id="risks-tabs" let:tab {label_id}>
			<svelte:fragment slot="header">
				<UnderlinedTitle id={label_id}
					>{lang === 'en' ? 'The dangers' : 'Les dangers'}</UnderlinedTitle
				>
			</svelte:fragment>
			{tab}
			<svelte:fragment slot="panel" let:tab>
				{#if lang === 'en'}
					{#if tab === 'Economic & material'}
						<p>
							AI labs are planning to automate
							<a href="https://www.palladiummag.com/2024/05/17/my-last-five-years-of-work/"
								>all human work within 4 years</a
							>. Whether they fully achieve this goal or not, it's clear we're heading toward a
							major upheaval in the labor market. We must prepare for an unprecedented economic
							shock.
						</p>
						<p>
							<a
								href="https://www.crowdstrike.com/cybersecurity-101/cyberattacks/ai-powered-cyberattacks/"
								>Economic and material dangers</a
							> linked to AI directly threaten our infrastructure, businesses and resources. This technology
							introduces unprecedented vulnerabilities and possibilities for catastrophic failures. Imagine
							devastating AI-facilitated attacks, or the collapse of entire sectors facing these disruptive
							technologies. These dangers, though less visible than those directly threatening human
							lives, can have equally massive consequences.
						</p>
						<p>
							We must exercise heightened vigilance and put rigorous regulations in place to protect
							ourselves.
						</p>
						<p>
							To learn more about AI risks in the labor market, visit our <a
								href="{prefix}/emploi-ia">AI Employment working group</a
							>.
						</p>
						<Button href="{prefix}/dangers/economic-and-material">Learn more</Button>
					{:else if tab === 'For individuals'}
						<p>
							Imagine yourself on a dating app, exchanging messages with what seems like the perfect
							person. But are you really talking to a human being? Today, the answer may seem
							obvious, but this reality is about to change radically. The technology to create
							conversations
							<a href="https://techxplore.com/news/2024-02-secrets-social-bots-ai-role.html"
								>indistinguishable from human interactions already exists</a
							>. It will soon be deployed and make it impossible to distinguish between a human and
							an AI.
						</p>
						<p>
							This rapid evolution reveals how deeply AI is infiltrating our daily lives,
							threatening our privacy, security and wellbeing. Every day, we risk seeing our private
							life violated and our <a href="https://arxiv.org/pdf/2403.14380"
								>opinions manipulated by disinformation</a
							>: the consequences would be devastating.
						</p>
						<Button href="{prefix}/dangers/for-individuals">Learn more</Button>
					{:else if tab === 'For society'}
						<p>
							According to the majority of experts, AI will be capable of designing and synthesizing
							viruses more deadly than anything we know today in the very near future.
							<a href="https://arxiv.org/abs/2306.03809">AI-assisted bioterrorism</a> is just one
							example among a multitude of emerging threats. The risk of
							<a
								href="https://blog.checkpoint.com/2023/03/15/check-point-research-conducts-initial-security-analysis-of-chatgpt4-highlighting-potential-scenarios-for-accelerated-cybercrime/"
								>devastating cyberattacks</a
							>, orchestrated or amplified by sophisticated AI, looms over our critical
							infrastructure and communication systems.
						</p>
						<p>
							These scenarios are just the visible part of a much larger danger: AI threatens the
							very heart of our society. It touches social cohesion and the foundations of our
							democracy. Our democratic processes are weakened by polarization and disinformation.
							Racial biases are exacerbated, <a href="{prefix}/emploi-ia">job automation looms</a>,
							and the shadow of new forms of war and terrorism hangs over us.
						</p>
						<Button href="{prefix}/dangers/for-society">Learn more</Button>
					{:else if tab === 'For humanity'}
						<p>
							OpenAI, DeepMind, Anthropic and other tech giants are investing billions of dollars in
							creating AI with superhuman capabilities. Their leaders claim they could succeed
							within the next four years. They admit they don't know how to control their creation
							and publicly acknowledge that <a
								href="https://www.cnn.com/2023/10/31/tech/sam-altman-ai-risk-taker/index.html"
								>humanity could go extinct</a
							> because of it.
						</p>
						<p>
							The world's most eminent AI experts have signed an <a
								href="https://futureoflife.org/open-letter/pause-giant-ai-experiments/"
								>open letter</a
							> warning that "AI poses an existential risk to humanity, on par with pandemics and nuclear
							wars."
						</p>
						<p>
							According to the <a
								href="https://wiki.aiimpacts.org/ai_timelines/predictions_of_human-level_ai_timelines/ai_timeline_surveys/2023_expert_survey_on_progress_in_ai"
								>2023 AI Impacts survey</a
							> of 2,778 AI researchers, the median estimated probability of human extinction is 5%,
							and more than a third of respondents place it above 10%.
						</p>
						<p>
							Never before has humanity faced such an imminent and potentially catastrophic threat.
							Unlike other challenges, the AI crisis is distinguished by its extreme urgency and its
							potential for radical transformation in the very short term, sparking an unprecedented
							mobilization of the greatest minds of our era.
						</p>
						<p>Are we going to wait for a global catastrophe to react?</p>
						<Button href="{prefix}/dangers/for-humanity">Learn more</Button>
					{/if}
				{:else if tab === 'Économiques et matériels'}
					<p>
						Les laboratoires d'IA ont pour projet d'automatiser
						<a href="https://www.palladiummag.com/2024/05/17/my-last-five-years-of-work/"
							>la totalité du travail humain d'ici 4 ans</a
						>. Qu'ils atteignent pleinement cet objectif ou non, il est évident que nous nous
						dirigeons vers un bouleversement majeur du marché du travail. Nous devons nous préparer
						à affronter un choc économique sans précédent.
					</p>
					<p>
						Les <a
							href="https://www.crowdstrike.com/cybersecurity-101/cyberattacks/ai-powered-cyberattacks/"
							>dangers économiques et matériels</a
						> liés aux intelligences artificielles menacent directement nos infrastructures, nos entreprises
						et nos ressources. Cette technologie introduit des vulnérabilités inédites et des possibilités
						de dysfonctionnements catastrophiques. Imaginez des attaques dévastatrices facilitées par
						l'IA, ou l'effondrement de secteurs entiers face à ces technologies de rupture. Ces dangers,
						bien que moins visibles que ceux menaçant directement les vies humaines, peuvent avoir des
						conséquences tout aussi massives.
					</p>
					<p>
						Nous devons faire preuve d'une vigilance accrue et mettre en place des régulations
						rigoureuses pour nous protéger.
					</p>
					<p>
						Si vous souhaitez en savoir plus sur les risques de l'intelligence artificielle sur le
						marché du travail, n'hésitez pas à visiter le site de notre groupe de travail <a
							href="{prefix}/emploi-ia">Emploi IA.</a
						>
					</p>
					<Button href="/dangers/economiques-et-materiels">En apprendre davantage</Button>
				{:else if tab === 'Pour les individus'}
					<p>
						Imaginez-vous sur une application de rencontre, échangeant des messages avec ce qui
						semble être la personne parfaite. Mais êtes-vous vraiment en train de discuter avec un
						être humain ? Aujourd'hui, la réponse peut sembler évidente, mais cette réalité est sur
						le point de changer radicalement. La technologie permettant de créer des conversations
						<a href="https://techxplore.com/news/2024-02-secrets-social-bots-ai-role.html"
							>indiscernables d'interactions humaines existe déjà</a
						>. Elle sera bientôt déployée et rendra impossible toute distinction entre un humain et
						une IA.
					</p>
					<p>
						Cette évolution rapide révèle à quel point l'IA s'immisce dans notre quotidien, menace
						notre intimité, notre sécurité et notre bien-être. Chaque jour, nous risquons de voir
						notre vie privée violée et nos <a href="https://arxiv.org/pdf/2403.14380"
							>opinions manipulées par la désinformation</a
						> : les conséquences seraient dévastatrices.
					</p>
					<Button href="/dangers/pour-les-individus">En apprendre davantage</Button>
				{:else if tab === 'Pour la société'}
					<p>
						Selon la majorité des experts, les intelligences artificielles seront capables de
						concevoir et synthétiser à très court terme des virus plus mortels que tout ce que nous
						connaissons aujourd'hui. Le <a href="https://arxiv.org/abs/2306.03809"
							>bioterrorisme assisté par l'IA</a
						>
						n'est qu'un exemple parmi une multitude de menaces émergentes. Le risque de
						<a
							href="https://blog.checkpoint.com/2023/03/15/check-point-research-conducts-initial-security-analysis-of-chatgpt4-highlighting-potential-scenarios-for-accelerated-cybercrime/"
							>cyberattaques dévastatrices</a
						>, orchestrées ou amplifiées par des IA sophistiquées, plane sur nos infrastructures
						critiques et nos systèmes de communication.
					</p>
					<p>
						Ces scénarios ne sont que la partie visible d'un danger bien plus large : l'IA menace le
						cœur même de notre société. Elle touche à la cohésion sociale et aux fondements de notre
						démocratie. Nos processus démocratiques sont fragilisés par la polarisation et la
						désinformation. Les biais raciaux s'exacerbent, <a href="{prefix}/emploi-ia"
							>l'automatisation des emplois se profile</a
						>, et l'ombre de nouvelles formes de guerre et de terrorisme plane sur nous.
					</p>
					<Button href="/dangers/pour-la-societe">En apprendre davantage</Button>
				{:else if tab === 'Pour l\u2019humanité'}
					<p>
						OpenAI, DeepMind, Anthropic et d'autres géants technologiques investissent des milliards
						de dollars dans la création d'une IA aux capacités surhumaines. Leurs dirigeants
						affirment qu'ils pourraient réussir dans les quatres prochaines années. Ils admettent ne
						pas savoir comment contrôler leur création et reconnaissent publiquement que <a
							href="https://www.cnn.com/2023/10/31/tech/sam-altman-ai-risk-taker/index.html"
							>l'humanité pourrait s'éteindre</a
						> à cause de celle-ci.
					</p>
					<p>
						Les plus éminents experts en IA ont signé une <a
							href="https://futureoflife.org/open-letter/pause-giant-ai-experiments/"
							>lettre ouverte</a
						> avertissant que "L'IA représente un risque existentiel pour l'humanité, au même titre que
						les pandémies et les guerres nucléaires."
					</p>
					<p>
						Selon le <a
							href="https://wiki.aiimpacts.org/ai_timelines/predictions_of_human-level_ai_timelines/ai_timeline_surveys/2023_expert_survey_on_progress_in_ai"
							>sondage 2023 de AI Impacts</a
						> auprès de 2 778 chercheurs en IA, la probabilité médiane d'extinction est estimée à 5%,
						et plus d'un tiers des répondants la situent au-dessus de 10%.
					</p>
					<p>
						Jamais auparavant l'humanité n'a fait face à une menace aussi imminente et
						potentiellement catastrophique. Contrairement à d'autres défis, la crise de l'IA se
						distingue par son extrême urgence et son potentiel de transformation radicale à très
						court terme, suscitant une mobilisation sans précédent des plus grands esprits de notre
						époque.
					</p>
					<p>Allons-nous attendre une catastrophe mondiale pour réagir ?</p>
					<Button href="/dangers/pour-l'humanite">En apprendre davantage</Button>
				{/if}
			</svelte:fragment>
		</TabList>
	</Fly>
</section>

<style>
	section {
		background: var(--bg-subtle);
		border-radius: 1.5rem;
		padding: 1.25rem 1.25rem;
	}

	@media (min-width: 640px) {
		section {
			padding: 1.75rem 2.5rem;
		}
	}
</style>
