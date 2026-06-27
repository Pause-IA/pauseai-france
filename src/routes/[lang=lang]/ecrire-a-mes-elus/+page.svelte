<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { onMount } from 'svelte'
	import { lookupElus, isSampleData, type Elu, type LookupResult } from '$lib/data/elus'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'

	const BCC = 'campagne@pauseia.fr'

	// ── Étape du parcours : 1 = trouver ses élus, 2 = rédiger le mail ──
	let step: 1 | 2 = 1
	let selectedElu: Elu | null = null

	// ── Recherche des élus par code postal ──
	let codePostal = ''
	let result: LookupResult | null = null
	let searched = false
	let searchError: 'format' | 'notfound' | null = null

	function search() {
		searched = true
		const clean = codePostal.replace(/\s/g, '')
		if (!/^\d{5}$/.test(clean)) {
			result = null
			searchError = 'format'
			return
		}
		result = lookupElus(clean)
		searchError = result ? null : 'notfound'
	}

	function choose(elu: Elu) {
		selectedElu = elu
		step = 2
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
	}

	function back() {
		step = 1
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
	}

	// Formule d'appel personnalisée (civilité + titre selon le rôle).
	function salutation(elu: Elu): string {
		if (isEn) return `Dear ${elu.nom},`
		const titre = elu.role === 'depute' ? 'Député' : 'Sénateur'
		if (elu.civ === 'Mme') return `Madame la ${titre === 'Député' ? 'Députée' : 'Sénatrice'},`
		if (elu.civ === 'M') return `Monsieur le ${titre},`
		return `Madame, Monsieur le ${titre},`
	}

	// Localité de l'élu (circonscription pour un député, département pour un sénateur).
	function localite(elu: Elu): string {
		return elu.role === 'depute'
			? (elu.nomCirco ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
			: (elu.nomDept ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
	}

	// 1re phrase, localisée : signale « je suis votre électeur ».
	// `name` est passé explicitement pour que Svelte recalcule l'aperçu à la frappe.
	function introLine(elu: Elu, name: string): string {
		const loc = localite(elu)
		const nom = name.trim() || (isEn ? '[your name]' : '[votre nom]')
		const zone = isEn ? 'constituency' : 'circonscription'
		const zoneSen = isEn ? 'department' : 'département'
		if (isEn) {
			return elu.role === 'depute'
				? `My name is ${nom}, a resident of your constituency: ${loc}.`
				: `My name is ${nom}, a resident of your department: ${loc}.`
		}
		return elu.role === 'depute'
			? `Je suis ${nom}, habitant de votre ${zone} : ${loc}.`
			: `Je suis ${nom}, habitant de votre ${zoneSen} : ${loc}.`
	}

	// L'aperçu (#email-body) est déjà personnalisé pour l'élu choisi : il suffit
	// d'en prendre le texte brut.
	function buildBody(): string {
		const el = document.getElementById('email-body')
		return el ? el.innerText : ''
	}

	function mailtoHref(elu: Elu): string {
		const params = new URLSearchParams({ subject, bcc: BCC, body: buildBody() })
		// URLSearchParams encode les espaces en "+", à reconvertir en %20 pour mailto.
		return `mailto:${elu.email ?? ''}?${params.toString().replace(/\+/g, '%20')}`
	}

	// ── Infos utilisateur pour personnaliser le mail (jamais envoyées à un serveur,
	// seulement injectées dans le brouillon et mémorisées localement) ──
	let userName = ''
	let userVille = ''
	function saveUser() {
		try {
			localStorage.setItem('elus-user', JSON.stringify({ userName, userVille, personalSentence }))
		} catch {
			/* localStorage indisponible */
		}
	}

	// ── Suivi de progression : élus déjà contactés (mémorisé localement) ──
	let sent = new Set<string>()
	onMount(() => {
		try {
			sent = new Set(JSON.parse(localStorage.getItem('elus-contactes') ?? '[]'))
			const u = JSON.parse(localStorage.getItem('elus-user') ?? '{}')
			userName = u.userName ?? ''
			userVille = u.userVille ?? ''
			personalSentence = u.personalSentence ?? ''
		} catch {
			sent = new Set()
		}
	})
	function markSent(id: string) {
		sent = new Set(sent).add(id)
		try {
			localStorage.setItem('elus-contactes', JSON.stringify([...sent]))
		} catch {
			/* localStorage indisponible : on ignore */
		}
	}

	// Journalise l'intention d'envoi côté serveur, sans donnée personnelle.
	// `sendBeacon` est conçu pour survivre à la navigation immédiate vers le
	// client mail (un simple fetch serait annulé). Aucune preuve d'envoi réel :
	// c'est le clic, pas l'email. Le compteur fiable reste le BCC.
	function logIntent(elu: Elu) {
		if (typeof navigator === 'undefined' || !navigator.sendBeacon) return
		try {
			const payload = JSON.stringify({
				eluId: elu.id,
				eluNom: elu.nom,
				role: elu.role,
				departement: elu.departement,
				circo: elu.circo ?? null,
				angle,
				version
			})
			navigator.sendBeacon('/api/log-intent', new Blob([payload], { type: 'application/json' }))
		} catch {
			/* journalisation best-effort : on ignore toute erreur */
		}
	}

	function openMail() {
		if (!selectedElu) return
		markSent(selectedElu.id)
		logIntent(selectedElu)
		window.location.href = mailtoHref(selectedElu)
	}

	function confidenceNote(elu: Elu): string | null {
		if (elu.emailConfidence === 'high' || elu.emailConfidence === 'medium') return null
		if (isEn) return 'Please double-check this address before sending.'
		return "Vérifiez l'adresse avant l'envoi."
	}

	// Masque une photo qui ne charge pas (404) → les initiales restent visibles.
	function hideImg(e: Event) {
		;(e.currentTarget as HTMLImageElement).style.display = 'none'
	}

	function initials(elu: Elu): string {
		const parts = elu.nom.trim().split(/\s+/)
		const first = parts[0]?.[0] ?? ''
		const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
		return (first + last).toUpperCase()
	}

	function eluSubtitle(elu: Elu): string {
		const base =
			elu.role === 'depute'
				? (elu.nomCirco ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
				: (elu.nomDept ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
		return elu.groupe && elu.groupe !== '—' ? `${base} · ${elu.groupe}` : base
	}

	// ── Angle principal du message (1 choix) ──
	type Angle = 'ensemble' | 'existentiel' | 'democratie' | 'emploi' | 'privacy'
	const angles: { id: Angle; fr: string; en: string }[] = [
		{ id: 'ensemble', fr: "Vue d'ensemble", en: 'Overview' },
		{ id: 'existentiel', fr: 'Risque existentiel', en: 'Existential risk' },
		{ id: 'democratie', fr: 'Démocratie & désinformation', en: 'Democracy & disinformation' },
		{ id: 'emploi', fr: 'Emploi & inégalités', en: 'Jobs & inequality' },
		{ id: 'privacy', fr: 'Vie privée & libertés', en: 'Privacy & freedoms' }
	]
	let angle: Angle = 'ensemble'
	let personalSentence = ''

	type Version = 'short' | 'long'
	let version: Version = 'short'

	// ── Contenu du mail (modulaire, sans tirets longs) ──
	// Plusieurs accroches : une est tirée au hasard par visiteur, pour diversifier
	// les envois (anti « copier-coller » repéré par les équipes parlementaires).
	const HOOKS = [
		{
			fr: "Les dirigeants des principaux laboratoires d'IA reconnaissent eux-mêmes que les systèmes les plus avancés pourraient représenter une menace majeure, voire un risque d'extinction. Le Rapport international sur la sécurité de l'IA, dirigé par le prix Turing Yoshua Bengio et présenté au Sommet de Paris, confirme qu'aucune méthode actuelle ne garantit leur contrôle.",
			en: 'The leaders of the main AI labs acknowledge that the most advanced systems could pose a major threat, even a risk of extinction. The International AI Safety Report, led by Turing Prize winner Yoshua Bengio and presented at the Paris Summit, confirms that no current method can guarantee their control.'
		},
		{
			fr: "En mai 2023, des centaines de scientifiques et les dirigeants des principaux laboratoires d'IA ont signé une déclaration commune : « Atténuer le risque d'extinction lié à l'IA devrait être une priorité mondiale, au même titre que les pandémies ou la guerre nucléaire. » Je partage profondément cette inquiétude.",
			en: 'In May 2023, hundreds of scientists and the leaders of the main AI labs signed a joint statement: "Mitigating the risk of extinction from AI should be a global priority, alongside other societal-scale risks such as pandemics and nuclear war." I deeply share this concern.'
		},
		{
			fr: "Le développement de l'IA s'accélère bien plus vite que notre capacité à l'encadrer. Des prix Turing comme Yoshua Bengio et Geoffrey Hinton, mais aussi les dirigeants d'OpenAI et d'Anthropic, alertent publiquement sur des risques graves et reconnaissent qu'aucune méthode ne permet aujourd'hui de garantir le contrôle de ces systèmes.",
			en: 'AI is advancing far faster than our ability to govern it. Turing Prize winners such as Yoshua Bengio and Geoffrey Hinton, along with the leaders of OpenAI and Anthropic, publicly warn of severe risks and admit that no method today can guarantee control of these systems.'
		}
	]
	// Tirée à l'initialisation (avant le 1er rendu côté client).
	let hookIndex = Math.floor(Math.random() * HOOKS.length)
	const FOCUS: Record<Angle, { fr: string; en: string }> = {
		ensemble: {
			fr: "Ces risques sont déjà concrets (désinformation, surveillance de masse, déstabilisation de l'emploi et de la démocratie), et la course aux modèles toujours plus autonomes accroît un risque existentiel.",
			en: 'These risks are already concrete (disinformation, mass surveillance, disruption of jobs and democracy), and the race toward ever more autonomous models increases an existential risk.'
		},
		existentiel: {
			fr: "Des chercheurs parmi les plus reconnus, comme Yoshua Bengio et Geoffrey Hinton, ainsi que les dirigeants d'OpenAI, de Google DeepMind et d'Anthropic, avertissent qu'une IA surpassant l'intelligence humaine pourrait, si elle échappait à notre contrôle, menacer l'existence même de l'humanité.",
			en: 'Some of the most respected researchers, such as Yoshua Bengio and Geoffrey Hinton, along with the leaders of OpenAI, Google DeepMind and Anthropic, warn that an AI surpassing human intelligence could, if it escaped our control, threaten the very existence of humanity.'
		},
		democratie: {
			fr: "Les systèmes d'IA produisent déjà de la désinformation et des deepfakes à grande échelle, indiscernables du réel, qui fragilisent le débat public, la confiance dans l'information et nos processus démocratiques.",
			en: 'AI systems already produce disinformation and deepfakes at scale, indistinguishable from reality, undermining public debate, trust in information and our democratic processes.'
		},
		emploi: {
			fr: "En automatisant un nombre croissant de tâches intellectuelles, ces systèmes menacent des millions d'emplois et risquent d'aggraver fortement les inégalités, sans politique d'adaptation à la hauteur.",
			en: 'By automating a growing share of intellectual tasks, these systems threaten millions of jobs and could sharply worsen inequality, with no adaptation policy on the right scale.'
		},
		privacy: {
			fr: 'Ces systèmes rendent possible une surveillance de masse et un profilage individuel sans précédent (analyse automatisée de nos traces en ligne, reconnaissance faciale), au détriment de la vie privée et des libertés.',
			en: 'These systems enable mass surveillance and unprecedented individual profiling (automated analysis of our online traces, facial recognition), at the expense of privacy and civil liberties.'
		}
	}
	const COMPLEMENT = {
		wide: {
			fr: "Au-delà de ce point, l'IA concentre tout un faisceau de risques (vie privée, désinformation, emploi, armes autonomes, et à terme un risque existentiel) qui appellent la même prudence : ralentir le temps de comprendre comment les maîtriser.",
			en: 'Beyond this specific point, AI concentrates a whole set of risks (privacy, disinformation, jobs, autonomous weapons, and ultimately an existential risk) that call for the same caution: slowing down long enough to understand how to keep them in check.'
		},
		exist: {
			fr: "Le plus préoccupant reste le risque existentiel : en construisant des systèmes plus intelligents que nous sans savoir les contrôler, nous prenons un pari dont l'humanité pourrait ne pas se relever.",
			en: 'The most worrying is the existential risk: by building systems more intelligent than us without knowing how to control them, we are taking a gamble humanity might not recover from.'
		}
	}
	const POLL = {
		fr: "Cette préoccupation est largement partagée : selon un sondage OpinionWay réalisé pour le CeSIA en 2026, seuls 8 % des Français souhaitent accélérer le développement de l'IA, et près de huit sur dix sont favorables à des accords internationaux interdisant les capacités d'IA qui menacent la vie humaine ou les droits fondamentaux.",
		en: 'This concern is widely shared: according to an OpinionWay poll for CeSIA in 2026, only 8% of French people want to accelerate AI development, and nearly eight in ten support international agreements banning AI capabilities that threaten human life or fundamental rights.'
	}
	const ASK = {
		fr: "Je vous demande de soutenir publiquement une gouvernance internationale visant à mettre en pause l'entraînement des modèles d'IA les plus avancés, tant que leur sûreté et leur contrôle démocratique ne sont pas démontrés, et de porter cette position aux niveaux français et européen. L'association Pause IA (pauseia.fr) se tient à votre disposition, ainsi que celle de votre équipe, pour un briefing.",
		en: 'I ask you to publicly support international governance aimed at pausing the training of the most advanced AI models, until their safety and democratic control are demonstrated, and to carry this position at the French and European level. The Pause AI association (pauseia.fr) would be glad to provide a briefing to you or your team.'
	}

	// Compose les paragraphes du corps selon l'angle, la longueur et la phrase perso.
	function buildParagraphs(a: Angle, v: Version, personal: string): string[] {
		const L = isEn ? 'en' : 'fr'
		const paras = [HOOKS[hookIndex][L], FOCUS[a][L]]
		if (v === 'long') {
			paras.push(a === 'ensemble' ? COMPLEMENT.exist[L] : COMPLEMENT.wide[L])
			paras.push(POLL[L])
		}
		if (personal.trim()) paras.push(personal.trim())
		paras.push(ASK[L])
		return paras
	}

	// ── Partage de la campagne (après envoi) ──
	const SHARE_URL = 'https://pauseia.fr/ecrire-a-mes-elus'
	$: shareText = isEn
		? 'I just wrote to my representatives about the risks of the most powerful AI. Two minutes, and you can too:'
		: "Je viens d'écrire à mes élus sur les risques des IA les plus puissantes. Deux minutes, et vous pouvez le faire aussi :"
	$: shareLinks = {
		x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SHARE_URL)}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`
	}
	$: joinHref = isEn ? '/en/rejoindre' : '/fr/rejoindre'
	let shareCopied = false
	function copyShareLink() {
		void navigator.clipboard.writeText(SHARE_URL).then(() => {
			shareCopied = true
			setTimeout(() => {
				shareCopied = false
			}, 2500)
		})
	}

	let copied = false
	function copyEmail() {
		const el = document.getElementById('email-body')
		if (!el) return
		void navigator.clipboard.writeText(el.innerText).then(() => {
			copied = true
			setTimeout(() => {
				copied = false
			}, 2500)
		})
	}

	$: subject = isEn
		? 'Governing the most powerful AI systems'
		: 'Encadrer le développement des IA les plus puissantes'

	$: eluGroups = result
		? [
				{ list: result.senateurs, title: isEn ? 'Your senators' : 'Vos sénateurs' },
				{
					list: result.deputes,
					title: !result.exactDeputes
						? isEn
							? 'The MPs of your department'
							: 'Les députés de votre département'
						: result.deputes.length > 1
							? isEn
								? 'Your MPs (your city)'
								: 'Vos députés (votre ville)'
							: isEn
								? 'Your MP'
								: 'Votre député'
				}
			]
		: []

	$: allElus = result ? [...result.senateurs, ...result.deputes] : []
	$: sentCount = allElus.filter((e) => sent.has(e.id)).length
</script>

<PostMeta
	title={isEn ? 'Write to your representatives | Pause AI' : 'Écrivez à vos élus | Pause IA'}
	description={isEn
		? 'Take 2 minutes to write to your MP and senator about the risks of advanced AI systems. Enter your postal code and send a ready-made email.'
		: "Prenez 2 minutes pour écrire à votre député et à votre sénateur sur les risques des systèmes d'IA. Entrez votre code postal et envoyez un email prêt à l'emploi."}
/>

<article>
	{#if step === 1}
		<!-- ════════ Étape 1 : trouver ses élus ════════ -->
		<header class="hero-band">
			<div class="hero-inner">
				<h1>{isEn ? 'Write to your representatives' : 'Écrivez à vos élus'}</h1>
				<p class="hero-sub">
					{#if isEn}
						The most powerful AI is being built with no real safeguards. Your representatives can
						change that. Write to them: it takes two minutes.
					{:else}
						Les IA les plus puissantes se développent sans véritable garde-fou. Vos élus peuvent
						changer ça. Écrivez-leur : cela prend deux minutes.
					{/if}
				</p>
			</div>
		</header>

		<section class="card">
			<h2>
				<span class="step-num">1</span>{isEn ? 'Find your representatives' : 'Trouvez vos élus'}
			</h2>

			<form class="cp-form" on:submit|preventDefault={search}>
				<input
					class="cp-input"
					type="text"
					inputmode="numeric"
					maxlength="5"
					placeholder={isEn ? 'Your postal code (e.g. 75011)' : 'Votre code postal (ex. 75011)'}
					bind:value={codePostal}
					aria-label={isEn ? 'Postal code' : 'Code postal'}
				/>
				<Button type="submit">{isEn ? 'Find' : 'Rechercher'}</Button>
			</form>

			<!-- Vos infos : saisies une seule fois, elles remplissent chaque mail
			     (jamais envoyées à un serveur, mémorisées sur votre appareil). -->
			<div class="user-fields">
				<input
					class="user-input"
					type="text"
					placeholder={isEn ? 'Your full name' : 'Votre nom complet'}
					autocomplete="name"
					bind:value={userName}
					on:input={saveUser}
				/>
				<input
					class="user-input"
					type="text"
					placeholder={isEn ? 'Your town' : 'Votre ville'}
					bind:value={userVille}
					on:input={saveUser}
				/>
			</div>
			<p class="user-fields-hint">
				{isEn
					? 'Used only to fill your emails, never sent to a server.'
					: 'Servent uniquement à remplir vos emails, jamais envoyées à un serveur.'}
			</p>

			{#if isSampleData}
				<p class="notice notice--warn">
					{isEn
						? 'Demo data. Run the generation script to load real representatives and emails.'
						: "Données d'exemple. Lancez le script de génération pour charger les vrais élus et emails."}
				</p>
			{/if}

			{#if searchError === 'format'}
				<p class="notice notice--error">
					{isEn
						? 'A French postal code has 5 digits (e.g. 75011). Please check what you typed.'
						: 'Un code postal français comporte 5 chiffres (ex. 75011). Vérifiez votre saisie.'}
				</p>
			{:else if searchError === 'notfound'}
				<p class="notice notice--error">
					{isEn
						? 'No representative found for this postal code. Double-check it, or use the official directories below.'
						: 'Aucun élu trouvé pour ce code postal. Vérifiez-le, ou utilisez les annuaires officiels ci-dessous.'}
				</p>
			{/if}

			{#if result}
				<p class="results-hint" class:done-all={sentCount > 0 && sentCount >= allElus.length}>
					{#if sentCount >= allElus.length && allElus.length > 0}
						🎉 {isEn
							? `Done! You've written to all ${allElus.length} of your representatives. Thank you, this really helps.`
							: `Bravo ! Vous avez écrit à vos ${allElus.length} élus. Merci, votre geste compte vraiment.`}
					{:else if sentCount > 0}
						<strong>{sentCount}/{allElus.length}</strong>
						{isEn ? 'contacted.' : 'contactés.'}
						{isEn
							? 'Keep going with the others, each message counts.'
							: 'Continuez avec les autres, chaque message compte.'}
					{:else}
						{isEn
							? 'Write to each of your representatives: one personal email each.'
							: 'Écrivez à chacun de vos élus : un email personnel pour chaque.'}
					{/if}
				</p>
				{#if sentCount >= allElus.length && allElus.length > 0}
					<div class="share-box">
						<p class="share-title">
							{isEn ? 'Spread the word:' : 'Faites passer le mot :'}
						</p>
						<div class="share-links">
							<a class="share-btn" href={shareLinks.x} target="_blank" rel="noopener noreferrer"
								>X / Twitter</a
							>
							<a
								class="share-btn"
								href={shareLinks.facebook}
								target="_blank"
								rel="noopener noreferrer">Facebook</a
							>
							<a
								class="share-btn"
								href={shareLinks.linkedin}
								target="_blank"
								rel="noopener noreferrer">LinkedIn</a
							>
							<button class="share-btn" on:click={copyShareLink}>
								{#if shareCopied}
									{isEn ? '✓ Link copied' : '✓ Lien copié'}
								{:else}
									{isEn ? 'Copy link' : 'Copier le lien'}
								{/if}
							</button>
						</div>
						<a class="join-link" href={joinHref}>
							{isEn
								? 'Want to do more? Join Pause AI ↗'
								: 'Envie d’aller plus loin ? Rejoignez Pause IA ↗'}
						</a>
					</div>
				{/if}
				{#each eluGroups as group}
					{#if group.list.length}
						<div class="elu-group">
							<h3>{group.title}</h3>
							<ul class="elu-list">
								{#each group.list as elu (elu.id)}
									<li class="elu-card" class:done={sent.has(elu.id)}>
										<div class="elu-left">
											<span class="avatar">
												{initials(elu)}
												{#if elu.photo}
													<img src={elu.photo} alt="" loading="lazy" on:error={hideImg} />
												{/if}
											</span>
											<div class="elu-info">
												<strong>
													{#if sent.has(elu.id)}<span class="done-check">✓</span>{/if}{elu.nom}
												</strong>
												<small>{eluSubtitle(elu)}</small>
											</div>
										</div>
										<Button alt={sent.has(elu.id)} on:click={() => choose(elu)}>
											{#if sent.has(elu.id)}
												{isEn ? 'Written ✓' : 'Écrit ✓'}
											{:else}
												{isEn ? 'Write' : 'Écrire'}
											{/if}
										</Button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			{/if}

			{#if searched && !result}
				<details class="manual-fallback" open>
					<summary>
						{isEn ? 'Official directories' : 'Annuaires officiels'}
					</summary>
					<div class="find-links">
						<a
							class="find-btn"
							href="https://www.assemblee-nationale.fr/dyn/vos-deputes/carte-departements"
							target="_blank"
							rel="noopener noreferrer"
						>
							🏛️ {isEn ? 'Find my MP' : 'Trouver mon député'} · assemblee-nationale.fr
						</a>
						<a
							class="find-btn"
							href="https://www.senat.fr/vos-senateurs.html"
							target="_blank"
							rel="noopener noreferrer"
						>
							🏛️ {isEn ? 'Find my senator(s)' : 'Trouver mon/mes sénateurs'} · senat.fr
						</a>
					</div>
				</details>
			{/if}
		</section>

		<!-- Pourquoi c'est important -->
		<section class="card prose">
			<h2>{isEn ? 'Why it matters' : "Pourquoi c'est important"}</h2>
			{#if isEn}
				<p>
					MPs and senators take their constituents' messages into account. A personal email (even a
					short, sincere one) lands in a human inbox, gets read, and signals that a voter cares
					about this issue. Unlike a petition or a social media post, it carries real weight. A
					handful of emails from real citizens is often enough to put a topic on a committee's
					agenda.
				</p>
			{:else}
				<p>
					Les députés et sénateurs prennent en compte les messages de leurs électeurs. Un email
					personnel (même court et sincère) arrive dans une boite mail humaine, il est lu, et il
					signale qu'un électeur se préoccupe du sujet. Contrairement à une pétition ou à un post
					sur les réseaux, il a un vrai poids. Une poignée d'emails de vrais citoyens suffit souvent
					à inscrire un sujet à l'ordre du jour d'une commission.
				</p>
			{/if}
		</section>

		<!-- FAQ -->
		<section class="card faq">
			<h2>{isEn ? 'FAQ' : 'Questions fréquentes'}</h2>
			<Accordion id="faq-difference" noHash>
				<span slot="head">
					{isEn
						? 'Does contacting a representative really make a difference?'
						: 'Est-ce que contacter un élu change vraiment quelque chose ?'}
				</span>
				<p slot="details">
					{isEn
						? 'Yes. Representatives track how many constituents raise an issue, and it shapes what they prioritise. A few sincere emails can be enough to get a topic onto a committee’s agenda.'
						: "Oui. Les élus comptabilisent le nombre d'électeurs qui soulèvent un sujet, et cela oriente leurs priorités. Quelques emails sincères peuvent suffire à inscrire un sujet à l'ordre du jour d'une commission."}
				</p>
			</Accordion>
			<Accordion id="faq-duree" noHash>
				<span slot="head">{isEn ? 'How long does it take?' : 'Combien de temps ça prend ?'}</span>
				<p slot="details">
					{isEn
						? 'About two minutes. Enter your postal code and your name, pick a representative, and send.'
						: 'Environ deux minutes. Entrez votre code postal et votre nom, choisissez un élu, puis envoyez.'}
				</p>
			</Accordion>
			<Accordion id="faq-donnees" noHash>
				<span slot="head">
					{isEn ? 'What about my data?' : 'Et mes données ?'}
				</span>
				<p slot="details">
					{isEn
						? 'Your name and town stay on your device (used only to fill the draft, never sent to a server). The email is sent from your own mail app to your representative. A blind copy reaches us at campagne@pauseia.fr so we can measure and follow up the campaign; it therefore contains your message and your email address. You can remove that BCC before sending if you prefer.'
						: "Votre nom et votre ville restent sur votre appareil (ils servent seulement à remplir le brouillon, ils ne sont jamais envoyés à un serveur). L'email part de votre propre messagerie vers votre élu. Une copie cachée nous parvient à campagne@pauseia.fr pour mesurer et suivre la campagne : elle contient donc votre message et votre adresse. Vous pouvez retirer cette copie cachée avant l'envoi si vous le préférez."}
				</p>
			</Accordion>
			<Accordion id="faq-relance" noHash>
				<span slot="head">
					{isEn ? "What if I don't get a reply?" : "Et si je n'ai pas de réponse ?"}
				</span>
				<p slot="details">
					{isEn
						? 'Send from your personal address (an authentic email carries more weight), and feel free to follow up politely after about three weeks. You can also ask for a short meeting at their local office.'
						: "Envoyez depuis votre adresse personnelle (un email authentique a plus de poids), et n'hésitez pas à relancer poliment après environ trois semaines. Vous pouvez aussi demander un rendez-vous à leur permanence."}
				</p>
			</Accordion>
		</section>
	{:else if selectedElu}
		<!-- ════════ Étape 2 : rédiger le mail ════════ -->
		<button class="back-link" on:click={back}>
			← {isEn ? 'Back to my representatives' : 'Retour à mes élus'}
		</button>

		<section class="card">
			<h2>
				<span class="step-num">2</span>{isEn ? 'Your message' : 'Votre message'}
			</h2>

			<div class="recipient">
				<span class="avatar avatar--lg">
					{initials(selectedElu)}
					{#if selectedElu.photo}
						<img src={selectedElu.photo} alt="" on:error={hideImg} />
					{/if}
				</span>
				<div>
					<span class="recipient-label">{isEn ? 'To:' : 'À :'}</span>
					<strong>{selectedElu.nom}</strong>
					<small>{eluSubtitle(selectedElu)}</small>
					{#if selectedElu.contactUrl}
						<a
							class="profile-link"
							href={selectedElu.contactUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{isEn ? 'View official profile ↗' : 'Voir sa fiche officielle ↗'}
						</a>
					{/if}
				</div>
			</div>

			{#if !userName.trim()}
				<p class="card-intro">
					{#if isEn}
						Tip: add your name and town in step 1 and the email writes itself in full.
					{:else}
						Astuce : indiquez votre nom et votre ville à l'étape 1 et l'email se rédige entièrement.
					{/if}
				</p>
			{/if}

			<!-- Réglages compacts -->
			<div class="msg-toolbar">
				<div class="segmented" role="group" aria-label={isEn ? 'Length' : 'Longueur'}>
					<button class:active={version === 'short'} on:click={() => (version = 'short')}>
						{isEn ? 'Short' : 'Courte'}
					</button>
					<button class:active={version === 'long'} on:click={() => (version = 'long')}>
						{isEn ? 'Detailed' : 'Détaillée'}
					</button>
				</div>
			</div>

			<div class="angle-row">
				<span class="angle-label">
					{isEn ? 'What worries you most:' : 'Ce qui vous préoccupe le plus :'}
				</span>
				<div class="theme-chips">
					{#each angles as a}
						<button class="chip" class:active={angle === a.id} on:click={() => (angle = a.id)}>
							{isEn ? a.en : a.fr}
						</button>
					{/each}
				</div>
			</div>

			<label class="perso-field">
				<span
					>{isEn
						? 'Add a personal sentence (optional)'
						: 'Ajoutez une phrase personnelle (facultatif)'}</span
				>
				<textarea
					class="perso-input"
					rows="2"
					placeholder={isEn
						? 'Why this matters to you. An authentic line carries far more weight.'
						: 'Pourquoi cela vous touche. Une phrase sincère pèse bien plus lourd.'}
					bind:value={personalSentence}
					on:input={saveUser}
				></textarea>
			</label>

			<!-- Aperçu de l'email -->
			<div class="email-preview">
				<div class="email-subject-line">
					<span class="subject-label">{isEn ? 'Subject:' : 'Objet :'}</span>
					<span>{subject}</span>
				</div>
				<div class="email-body" id="email-body">
					<p>{salutation(selectedElu)}</p>
					<p>{introLine(selectedElu, userName)}</p>
					{#each buildParagraphs(angle, version, personalSentence) as para}
						<p>{para}</p>
					{/each}
					<p>
						{isEn ? 'Yours sincerely,' : 'Cordialement,'}<br />
						{userName.trim() || (isEn ? '[Your full name]' : '[Votre nom complet]')}<br />
						{userVille.trim() || localite(selectedElu)}
					</p>
				</div>
			</div>

			{#if confidenceNote(selectedElu)}
				<p class="notice notice--warn">{confidenceNote(selectedElu)}</p>
			{/if}

			<div class="send-row">
				{#if selectedElu.email}
					<Button on:click={openMail}>{isEn ? 'Open my email' : 'Ouvrir mon email'}</Button>
				{:else if selectedElu.contactUrl}
					<Button href={selectedElu.contactUrl} target="_blank" rel="noopener noreferrer">
						{isEn ? 'Open contact form' : 'Ouvrir le formulaire'}
					</Button>
				{/if}
				<Button alt on:click={copyEmail}>
					{#if copied}
						{isEn ? '✓ Copied' : '✓ Copié'}
					{:else}
						{isEn ? 'Copy text' : 'Copier le texte'}
					{/if}
				</Button>
			</div>

			<p class="deliverability">
				{isEn
					? 'Send from your personal mailbox: an email from a real constituent carries far more weight than a form. Check the recipient before sending.'
					: 'Envoyez depuis votre messagerie personnelle : un email d’un vrai électeur a bien plus de poids qu’un formulaire. Vérifiez le destinataire avant l’envoi.'}
			</p>

			<p class="bcc-hint">
				{isEn ? 'BCC' : 'CCI'} <code>{BCC}</code>
				{isEn ? '(helps us count letters sent)' : '(pour compter les emails envoyés)'}
			</p>

			{#if sent.has(selectedElu.id)}
				<div class="share-box">
					<p class="share-title">
						{isEn
							? 'Message sent! Help us reach more people:'
							: 'Message envoyé ! Aidez-nous à toucher plus de monde :'}
					</p>
					<div class="share-links">
						<a class="share-btn" href={shareLinks.x} target="_blank" rel="noopener noreferrer"
							>X / Twitter</a
						>
						<a
							class="share-btn"
							href={shareLinks.facebook}
							target="_blank"
							rel="noopener noreferrer">Facebook</a
						>
						<a
							class="share-btn"
							href={shareLinks.linkedin}
							target="_blank"
							rel="noopener noreferrer">LinkedIn</a
						>
						<button class="share-btn" on:click={copyShareLink}>
							{#if shareCopied}
								{isEn ? '✓ Link copied' : '✓ Lien copié'}
							{:else}
								{isEn ? 'Copy link' : 'Copier le lien'}
							{/if}
						</button>
					</div>
					<a class="join-link" href={joinHref}>
						{isEn
							? 'Want to do more? Join Pause AI ↗'
							: 'Envie d’aller plus loin ? Rejoignez Pause IA ↗'}
					</a>
				</div>
			{/if}
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 2.5rem;
		padding: 0 1.25rem 5rem;
	}

	/* Hero coloré pleine largeur (full-bleed : déborde de la largeur de l'article) */
	.hero-band {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-top: -2.5rem; /* annule le margin-top de l'article */
		margin-bottom: 2.75rem;
		padding: 3.5rem 1.25rem 3.25rem;
		background: var(--brand);
		text-align: center;
	}

	.hero-inner {
		max-inline-size: 44rem;
		margin-inline: auto;
	}

	.hero-band h1 {
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 800;
		line-height: 1.05;
		margin: 0 0 1rem;
		color: #1a1a1a;
	}

	.hero-sub {
		font-size: clamp(1rem, 2.2vw, 1.2rem);
		line-height: 1.5;
		margin: 0 auto;
		max-inline-size: 36rem;
		color: #3a2600;
		font-weight: 500;
	}

	/* Cards */
	.card {
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 1.75rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.card h2 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 1rem;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 1.7rem;
		block-size: 1.7rem;
		border-radius: 50%;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.95rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.card-intro {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-2);
		margin-bottom: 1.25rem;
	}

	/* Champs nom / commune */
	.user-fields {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.75rem;
	}

	.user-fields-hint {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin: 0.35rem 0 0;
	}

	.user-input {
		flex: 1;
		min-inline-size: 180px;
		padding: 0.7rem 0.9rem;
		border: 2px solid var(--border);
		border-radius: 9px;
		font-size: 0.95rem;
		background: var(--bg);
		color: var(--text);
	}

	.user-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Recherche code postal */
	.cp-form {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.cp-input {
		flex: 1;
		min-inline-size: 200px;
		padding: 0.85rem 1rem;
		border: 2px solid var(--border);
		border-radius: 10px;
		font-size: 1.05rem;
		background: var(--bg);
		color: var(--text);
	}

	.cp-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Notices */
	.notice {
		font-size: 0.9rem;
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
		margin-top: 0.85rem;
	}

	.notice--warn {
		color: var(--brand-subtle);
		background: var(--brand-light);
		border: 1px solid var(--brand);
	}

	.notice--error {
		color: #c0392b;
		background: #fdecee;
		border: 1px solid #f6c6cc;
	}

	.results-hint {
		margin-top: 1.25rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.results-hint.done-all {
		font-size: 1rem;
		font-weight: 600;
		color: var(--brand-subtle);
		background: var(--brand-light);
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
	}

	/* Élus */
	.elu-group {
		margin-top: 1rem;
	}

	.elu-group h3 {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
		margin: 0 0 0.5rem;
	}

	.elu-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.elu-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 1rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg-card);
		transition: opacity 0.15s;
	}

	.elu-card.done {
		opacity: 0.7;
		background: var(--brand-light);
		border-color: var(--brand);
	}

	.done-check {
		color: #2a9d5c;
		font-weight: 700;
		margin-right: 0.35rem;
	}

	/* Avatar (photo ou initiales) */
	.elu-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-inline-size: 0;
	}

	.avatar {
		position: relative;
		flex-shrink: 0;
		inline-size: 2.6rem;
		block-size: 2.6rem;
		border-radius: 50%;
		background: var(--brand-light);
		color: var(--brand-subtle);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		font-weight: 700;
		overflow: hidden;
	}

	.avatar img {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.avatar--lg {
		inline-size: 3.4rem;
		block-size: 3.4rem;
		font-size: 1.05rem;
	}

	.elu-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.elu-info strong {
		font-size: 1rem;
	}

	.elu-info small {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	/* Repli annuaires */
	.manual-fallback {
		margin-top: 1.5rem;
		font-size: 0.9rem;
	}

	.manual-fallback summary {
		cursor: pointer;
		color: var(--text-2);
	}

	.find-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.85rem;
	}

	.find-btn {
		display: block;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		color: var(--text);
		background: var(--bg-card);
		font-size: 0.88rem;
	}

	.find-btn:hover {
		border-color: var(--brand);
	}

	/* Retour */
	.back-link {
		background: none;
		border: none;
		color: var(--brand-subtle);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		margin-bottom: 1rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	/* Destinataire */
	.recipient {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		background: var(--brand-light);
		border-radius: 10px;
		margin-bottom: 1.25rem;
	}

	.recipient-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-subtle);
	}

	.recipient > div {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
	}

	.recipient small {
		font-size: 0.8rem;
		color: var(--text-2);
	}

	.profile-link {
		font-size: 0.78rem;
		color: var(--brand-subtle);
		margin-top: 0.15rem;
		width: fit-content;
	}

	/* Toolbar message */
	.msg-toolbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.segmented {
		display: inline-flex;
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}

	.segmented button {
		padding: 0.45rem 1rem;
		border: none;
		background: var(--bg);
		font-size: 0.88rem;
		cursor: pointer;
		color: var(--text-2);
	}

	.segmented button.active {
		background: var(--brand);
		color: #1a1a1a;
		font-weight: 600;
	}

	.theme-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chip {
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg);
		font-size: 0.8rem;
		cursor: pointer;
		color: var(--text-2);
		transition: all 0.15s;
	}

	.chip.active {
		border-color: var(--brand);
		background: var(--brand);
		color: #1a1a1a;
	}

	.angle-row {
		margin-bottom: 1rem;
	}

	.angle-label {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-2);
		margin-bottom: 0.5rem;
	}

	.perso-field {
		display: block;
		margin-bottom: 1rem;
	}

	.perso-field span {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-2);
		margin-bottom: 0.4rem;
	}

	.perso-input {
		width: 100%;
		padding: 0.6rem 0.8rem;
		border: 2px solid var(--border);
		border-radius: 9px;
		font-size: 0.9rem;
		font-family: inherit;
		line-height: 1.5;
		background: var(--bg);
		color: var(--text);
		resize: vertical;
	}

	.perso-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Aperçu email */
	.email-preview {
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.email-subject-line {
		background: var(--bg-card);
		padding: 0.65rem 1.1rem;
		font-size: 0.85rem;
		border-bottom: 1px solid var(--border);
	}

	.subject-label {
		font-weight: 700;
		margin-right: 0.4rem;
		color: var(--text-2);
	}

	.email-body {
		padding: 1.4rem 1.6rem;
		font-size: 0.9rem;
		line-height: 1.7;
		background: var(--bg);
		max-block-size: 22rem;
		overflow-y: auto;
	}

	.email-body :global(p) {
		margin-bottom: 1em;
	}

	.send-row {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 1.25rem;
	}

	.deliverability {
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--text-2);
		margin-top: 1rem;
	}

	.bcc-hint {
		font-size: 0.78rem;
		color: var(--text-secondary);
		margin-top: 0.85rem;
	}

	/* Partage après envoi */
	.share-box {
		margin-top: 1.5rem;
		padding: 1.25rem;
		border: 1px solid var(--brand);
		background: var(--brand-light);
		border-radius: 12px;
	}

	.share-title {
		font-size: 0.95rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
	}

	.share-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.share-btn {
		padding: 0.5rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
	}

	.share-btn:hover {
		border-color: var(--brand);
	}

	.join-link {
		display: inline-block;
		margin-top: 0.9rem;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--brand-subtle);
	}

	.bcc-hint code {
		background: var(--bg-card);
		padding: 0.05em 0.35em;
		border-radius: 4px;
		color: var(--brand-subtle);
		font-weight: 600;
	}

	/* Prose + FAQ (en boxes blanches comme les cartes d'étape) */
	.prose h2,
	.faq h2 {
		font-size: 1.3rem;
		font-weight: 700;
		margin: 0 0 1rem;
	}

	.prose p {
		line-height: 1.7;
		color: var(--text-2);
		margin: 0;
	}

	/* L'accordéon partagé gère son propre titre : on neutralise la marge h3 */
	.faq :global(.accordion .title) {
		font-size: 1.05rem;
	}

	.faq :global(.accordion .header) {
		padding: 1.1rem 0;
	}

	@media (max-width: 600px) {
		.card {
			padding: 1.25rem;
		}

		.elu-card {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
