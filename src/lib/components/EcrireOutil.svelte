<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { onMount, createEventDispatcher } from 'svelte'
	import { lookupElus, isSampleData, type Elu, type LookupResult } from '$lib/data/elus'
	import { getEluAction, type FixedTarget } from '$lib/data/elu-actions'
	import { resolveCirco } from '$lib/data/circo-geo'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'
	// Action imposée (mode intégré) : quand elle est fournie, on ignore ?action=
	// dans l'URL et on n'affiche que l'outil (ni méta, ni bandeau, ni FAQ).
	export let forcedActionId: string | undefined = undefined
	export let embedded = false
	// Gate souple : exige un nom avant de composer le mail (auto-complétion).
	export let requireName = false
	$: isEn = lang === 'en'

	const dispatch = createEventDispatcher()

	// Nom requis (mode presse intégré) : bloque l'envoi tant qu'il est vide, avec
	// un champ dédié à l'étape 2 pour que l'email se complète automatiquement.
	let nameInput: HTMLInputElement | undefined
	$: nameMissing = requireName && !userName.trim()

	const BCC = 'campagne@pauseia.fr'

	// ── Action courante (moteur de campagnes) : sélectionnée par ?action=<id> ──
	// La page est prérendue : on ne peut pas lire le query string au build (il
	// servirait l'action « default »). On lit donc ?action côté client au montage,
	// puis l'action ciblée remplace l'action par défaut. Une action « fixed »
	// cible des destinataires précis, sinon ce sont les élus de l'utilisateur.
	let actionId: string | null = null
	$: action = getEluAction(forcedActionId ?? actionId)

	// Deux outils principaux présentés en onglets sur la même page (élus / presse).
	// Les campagnes ponctuelles (Genève, gouvernement…) gardent leur propre page :
	// on n'affiche les onglets que pour ces deux actions « primaires ».
	$: isPrimaryAction = action.id === 'default' || action.id === 'medias'
	$: isPress = !!action.press
	function selectTool(id: 'default' | 'medias') {
		if (action.id === id) return
		actionId = id
		step = 1
		selectedRecipient = null
		// Met l'URL à jour pour que l'onglet actif soit partageable / rechargeable.
		if (typeof window !== 'undefined') {
			const u = new URL(window.location.href)
			if (id === 'default') u.searchParams.delete('action')
			else u.searchParams.set('action', id)
			window.history.replaceState(window.history.state, '', u)
		}
	}

	// Indices tirés au hasard une fois par action (objet + accroche + variantes de
	// paragraphes). Un grand nombre aléatoire, ramené par modulo à la taille du
	// pool concerné au moment de l'usage : diversifie les emails pour éviter le
	// spam sans avoir à connaître ici la taille de chaque pool.
	let hookIndex = 0
	let subjectIndex = 0
	let focusIndex = 0
	let balanceIndex = 0
	let askIndex = 0
	let introIndex = 0
	let angle = ''
	let seededFor = ''
	// Sel de session : deux visiteurs différents obtiennent des combinaisons
	// différentes pour un même journal (évite un texte identique pour tous).
	const sessionSalt = Math.floor(Math.random() * 1e9)
	$: if (action.id !== seededFor) {
		seededFor = action.id
		hookIndex = Math.floor(Math.random() * action.hooks.length)
		subjectIndex = Math.floor(Math.random() * action.subjects.length)
		focusIndex = Math.floor(Math.random() * 997)
		balanceIndex = Math.floor(Math.random() * 997)
		askIndex = Math.floor(Math.random() * 997)
		introIndex = Math.floor(Math.random() * 997)
		angle = action.angles[0].id
	}

	// Hash déterministe (FNV-1a) d'une chaîne, pour dériver une combinaison
	// stable et variée à partir de l'identifiant du destinataire.
	function hashStr(s: string): number {
		let h = 2166136261
		for (let i = 0; i < s.length; i++) {
			h ^= s.charCodeAt(i)
			h = Math.imul(h, 16777619)
		}
		return h >>> 0
	}

	// Presse : chaque journal reçoit automatiquement un objet, une accroche et un
	// angle différents (variété entre rédactions), stables si on y revient.
	function seedForRecipient(r: Recipient) {
		// `>>> 0` : le XOR JS opère sur des entiers 32 bits SIGNÉS, donc le résultat
		// peut être négatif → indices négatifs → plantage. On force un entier non
		// signé pour garantir des index valides pour tous les journaux.
		const h = (hashStr(r.id) ^ sessionSalt) >>> 0
		subjectIndex = h % action.subjects.length
		hookIndex = Math.floor(h / 7) % action.hooks.length
		angle = action.angles[Math.floor(h / 97) % action.angles.length].id
		focusIndex = Math.floor(h / 13) % 997
		balanceIndex = Math.floor(h / 17) % 997
		askIndex = Math.floor(h / 19) % 997
		introIndex = Math.floor(h / 23) % 997
	}

	type Version = 'short' | 'long'
	let version: Version = 'short'
	$: if (!action.hasDetailed && version !== 'short') version = 'short'

	$: subject = (() => {
		const s = action.subjects[subjectIndex] ?? action.subjects[0]
		return isEn ? s.en : s.fr
	})()

	// ── Vocabulaire selon la cible (élus vs destinataires) ──
	$: targetNoun = isEn
		? action.targeting === 'fixed'
			? 'recipients'
			: 'representatives'
		: action.targeting === 'fixed'
			? 'destinataires'
			: 'élus'

	// ── Étape du parcours : 1 = choisir le destinataire, 2 = rédiger le mail ──
	let step: 1 | 2 = 1
	let selectedRecipient: Recipient | null = null

	// ── Destinataire normalisé (élu OU cible fixe) ──
	type RecipientRole = 'depute' | 'senateur' | 'ministre' | 'autre'
	interface Recipient {
		id: string
		nom: string
		civ?: 'M' | 'Mme' | null
		role: RecipientRole
		email: string | null
		contactUrl: string | null
		photo: string | null
		subtitle: string
		introKind: 'depute' | 'senateur' | 'generic' | 'media'
		// Pour les députés : précision de la localité selon la fiabilité du géocodage.
		// 'circonscription' (1 seul député certain), 'ville' (code postal couvrant
		// plusieurs circonscriptions), 'departement' (repli). Voir deputeScope.
		deputeScope?: 'circonscription' | 'ville' | 'departement'
		// Vrai pour le député dont l'utilisateur est certainement l'administré
		// (circonscription résolue via son adresse) → à contacter en priorité.
		priority?: boolean
		signatureLocality: string
		salutationOverride?: string
		emailConfidence: 'high' | 'medium' | 'low' | 'none'
	}

	function eluLocalite(elu: Elu): string {
		return elu.role === 'depute'
			? (elu.nomCirco ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
			: (elu.nomDept ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
	}

	function eluSubtitle(elu: Elu): string {
		const base =
			elu.role === 'depute'
				? (elu.nomCirco ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
				: (elu.nomDept ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
		return elu.groupe && elu.groupe !== '—' ? `${base} · ${elu.groupe}` : base
	}

	function fromElu(elu: Elu): Recipient {
		return {
			id: elu.id,
			nom: elu.nom,
			civ: elu.civ ?? null,
			role: elu.role,
			email: elu.email,
			contactUrl: elu.contactUrl ?? null,
			photo: elu.photo ?? null,
			subtitle: eluSubtitle(elu),
			introKind: elu.role === 'depute' ? 'depute' : 'senateur',
			signatureLocality: eluLocalite(elu),
			emailConfidence: elu.emailConfidence
		}
	}

	function fromFixed(ft: FixedTarget): Recipient {
		return {
			id: ft.id,
			nom: ft.nom,
			civ: ft.civ ?? null,
			role: ft.role,
			email: ft.email,
			contactUrl: ft.contactUrl ?? null,
			// Logo via le service d'icônes de DuckDuckGo (respectueux de la vie
			// privée), avec repli sur les initiales si l'image ne charge pas.
			photo: ft.photo ?? (ft.domain ? `https://icons.duckduckgo.com/ip3/${ft.domain}.ico` : null),
			subtitle: ft.fonction ? (isEn ? ft.fonction.en : ft.fonction.fr) : '',
			introKind: isPress ? 'media' : 'generic',
			signatureLocality: 'France',
			salutationOverride: ft.salutation ? (isEn ? ft.salutation.en : ft.salutation.fr) : undefined,
			emailConfidence: ft.email ? 'high' : 'none'
		}
	}

	// ── Recherche des élus par code postal (mode 'representatives') ──
	let codePostal = ''
	let result: LookupResult | null = null
	let searched = false
	let searchError: 'format' | 'notfound' | null = null

	function search() {
		searched = true
		resetPriority()
		const clean = codePostal.replace(/\s/g, '')
		if (!/^\d{5}$/.test(clean)) {
			result = null
			searchError = 'format'
			return
		}
		result = lookupElus(clean)
		searchError = result ? null : 'notfound'
	}

	// ── Géocodage fin (cas ambigu : un code postal, plusieurs circonscriptions) ──
	// Progressive enhancement : si l'utilisateur précise son adresse, on identifie
	// sa circonscription exacte (BAN + point-in-polygon) pour marquer SON député
	// comme prioritaire. Tout échec retombe sur le comportement par défaut.
	let addressQuery = ''
	let geoStatus: 'idle' | 'loading' | 'found' | 'notfound' | 'error' = 'idle'
	let priorityCirco: number | null = null
	let priorityDept: string | null = null
	let priorityNom = ''

	function resetPriority() {
		addressQuery = ''
		geoStatus = 'idle'
		priorityCirco = null
		priorityDept = null
		priorityNom = ''
	}

	async function findMyDepute() {
		if (!addressQuery.trim() || !result) return
		geoStatus = 'loading'
		try {
			const match = await resolveCirco(addressQuery, codePostal, deputeDepartements)
			if (match) {
				priorityCirco = match.circo
				priorityDept = match.dept
				priorityNom =
					result.deputes.find((e) => e.circo === match.circo && e.departement === match.dept)
						?.nom ?? ''
				geoStatus = 'found'
			} else {
				priorityCirco = null
				priorityDept = null
				geoStatus = 'notfound'
			}
		} catch {
			geoStatus = 'error'
		}
	}

	// ── Groupes de destinataires affichés (commun aux deux modes) ──
	$: deputeTitle = !result?.exactDeputes
		? isEn
			? 'The MPs of your department'
			: 'Les députés de votre département'
		: (result?.deputes.length ?? 0) > 1
			? isEn
				? 'Your MPs (your city)'
				: 'Vos députés (votre ville)'
			: isEn
				? 'Your MP'
				: 'Votre député'

	// Portée géographique certaine pour les députés (voir introLine) :
	//  - repli département : on ne connaît pas la circonscription → 'departement'
	//  - un code postal couvrant plusieurs circonscriptions (grandes villes) : on
	//    sait seulement que l'utilisateur habite la ville → 'ville'
	//  - un seul député pour ce code postal : circonscription certaine.
	$: deputeScope = (
		!result?.exactDeputes
			? 'departement'
			: (result?.deputes.length ?? 0) > 1
				? 'ville'
				: 'circonscription'
	) as 'circonscription' | 'ville' | 'departement'

	// Départements couvrant le code postal (en général un seul) : sert au
	// géocodage fin dans le cas ambigu.
	$: deputeDepartements = result ? [...new Set(result.deputes.map((e) => e.departement))] : []

	// Députés du code postal, avec la circonscription prioritaire marquée si
	// l'utilisateur a précisé son adresse (voir géocodage plus bas).
	$: deputeRecipients = result
		? (() => {
				const items = result.deputes.map((e) => {
					const isPriority =
						priorityCirco != null && e.circo === priorityCirco && e.departement === priorityDept
					return {
						...fromElu(e),
						deputeScope: (isPriority ? 'circonscription' : deputeScope) as Recipient['deputeScope'],
						priority: isPriority
					}
				})
				// Le député prioritaire remonte en tête de liste.
				return priorityCirco != null
					? [...items].sort((a, b) => Number(b.priority) - Number(a.priority))
					: items
			})()
		: []

	$: recipientGroups =
		action.targeting === 'fixed'
			? action.fixedTargets && action.fixedTargets.length
				? [
						{
							kind: 'fixed' as const,
							title: action.targetsHeading
								? isEn
									? action.targetsHeading.en
									: action.targetsHeading.fr
								: isEn
									? 'Recipients'
									: 'Destinataires',
							list: action.fixedTargets.map(fromFixed)
						}
					]
				: []
			: result
				? [
						{
							kind: 'senateurs' as const,
							title: isEn ? 'Your senators' : 'Vos sénateurs',
							list: result.senateurs.map(fromElu)
						},
						{
							kind: 'deputes' as const,
							title: deputeTitle,
							list: deputeRecipients
						}
					]
				: []

	$: allRecipients = recipientGroups.flatMap((g) => g.list)
	$: sentCount = allRecipients.filter((r) => sent.has(r.id)).length

	// Après un changement d'étape, on repositionne la vue : en pleine page, en
	// haut ; en mode intégré, on laisse la page hôte recentrer sur sa section
	// (événement `navigate`) pour ne pas éjecter l'utilisateur vers le haut.
	function afterNav() {
		if (embedded) {
			dispatch('navigate')
			return
		}
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
	}

	function choose(r: Recipient) {
		// On avance toujours vers la rédaction (pas de retour en haut de page).
		// Le nom, quand il est requis, se saisit directement à l'étape 2.
		selectedRecipient = r
		mailAttempted = false
		// Presse : varier le message d'un journal à l'autre, automatiquement.
		if (action.press) seedForRecipient(r)
		step = 2
		afterNav()
	}

	function back() {
		step = 1
		mailAttempted = false
		afterNav()
	}

	// Formule d'appel (civilité + titre selon le rôle, ou formule sur mesure).
	function salutation(r: Recipient): string {
		if (r.salutationOverride) return r.salutationOverride
		if (isEn) return `Dear ${r.nom},`
		if (r.role === 'depute') {
			if (r.civ === 'Mme') return 'Madame la Députée,'
			if (r.civ === 'M') return 'Monsieur le Député,'
			return 'Madame, Monsieur le Député,'
		}
		if (r.role === 'senateur') {
			if (r.civ === 'Mme') return 'Madame la Sénatrice,'
			if (r.civ === 'M') return 'Monsieur le Sénateur,'
			return 'Madame, Monsieur le Sénateur,'
		}
		if (r.role === 'ministre') {
			if (r.civ === 'Mme') return 'Madame la Ministre,'
			if (r.civ === 'M') return 'Monsieur le Ministre,'
			return 'Madame, Monsieur le Ministre,'
		}
		return 'Madame, Monsieur,'
	}

	// 1re phrase : ouverture naturelle qui signale le lien avec le destinataire.
	// `name` est passé explicitement pour que Svelte recalcule l'aperçu à la frappe.
	// Formulations neutres (non genrées) : on utilise des verbes plutôt que des
	// noms/adjectifs accordés ("je réside", "me préoccupe") pour que le message
	// convienne à tout le monde sans avoir à demander la civilité de l'expéditeur.
	function introLine(r: Recipient, name: string, iIdx = 0): string {
		const nom = name.trim() || (isEn ? '[your name]' : '[votre nom]')
		if (r.introKind === 'generic') {
			return isEn
				? `My name is ${nom}, and I am writing to you because I am worried about the development of AI.`
				: `Je m'appelle ${nom} et je vous écris car le développement de l'IA me préoccupe.`
		}
		if (r.introKind === 'senateur') {
			return isEn
				? `My name is ${nom}, and I am writing to you as a resident of your department.`
				: `Je m'appelle ${nom} et je vous écris car je réside dans votre département.`
		}
		// Presse : ouverture « lecteur » déclinée en plusieurs formulations (variété
		// d'un journal à l'autre), neutres en genre et sans doublon avec l'accroche.
		if (r.introKind === 'media') {
			const fr = [
				`Je m'appelle ${nom} et je vous écris au sujet de votre couverture de l'intelligence artificielle.`,
				`Je m'appelle ${nom}, je vous lis régulièrement, et je vous écris à propos de l'intelligence artificielle.`,
				`Je m'appelle ${nom} et je me permets de vous écrire, comme lecteur, à propos de l'IA.`,
				`Je m'appelle ${nom}. Je vous écris parce qu'un sujet d'actualité sur l'IA me semble mériter votre attention.`,
				`Je m'appelle ${nom} et je vous adresse ce message en tant que lecteur attentif à ce que vous publiez sur l'IA.`,
				`Je m'appelle ${nom} et je vous écris, simplement, parce que je fais confiance à votre rédaction sur les sujets d'IA.`
			]
			const en = [
				`My name is ${nom}, and I am writing to you about your coverage of artificial intelligence.`,
				`My name is ${nom}, I read you regularly, and I am writing to you about artificial intelligence.`,
				`My name is ${nom}, and I am writing to you as a reader, about AI.`,
				`My name is ${nom}. I am writing because a piece of AI news seems to me to deserve your attention.`,
				`My name is ${nom}, and I am sending this as a reader who pays attention to what you publish on AI.`,
				`My name is ${nom}, and I am writing simply because I trust your newsroom on AI matters.`
			]
			const pool = isEn ? en : fr
			return pool[iIdx % pool.length]
		}
		// Députés : la localité affirmée dépend de la fiabilité du géocodage, pour
		// ne pas prétendre « votre circonscription » quand le code postal en couvre
		// plusieurs (grandes villes) ou qu'on est en repli départemental.
		const scope = r.deputeScope ?? 'circonscription'
		if (isEn) {
			const where =
				scope === 'circonscription'
					? 'as one of your constituents'
					: scope === 'ville'
						? 'as a resident of your city'
						: 'as a resident of your department'
			return `My name is ${nom}, and I am writing to you ${where}.`
		}
		const lieu =
			scope === 'circonscription'
				? 'votre circonscription'
				: scope === 'ville'
					? 'votre ville'
					: 'votre département'
		return `Je m'appelle ${nom} et je vous écris car je réside dans ${lieu}.`
	}

	// Re-tire la FORMULATION (objet, accroche, variantes de paragraphe, appel) sans
	// toucher aux choix de l'utilisateur (sujet abordé, longueur, nom, phrase perso).
	// Donne le contrôle si un texte ne plaît pas, et diversifie encore les envois.
	function shuffleWording() {
		hookIndex = Math.floor(Math.random() * action.hooks.length)
		subjectIndex = Math.floor(Math.random() * action.subjects.length)
		focusIndex = Math.floor(Math.random() * 997)
		balanceIndex = Math.floor(Math.random() * 997)
		askIndex = Math.floor(Math.random() * 997)
		introIndex = Math.floor(Math.random() * 997)
	}

	// Compose les paragraphes du corps. Les index (accroche + variantes) sont passés
	// en paramètres pour que l'aperçu Svelte se recalcule quand on « re-tire » le
	// texte (shuffleWording), et pas seulement quand l'angle/la longueur changent.
	function buildParagraphs(
		angleId: string,
		v: Version,
		personal: string,
		hIdx: number,
		fIdx: number,
		bIdx: number,
		aIdx: number
	): string[] {
		const L = isEn ? 'en' : 'fr'
		const ang = action.angles.find((a) => a.id === angleId) ?? action.angles[0]
		const hook = action.hooks[hIdx] ?? action.hooks[0]
		// Pools = valeur de base + variantes éventuelles ; on en tire une par modulo.
		const focusPool = [ang.focus, ...(ang.focusVariants ?? [])]
		const focus = focusPool[fIdx % focusPool.length]
		const balancePool = [action.balance, ...(action.balances ?? [])]
		const balance = balancePool[bIdx % balancePool.length]
		const askPool = [action.ask, ...(action.asks ?? [])]
		const ask = askPool[aIdx % askPool.length]
		const paras = [hook[L], focus[L]]
		if (v === 'long') {
			if (ang.complementLong) paras.push(ang.complementLong[L])
			if (action.poll) paras.push(action.poll[L])
		}
		if (personal.trim()) paras.push(personal.trim())
		paras.push(balance[L])
		paras.push(ask[L])
		return paras
	}

	// Bloc de signature (mêmes valeurs que l'aperçu, mais en texte brut).
	function signatureBlock(r: Recipient): string {
		const name = userName.trim() || (isEn ? '[Your full name]' : '[Votre nom complet]')
		const ville = userVille.trim() || r.signatureLocality
		return `${isEn ? 'Yours sincerely,' : 'Cordialement,'}\n${name}\n${ville}`
	}

	// Corps de l'email, reconstruit à partir des MÊMES fonctions que l'aperçu
	// (#email-body). On ne lit plus le DOM : le texte est donc fiable même si
	// l'aperçu est scrollé/tronqué, et l'envoi ne dépend plus d'un élément d'UI.
	function buildBodyText(r: Recipient): string {
		return [
			salutation(r),
			introLine(r, userName, introIndex),
			...buildParagraphs(
				angle,
				version,
				personalSentence,
				hookIndex,
				focusIndex,
				balanceIndex,
				askIndex
			),
			signatureBlock(r)
		].join('\n\n')
	}

	function mailtoHref(r: Recipient): string {
		const params = new URLSearchParams({ subject, bcc: BCC, body: buildBodyText(r) })
		// URLSearchParams encode les espaces en "+", à reconvertir en %20 pour mailto.
		return `mailto:${r.email ?? ''}?${params.toString().replace(/\+/g, '%20')}`
	}

	// Liens de composition des webmails (fallback quand le client mailto: n'est pas
	// configuré). Chacun accepte to/subject/bcc/body en query string.
	function webmailHref(service: 'gmail' | 'outlook' | 'yahoo', r: Recipient): string {
		const to = encodeURIComponent(r.email ?? '')
		const su = encodeURIComponent(subject)
		const bcc = encodeURIComponent(BCC)
		const body = encodeURIComponent(buildBodyText(r))
		if (service === 'gmail')
			return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&bcc=${bcc}&body=${body}`
		if (service === 'outlook')
			return `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&bcc=${bcc}&body=${body}`
		return `https://compose.mail.yahoo.com/?to=${to}&subject=${su}&bcc=${bcc}&body=${body}`
	}

	function openWebmail(service: 'gmail' | 'outlook' | 'yahoo') {
		if (!selectedRecipient) return
		markSent(selectedRecipient.id)
		logIntent(selectedRecipient)
		window.open(webmailHref(service, selectedRecipient), '_blank', 'noopener')
	}

	// ── Infos utilisateur. Nom, ville et phrase ne quittent jamais l'appareil
	// (mémorisés localement). L'email n'est transmis QUE si l'utilisateur coche
	// explicitement l'inscription à la newsletter (voir subscribeNewsletter). ──
	let userName = ''
	let userVille = ''
	let userEmail = ''
	let personalSentence = ''
	function saveUser() {
		try {
			localStorage.setItem(
				'elus-user',
				JSON.stringify({ userName, userVille, userEmail, personalSentence })
			)
		} catch {
			/* localStorage indisponible */
		}
	}

	// ── Opt-in newsletter : capture (avec consentement) des personnes qui agissent.
	let wantsNewsletter = false
	let newsletterStatus: 'idle' | 'sending' | 'done' | 'error' = 'idle'
	function emailValid(v: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
	}
	async function subscribeNewsletter() {
		if (!emailValid(userEmail)) {
			newsletterStatus = 'error'
			return
		}
		newsletterStatus = 'sending'
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: userEmail.trim(),
					subscribeNewsletter: true,
					subscribeSubstack: false,
					firstName: userName.trim() || undefined,
					source: `ecrire-a-mes-elus${action.id === 'default' ? '' : `:${action.id}`}`
				})
			})
			newsletterStatus = res.ok ? 'done' : 'error'
		} catch {
			newsletterStatus = 'error'
		}
	}

	// ── Suivi de progression (mémorisé localement, par action) ──
	$: sentKey = action.id === 'default' ? 'elus-contactes' : `elus-contactes:${action.id}`
	let sent = new Set<string>()
	let mounted = false
	onMount(() => {
		if (!forcedActionId) actionId = new URLSearchParams(window.location.search).get('action')
		try {
			const u = JSON.parse(localStorage.getItem('elus-user') ?? '{}')
			userName = u.userName ?? ''
			userVille = u.userVille ?? ''
			userEmail = u.userEmail ?? ''
			personalSentence = u.personalSentence ?? ''
		} catch {
			/* localStorage indisponible */
		}
		mounted = true
	})
	function loadSent(key: string) {
		try {
			sent = new Set(JSON.parse(localStorage.getItem(key) ?? '[]'))
		} catch {
			sent = new Set()
		}
	}
	// Recharge la progression quand l'action (donc la clé) change.
	$: if (mounted) loadSent(sentKey)

	function markSent(id: string) {
		sent = new Set(sent).add(id)
		try {
			localStorage.setItem(sentKey, JSON.stringify([...sent]))
		} catch {
			/* localStorage indisponible : on ignore */
		}
	}

	// Remet à zéro la progression (les coches « Écrit ✓ »). Garde le nom / la ville.
	function resetProgress() {
		sent = new Set()
		try {
			localStorage.removeItem(sentKey)
		} catch {
			/* localStorage indisponible : on ignore */
		}
	}

	// Journalise l'intention d'envoi côté serveur, sans donnée personnelle.
	// `sendBeacon` survit à la navigation immédiate vers le client mail. Ce n'est
	// pas une preuve d'envoi (c'est le clic) : le compteur fiable reste le BCC.
	function logIntent(r: Recipient) {
		if (typeof navigator === 'undefined' || !navigator.sendBeacon) return
		try {
			const payload = JSON.stringify({
				action: action.id,
				eluId: r.id,
				eluNom: r.nom,
				role: r.role,
				angle,
				version
			})
			navigator.sendBeacon('/api/log-intent', new Blob([payload], { type: 'application/json' }))
		} catch {
			/* journalisation best-effort : on ignore toute erreur */
		}
	}

	// Le client mail ne s'ouvre pas toujours : sur certains systèmes, un lien
	// mailto trop long (corps + accents encodés) dépasse la limite de l'OS
	// (~2000 caractères) et est ignoré silencieusement, ou aucun client n'est
	// configuré. On révèle alors immédiatement les solutions de secours.
	let mailAttempted = false
	function openMail() {
		if (!selectedRecipient || nameMissing) return
		markSent(selectedRecipient.id)
		logIntent(selectedRecipient)
		mailAttempted = true
		// Déclenchement par clic d'ancre : plus fiable que window.location.href.
		const a = document.createElement('a')
		a.href = mailtoHref(selectedRecipient)
		a.style.display = 'none'
		document.body.appendChild(a)
		a.click()
		a.remove()
	}

	function confidenceNote(r: Recipient): string | null {
		if (r.emailConfidence === 'high' || r.emailConfidence === 'medium') return null
		if (!r.email) return null // cas « pas d'email » traité par une note dédiée
		if (isEn) return 'Please double-check this address before sending.'
		return "Vérifiez l'adresse avant l'envoi."
	}

	// Masque une photo qui ne charge pas (404) → les initiales restent visibles.
	function hideImg(e: Event) {
		;(e.currentTarget as HTMLImageElement).style.display = 'none'
	}

	function initials(r: Recipient): string {
		const parts = r.nom.trim().split(/\s+/)
		const first = parts[0]?.[0] ?? ''
		const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
		return (first + last).toUpperCase()
	}

	$: joinHref = isEn ? '/en/rejoindre' : '/fr/rejoindre'

	let copied = false
	function copyEmail() {
		if (!selectedRecipient) return
		void navigator.clipboard.writeText(buildBodyText(selectedRecipient)).then(() => {
			copied = true
			setTimeout(() => {
				copied = false
			}, 2500)
		})
	}
</script>

{#if !embedded}
	<PostMeta
		title={isEn ? action.meta.title.en : action.meta.title.fr}
		description={isEn ? action.meta.description.en : action.meta.description.fr}
	/>
{/if}

<article class:embedded>
	{#if step === 1}
		<!-- ════════ Étape 1 : choisir le destinataire ════════ -->
		{#if !embedded}
			<header class="hero-band">
				<div class="hero-inner">
					<h1>{isEn ? action.hero.title.en : action.hero.title.fr}</h1>
					<p class="hero-sub">{isEn ? action.hero.subtitle.en : action.hero.subtitle.fr}</p>
				</div>
			</header>
		{/if}

		{#if isPrimaryAction}
			<div class="tool-switch">
				<span class="tool-switch-label"
					>{isEn ? 'What do you want to do?' : 'Que voulez-vous faire ?'}</span
				>
				<div
					class="tool-tabs"
					role="tablist"
					aria-label={isEn ? 'Choose a tool' : 'Choisir un outil'}
				>
					<button
						role="tab"
						class:active={action.id === 'default'}
						aria-selected={action.id === 'default'}
						on:click={() => selectTool('default')}
					>
						<span class="tab-emoji" aria-hidden="true">🏛️</span>
						{isEn ? 'Write to my representatives' : 'Écrire à mes élus'}
					</button>
					<button
						role="tab"
						class:active={action.id === 'medias'}
						aria-selected={action.id === 'medias'}
						on:click={() => selectTool('medias')}
					>
						<span class="tab-emoji" aria-hidden="true">📰</span>
						{isEn ? 'Write to the press' : 'Écrire à la presse'}
					</button>
				</div>
			</div>
		{/if}

		<section class="card">
			<h2>
				<span class="step-num">1</span>{#if action.targeting === 'fixed'}{isEn
						? 'Your recipients'
						: 'Vos destinataires'}{:else}{isEn
						? 'Find your representatives'
						: 'Trouvez vos élus'}{/if}
			</h2>

			{#if action.targeting !== 'fixed'}
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
			{/if}

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

			{#if isSampleData && action.targeting !== 'fixed'}
				<p class="notice notice--warn">
					{isEn
						? 'Demo data. Run the generation script to load real representatives and emails.'
						: "Données d'exemple. Lancez le script de génération pour charger les vrais élus et emails."}
				</p>
			{/if}

			{#if action.targeting !== 'fixed'}
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
			{/if}

			{#if recipientGroups.length}
				<!-- Presse : pas de barre de progression (on choisit un titre, on ne
				     « coche » pas une liste). Élus : compteur + encouragement. -->
				{#if isPress}
					<p class="results-hint">
						{isEn ? action.recipientsIntro?.en : action.recipientsIntro?.fr}
					</p>
				{:else}
					<p
						class="results-hint"
						class:done-all={sentCount > 0 && sentCount >= allRecipients.length}
					>
						{#if sentCount >= allRecipients.length && allRecipients.length > 0}
							🎉 {isEn
								? `Done! You've written to all ${allRecipients.length} ${targetNoun}. Thank you, this really helps.`
								: `Bravo ! Vous avez écrit à vos ${allRecipients.length} ${targetNoun}. Merci, votre geste compte vraiment.`}
						{:else if sentCount > 0}
							<strong>{sentCount}/{allRecipients.length}</strong>
							{isEn ? 'contacted.' : 'contactés.'}
							{isEn
								? 'Keep going with the others, each message counts.'
								: 'Continuez avec les autres, chaque message compte.'}
						{:else if action.recipientsIntro}
							{isEn ? action.recipientsIntro.en : action.recipientsIntro.fr}
						{:else}
							{isEn
								? `Write to each of your ${targetNoun}: one personal email each.`
								: `Écrivez à chacun de vos ${targetNoun} : un email personnel pour chaque.`}
						{/if}
					</p>
					{#if sentCount >= allRecipients.length && allRecipients.length > 0}
						<!-- Prolongement naturel : faire relayer le sujet par la presse. -->
						<div class="next-tool">
							<p>
								{isEn
									? 'Next step: ask the press to cover the issue. It takes two more minutes.'
									: 'Étape suivante : demandez à la presse d’en parler. Deux minutes de plus.'}
							</p>
							<Button on:click={() => selectTool('medias')}>
								{isEn ? '📰 Write to the press' : '📰 Écrire à la presse'}
							</Button>
						</div>
						<a class="join-link join-link--block" href={joinHref}>
							{isEn
								? 'Want to do more? Join Pause AI ↗'
								: 'Envie d’aller plus loin ? Rejoignez Pause IA ↗'}
						</a>
					{/if}
				{/if}
				{#each recipientGroups as group}
					{#if group.list.length}
						<div class="elu-group">
							<h3>{group.title}</h3>
							{#if group.kind === 'deputes' && deputeScope === 'ville'}
								<div class="circo-finder">
									<p class="circo-hint">
										{isEn
											? 'Your postal code covers several constituencies. Enter your address to find your own MP, the one to write to first.'
											: 'Votre code postal couvre plusieurs circonscriptions. Indiquez votre adresse pour trouver votre député, celui à contacter en priorité.'}
									</p>
									<div class="circo-row">
										<input
											class="circo-input"
											type="text"
											bind:value={addressQuery}
											on:keydown={(e) => e.key === 'Enter' && findMyDepute()}
											placeholder={isEn ? 'Number and street' : 'Numéro et rue'}
											autocomplete="street-address"
											aria-label={isEn ? 'Your address' : 'Votre adresse'}
										/>
										<Button on:click={findMyDepute}>
											{geoStatus === 'loading'
												? isEn
													? 'Searching…'
													: 'Recherche…'
												: isEn
													? 'Find my MP'
													: 'Trouver mon député'}
										</Button>
									</div>
									{#if geoStatus === 'found' && priorityNom}
										<p class="circo-msg circo-ok">
											{isEn
												? `Your MP: ${priorityNom}. Highlighted below, write to them first.`
												: `Votre député : ${priorityNom}. Mis en avant ci-dessous, à contacter en priorité.`}
										</p>
									{:else if geoStatus === 'notfound'}
										<p class="circo-msg circo-warn">
											{isEn
												? 'Address not found. You can still write to all the MPs below.'
												: 'Adresse introuvable. Vous pouvez tout de même écrire à tous les députés ci-dessous.'}
										</p>
									{:else if geoStatus === 'error'}
										<p class="circo-msg circo-warn">
											{isEn
												? 'Lookup unavailable right now. You can still write to all the MPs below.'
												: 'Service indisponible pour le moment. Vous pouvez tout de même écrire à tous les députés ci-dessous.'}
										</p>
									{/if}
									<p class="circo-privacy">
										{isEn
											? 'Your address is sent to the French National Address Base (public service) only to find your constituency, and is never stored by us.'
											: 'Votre adresse est envoyée à la Base Adresse Nationale (service public) uniquement pour trouver votre circonscription, et n’est jamais conservée par nous.'}
									</p>
								</div>
							{/if}
							<ul class="elu-list">
								{#each group.list as r (r.id)}
									<li class="elu-card" class:done={sent.has(r.id)} class:priority={r.priority}>
										<div class="elu-left">
											<span class="avatar">
												{initials(r)}
												{#if r.photo}
													<img src={r.photo} alt="" loading="lazy" on:error={hideImg} />
												{/if}
											</span>
											<div class="elu-info">
												<strong>
													{#if sent.has(r.id)}<span class="done-check">✓</span>{/if}{r.nom}
												</strong>
												{#if r.subtitle}<small>{r.subtitle}</small>{/if}
												{#if r.priority}
													<span class="priority-badge"
														>{isEn
															? '★ Your MP · write first'
															: '★ Votre député · à contacter en priorité'}</span
													>
												{/if}
											</div>
										</div>
										<Button alt={sent.has(r.id)} on:click={() => choose(r)}>
											{#if sent.has(r.id)}
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
				{#if !isPress && sentCount > 0}
					<button class="reset-link" on:click={resetProgress}>
						{isEn ? 'Reset my progress' : 'Réinitialiser ma progression'}
					</button>
				{/if}
			{/if}

			{#if action.targeting !== 'fixed' && searched && !result}
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

		{#if !embedded}
			<!-- Pourquoi c'est important -->
			<section class="card prose">
				<h2>{isEn ? 'Why it matters' : "Pourquoi c'est important"}</h2>
				{#if isPress}
					{#if isEn}
						<p>
							Newsrooms cover, first and foremost, what interests their readers. A sincere message
							to the readers' desk or the newsroom signals that a topic matters to the public, and
							it weighs on editorial choices. Unlike a comment on social media, it lands in an inbox
							the team reads. A handful of reader messages is sometimes enough to inspire an article
							or an investigation.
						</p>
					{:else}
						<p>
							Les rédactions couvrent d'abord ce qui intéresse leurs lecteurs. Un message sincère au
							courrier des lecteurs ou à la rédaction signale qu'un sujet compte pour le public, et
							il pèse sur les choix éditoriaux. Contrairement à un commentaire sur les réseaux, il
							arrive dans une boite lue par l'équipe. Une poignée de messages de lecteurs suffit
							parfois à inspirer un article ou une enquête.
						</p>
					{/if}
				{:else if isEn}
					<p>
						MPs and senators take their constituents' messages into account. A personal email (even
						a short, sincere one) lands in a human inbox, gets read, and signals that a voter cares
						about this issue. Unlike a petition or a social media post, it carries real weight. A
						handful of emails from real citizens is often enough to put a topic on a committee's
						agenda.
					</p>
				{:else}
					<p>
						Les députés et sénateurs prennent en compte les messages de leurs électeurs. Un email
						personnel (même court et sincère) arrive dans une boite mail humaine, il est lu, et il
						signale qu'un électeur se préoccupe du sujet. Contrairement à une pétition ou à un post
						sur les réseaux, il a un vrai poids. Une poignée d'emails de vrais citoyens suffit
						souvent à inscrire un sujet à l'ordre du jour d'une commission.
					</p>
				{/if}
			</section>

			<!-- FAQ -->
			<section class="card faq">
				<h2>{isEn ? 'FAQ' : 'Questions fréquentes'}</h2>
				{#if isPress}
					<Accordion id="faq-p-difference" noHash>
						<span slot="head">
							{isEn
								? 'Does writing to a newspaper really change anything?'
								: 'Est-ce qu’écrire à un journal change vraiment quelque chose ?'}
						</span>
						<p slot="details">
							{isEn
								? 'Yes. Newsrooms pay attention to what their readers ask for: the readers’ desk and reader feedback help shape which topics get covered. A few sincere messages can be enough to inspire an article or nudge an editor to dig further.'
								: 'Oui. Les rédactions sont attentives à ce que leurs lecteurs réclament : le courrier des lecteurs et les retours orientent les sujets traités. Quelques messages sincères peuvent suffire à inspirer un article ou à pousser une rédaction à creuser le sujet.'}
						</p>
					</Accordion>
					<Accordion id="faq-p-who" noHash>
						<span slot="head">
							{isEn ? 'Who receives my message?' : 'À qui arrive mon message ?'}
						</span>
						<p slot="details">
							{isEn
								? 'A general newsroom or readers’ desk address (not a particular journalist). It is the right channel for a reader asking for more coverage: your message reaches the team, not one reporter’s personal inbox.'
								: "Une adresse générale de rédaction ou de courrier des lecteurs (pas un journaliste en particulier). C'est le bon canal pour un lecteur qui demande plus de couverture : votre message arrive à l'équipe, pas dans la boite personnelle d'un reporter."}
						</p>
					</Accordion>
					<Accordion id="faq-p-reply" noHash>
						<span slot="head">
							{isEn
								? 'What if the paper does not reply or publish it?'
								: 'Et si le journal ne répond pas ou ne le publie pas ?'}
						</span>
						<p slot="details">
							{isEn
								? 'That’s normal, and not a failure. The goal is to signal reader interest: even unpublished, your message counts among the feedback a newsroom weighs. Writing to the outlet you actually read, with a sincere personal line, is what makes it land.'
								: "C'est normal, et ce n'est pas un échec. Le but est de signaler l'intérêt des lecteurs : même non publié, votre message compte parmi les retours qu'une rédaction prend en compte. Écrire au titre que vous lisez vraiment, avec une phrase personnelle sincère, est ce qui fait la différence."}
						</p>
					</Accordion>
				{:else}
					<Accordion id="faq-difference" noHash>
						<span slot="head">
							{isEn
								? 'Does contacting a representative really make a difference?'
								: 'Est-ce que contacter un élu change vraiment quelque chose ?'}
						</span>
						<p slot="details">
							{isEn
								? 'Yes! Representatives track how many constituents raise an issue, and it shapes what they prioritise. A few sincere emails can be enough to get a topic onto a committee’s agenda.'
								: "Oui ! Les élus comptabilisent le nombre d'électeurs qui soulèvent un sujet, et cela oriente leurs priorités. Quelques emails sincères peuvent suffire à inscrire un sujet à l'ordre du jour d'une commission."}
						</p>
					</Accordion>
					<Accordion id="faq-relance" noHash>
						<span slot="head">
							{isEn ? "What if I don't get a reply?" : "Et si je n'ai pas de réponse ?"}
						</span>
						<p slot="details">
							{isEn
								? "That's common, and not a reason to give up. Follow up politely after about three weeks: a reminder shows the topic matters to you and often prompts a reply. You can also ask for a short meeting at their local office."
								: "C'est fréquent, et ce n'est pas une raison d'abandonner. Relancez poliment après environ trois semaines : une relance montre que le sujet vous tient à cœur et débloque souvent une réponse. Vous pouvez aussi demander un rendez-vous à leur permanence."}
						</p>
					</Accordion>
				{/if}
				<Accordion id="faq-duree" noHash>
					<span slot="head">{isEn ? 'How long does it take?' : 'Combien de temps ça prend ?'}</span>
					<p slot="details">
						{isEn
							? 'About two minutes. Enter your name, pick a recipient, and send.'
							: 'Environ deux minutes. Indiquez votre nom, choisissez un destinataire, puis envoyez.'}
					</p>
				</Accordion>
				<Accordion id="faq-donnees" noHash>
					<span slot="head">
						{isEn ? 'What about my data?' : 'Et mes données ?'}
					</span>
					<p slot="details">
						{isEn
							? 'Your name and town stay on your device and are never sent to a server: they only fill the draft. The email leaves from your own mailbox. A blind copy (BCC) reaches us at campagne@pauseia.fr to count the campaign; you can remove it before sending if you prefer. Your email address is only sent to us if you tick the newsletter box yourself, to subscribe you.'
							: "Votre nom et votre ville restent sur votre appareil et ne sont jamais envoyés à un serveur : ils servent seulement à remplir le brouillon. L'email part de votre propre messagerie. Une copie cachée (CCI) nous parvient à campagne@pauseia.fr pour mesurer la campagne ; vous pouvez la retirer avant l'envoi si vous le préférez. Votre adresse email ne nous est transmise que si vous cochez vous-même l'inscription à la newsletter, pour vous y abonner."}
					</p>
				</Accordion>
			</section>
		{/if}
	{:else if selectedRecipient}
		<!-- ════════ Étape 2 : rédiger le mail ════════ -->
		<button class="back-link" on:click={back}>
			← {isEn ? `Back to my ${targetNoun}` : `Retour à mes ${targetNoun}`}
		</button>

		<section class="card">
			<h2>
				<span class="step-num">2</span>{isEn ? 'Your message' : 'Votre message'}
			</h2>

			<div class="recipient">
				<span class="avatar avatar--lg">
					{initials(selectedRecipient)}
					{#if selectedRecipient.photo}
						<img src={selectedRecipient.photo} alt="" on:error={hideImg} />
					{/if}
				</span>
				<div>
					<span class="recipient-label">{isEn ? 'To:' : 'À :'}</span>
					<strong>{selectedRecipient.nom}</strong>
					{#if selectedRecipient.subtitle}<small>{selectedRecipient.subtitle}</small>{/if}
					{#if selectedRecipient.contactUrl}
						<a
							class="profile-link"
							href={selectedRecipient.contactUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{isEn ? 'View official profile ↗' : 'Voir sa fiche officielle ↗'}
						</a>
					{/if}
				</div>
			</div>

			{#if requireName}
				<!-- Nom saisi directement ici : l'aperçu se complète en temps réel. -->
				<div class="name-gate" class:name-gate--error={nameMissing}>
					<label class="name-gate-label" for="name-gate-input">
						{isEn
							? 'Your name (so the email fills in automatically)'
							: 'Votre nom (pour que l’email se rédige tout seul)'}
					</label>
					<div class="user-fields">
						<input
							id="name-gate-input"
							class="user-input"
							class:input-error={nameMissing}
							type="text"
							placeholder={isEn ? 'Your full name' : 'Votre nom complet'}
							autocomplete="name"
							bind:value={userName}
							bind:this={nameInput}
							on:input={saveUser}
							aria-invalid={nameMissing}
						/>
						<input
							class="user-input"
							type="text"
							placeholder={isEn ? 'Your town' : 'Votre ville'}
							bind:value={userVille}
							on:input={saveUser}
						/>
					</div>
				</div>
			{:else if !userName.trim()}
				<p class="card-intro">
					{#if isEn}
						Tip: add your name and town in step 1 and the email writes itself in full.
					{:else}
						Astuce : indiquez votre nom et votre ville à l'étape 1 et l'email se rédige entièrement.
					{/if}
				</p>
			{/if}

			<!-- Réglages compacts : sujet et longueur sur une même ligne -->
			<div class="msg-controls">
				<div class="control">
					<span class="control-label">{isEn ? 'Focus' : 'Sujet principal'}</span>
					<div class="theme-chips" role="group" aria-label={isEn ? 'Focus' : 'Sujet principal'}>
						{#each action.angles as a}
							<button
								class="chip"
								class:active={angle === a.id}
								aria-pressed={angle === a.id}
								on:click={() => (angle = a.id)}
							>
								{isEn ? a.label.en : a.label.fr}
							</button>
						{/each}
					</div>
				</div>
				{#if action.hasDetailed}
					<div class="control">
						<span class="control-label">{isEn ? 'Length' : 'Longueur'}</span>
						<div class="segmented" role="group" aria-label={isEn ? 'Length' : 'Longueur'}>
							<button
								class:active={version === 'short'}
								aria-pressed={version === 'short'}
								on:click={() => (version = 'short')}
							>
								{isEn ? 'Short' : 'Courte'}
							</button>
							<button
								class:active={version === 'long'}
								aria-pressed={version === 'long'}
								on:click={() => (version = 'long')}
							>
								{isEn ? 'Detailed' : 'Détaillée'}
							</button>
						</div>
					</div>
				{/if}
			</div>

			<label class="perso-field">
				<span class="perso-label">
					{isEn ? 'Add a personal sentence' : 'Ajoutez une phrase personnelle'}
					<em>{isEn ? 'recommended' : 'recommandé'}</em>
				</span>
				<textarea
					class="perso-input"
					rows="2"
					placeholder={isEn
						? 'Why this matters to you. An authentic line carries far more weight.'
						: 'Pourquoi cela vous touche. Une phrase sincère pèse bien plus lourd.'}
					bind:value={personalSentence}
					on:input={saveUser}
				></textarea>
				{#if !personalSentence.trim()}
					<p class="perso-nudge">
						{isEn
							? 'Without a personal line, your message looks like many others and lands with less impact. One sincere sentence changes everything.'
							: 'Sans phrase personnelle, votre message ressemble à beaucoup d’autres et a moins d’impact. Une phrase sincère change tout.'}
					</p>
				{/if}
			</label>

			<!-- Aperçu de l'email -->
			<div class="preview-head">
				<span class="preview-label">{isEn ? 'Preview' : 'Aperçu'}</span>
				<button class="shuffle-btn" type="button" on:click={shuffleWording}>
					{isEn ? '🔀 Suggest another version' : '🔀 Proposer une autre version'}
				</button>
			</div>
			<div class="email-preview">
				<div class="email-subject-line">
					<span class="subject-label">{isEn ? 'Subject:' : 'Objet :'}</span>
					<span>{subject}</span>
				</div>
				<div class="email-body" id="email-body">
					<p>{salutation(selectedRecipient)}</p>
					<p>{introLine(selectedRecipient, userName, introIndex)}</p>
					{#each buildParagraphs(angle, version, personalSentence, hookIndex, focusIndex, balanceIndex, askIndex) as para}
						<p>{para}</p>
					{/each}
					<p>
						{isEn ? 'Yours sincerely,' : 'Cordialement,'}<br />
						{userName.trim() || (isEn ? '[Your full name]' : '[Votre nom complet]')}<br />
						{userVille.trim() || selectedRecipient.signatureLocality}
					</p>
				</div>
			</div>

			{#if confidenceNote(selectedRecipient)}
				<p class="notice notice--warn">{confidenceNote(selectedRecipient)}</p>
			{/if}

			{#if !selectedRecipient.email}
				<p class="notice notice--info">
					{#if selectedRecipient.contactUrl}
						{isEn
							? 'This recipient does not publish an email address. Copy the text above, open their contact form, and paste it there.'
							: "Ce destinataire ne publie pas d'adresse email. Copiez le texte ci-dessus, ouvrez son formulaire de contact, puis collez-le."}
					{:else}
						{isEn
							? 'No public email or contact form was found for this recipient. Copy the text above and reach them via their official profile.'
							: "Aucun email ni formulaire public n'a été trouvé pour ce destinataire. Copiez le texte ci-dessus et contactez-le via sa fiche officielle."}
					{/if}
				</p>
			{/if}

			<div class="send-row">
				{#if selectedRecipient.email}
					<Button on:click={openMail} disabled={nameMissing}
						>{isEn ? 'Open my email' : 'Ouvrir mon email'}</Button
					>
				{:else if selectedRecipient.contactUrl && !nameMissing}
					<Button href={selectedRecipient.contactUrl} target="_blank" rel="noopener noreferrer">
						{isEn ? 'Open contact form' : 'Ouvrir le formulaire'}
					</Button>
				{:else if selectedRecipient.contactUrl}
					<Button disabled>{isEn ? 'Open contact form' : 'Ouvrir le formulaire'}</Button>
				{/if}
				<Button alt on:click={copyEmail} disabled={nameMissing}>
					{#if copied}
						{isEn ? '✓ Copied' : '✓ Copié'}
					{:else}
						{isEn ? 'Copy text' : 'Copier le texte'}
					{/if}
				</Button>
			</div>
			{#if nameMissing}
				<p class="notice notice--error send-hint">
					{isEn
						? 'Enter your name above to send your email.'
						: 'Indiquez votre nom ci-dessus pour envoyer votre email.'}
				</p>
			{/if}

			{#if selectedRecipient.email}
				<details class="webmail-fallback" open={mailAttempted}>
					<summary>
						{isEn
							? 'Nothing opened? Send it another way'
							: "Rien ne s'est ouvert ? Envoyez-le autrement"}
					</summary>
					<div class="webmail-links">
						<button class="webmail-btn" on:click={() => openWebmail('gmail')}>Gmail</button>
						<button class="webmail-btn" on:click={() => openWebmail('outlook')}>Outlook</button>
						<button class="webmail-btn" on:click={() => openWebmail('yahoo')}>Yahoo</button>
					</div>
					<p class="webmail-note">
						{isEn
							? 'Opens a pre-filled draft in your browser. The blind copy (BCC) is included.'
							: 'Ouvre un brouillon pré-rempli dans votre navigateur. La copie cachée (CCI) est incluse.'}
					</p>
				</details>

				<p class="deliverability">
					{isEn
						? 'Send from your personal mailbox: an email from a real constituent carries far more weight than a form. Check the recipient before sending.'
						: 'Envoyez depuis votre messagerie personnelle : un email d’un vrai électeur a bien plus de poids qu’un formulaire. Vérifiez le destinataire avant l’envoi.'}
				</p>

				<p class="bcc-hint">
					{isEn ? 'BCC' : 'CCI'} <code>{BCC}</code>
					{isEn ? '(helps us count letters sent)' : '(pour compter les emails envoyés)'}
				</p>
			{/if}

			<!-- Opt-in newsletter (consentement explicite) -->
			{#if newsletterStatus === 'done'}
				<p class="newsletter-done">
					{isEn
						? '✓ Thank you! You will receive our next actions.'
						: '✓ Merci ! Vous recevrez nos prochaines actions.'}
				</p>
			{:else}
				<div class="newsletter-optin">
					<label class="newsletter-check">
						<input type="checkbox" bind:checked={wantsNewsletter} />
						<span>
							{isEn
								? 'Keep me posted about the next actions (Pause AI newsletter).'
								: 'Tenez-moi informé des prochaines actions (newsletter Pause IA).'}
						</span>
					</label>
					{#if wantsNewsletter}
						<div class="newsletter-row">
							<input
								class="newsletter-input"
								type="email"
								placeholder={isEn ? 'your@email.com' : 'votre@email.com'}
								autocomplete="email"
								bind:value={userEmail}
								on:input={saveUser}
							/>
							<Button on:click={subscribeNewsletter}>
								{newsletterStatus === 'sending'
									? isEn
										? 'Sending…'
										: 'Envoi…'
									: isEn
										? 'Subscribe'
										: "S'inscrire"}
							</Button>
						</div>
						{#if newsletterStatus === 'error'}
							<p class="newsletter-error">
								{isEn
									? 'Please enter a valid email address.'
									: 'Veuillez entrer une adresse email valide.'}
							</p>
						{/if}
					{/if}
				</div>
			{/if}

			{#if sent.has(selectedRecipient.id)}
				<div class="after-send">
					<p>
						{#if isPress}
							{isEn
								? 'Message ready! Thank you, this really helps. One sincere message to the paper you read is exactly what counts.'
								: 'Message prêt ! Merci, votre geste compte vraiment. Un message sincère au titre que vous lisez, c’est exactement ce qui pèse.'}
						{:else}
							{isEn
								? `Message ready! Go back to write to your other ${targetNoun}.`
								: `Message prêt ! Revenez en arrière pour écrire à vos autres ${targetNoun}.`}
						{/if}
					</p>
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

	/* Mode intégré (dans une autre page) : on retire les marges et la largeur
	   maximale propres à une page autonome pour épouser le conteneur hôte. */
	article.embedded {
		max-inline-size: none;
		margin: 0;
		padding: 0;
	}

	/* Sélecteur d'outil (élus / presse) : un vrai commutateur, sous le hero */
	.tool-switch {
		max-inline-size: 40rem;
		margin: -1.25rem auto 2.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}

	.tool-switch-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.tool-tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.4rem;
		inline-size: 100%;
		padding: 0.35rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--bg-card);
	}

	.tool-tabs button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.85rem 1rem;
		border: none;
		border-radius: 10px;
		background: transparent;
		font-family: inherit;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-2);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.tool-tabs button.active {
		background: var(--brand);
		color: #1a1a1a;
		box-shadow: 0 2px 8px rgba(255, 148, 22, 0.35);
	}

	.tool-tabs button:not(.active):hover {
		background: var(--brand-light);
		color: var(--brand-subtle);
	}

	.tab-emoji {
		font-size: 1.1rem;
	}

	@media (max-width: 520px) {
		.tool-tabs button {
			font-size: 0.9rem;
			padding: 0.75rem 0.5rem;
		}
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

	/* Nom requis à l'étape 2 (mode presse intégré) */
	.name-gate {
		margin-bottom: 1.25rem;
		padding: 0.9rem 1rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg-subtle);
		transition: border-color 0.15s ease;
	}

	.name-gate--error {
		border-color: #d92d20;
	}

	.name-gate-label {
		display: block;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 0.5rem;
	}

	.name-gate .user-fields {
		margin-top: 0;
	}

	.send-hint {
		margin-top: 0.6rem;
	}

	/* Champs nom / commune */
	.user-fields {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.75rem;
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

	.user-input.input-error {
		border-color: #d92d20;
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

	.notice--info {
		color: var(--text-2);
		background: var(--bg-card);
		border: 1px solid var(--border);
	}

	/* Lien discret « Réinitialiser ma progression » */
	.reset-link {
		display: inline-block;
		margin-top: 1.25rem;
		padding: 0;
		background: none;
		border: none;
		font-size: 0.82rem;
		color: var(--text-secondary);
		text-decoration: underline;
		cursor: pointer;
	}

	.reset-link:hover {
		color: var(--brand-subtle);
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

	/* Député prioritaire (circonscription confirmée via l'adresse) */
	.elu-card.priority {
		border-width: 2px;
		border-color: var(--brand);
		background: var(--brand-light);
	}

	.priority-badge {
		display: inline-block;
		margin-top: 0.2rem;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--brand-subtle);
		background: color-mix(in srgb, var(--brand) 16%, transparent);
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
	}

	/* Recherche fine de la circonscription (cas ambigu : grandes villes) */
	.circo-finder {
		margin-bottom: 1rem;
		padding: 0.9rem 1rem;
		border: 1px dashed var(--brand);
		border-radius: 10px;
		background: color-mix(in srgb, var(--brand) 5%, var(--bg));
	}

	.circo-hint {
		margin: 0 0 0.6rem;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.circo-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.circo-input {
		flex: 1;
		min-inline-size: 12rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: inherit;
		background: var(--bg);
		color: var(--text);
	}

	.circo-msg {
		margin: 0.6rem 0 0;
		font-size: 0.88rem;
		font-weight: 600;
	}

	.circo-ok {
		color: var(--brand-subtle);
	}

	.circo-warn {
		color: var(--text-secondary);
	}

	.circo-privacy {
		margin: 0.5rem 0 0;
		font-size: 0.75rem;
		color: var(--text-secondary);
		line-height: 1.4;
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
	.msg-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1.1rem 2rem;
		align-items: flex-start;
		margin-bottom: 1.25rem;
	}

	.control {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.control-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
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

	.perso-field {
		display: block;
		margin-bottom: 1rem;
	}

	.perso-label {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-2);
		margin-bottom: 0.4rem;
	}

	.perso-label em {
		font-style: normal;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--brand-subtle);
		margin-left: 0.4rem;
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

	/* Incitation douce (non bloquante) quand la phrase perso est vide */
	.perso-nudge {
		margin: 0.5rem 0 0;
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--brand-subtle);
	}

	/* En-tête de l'aperçu : label + bouton « autre version » */
	.preview-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.preview-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
	}

	.shuffle-btn {
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--brand-subtle);
		font-size: 0.82rem;
		font-weight: 600;
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.shuffle-btn:hover {
		border-color: var(--brand);
		background: var(--brand-light);
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

	/* Fallback webmail (client mailto: non configuré) */
	.webmail-fallback {
		margin-top: 1rem;
		font-size: 0.85rem;
	}

	.webmail-fallback summary {
		cursor: pointer;
		color: var(--text-2);
	}

	.webmail-links {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.75rem;
	}

	.webmail-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--bg-card);
		color: var(--text);
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
	}

	.webmail-btn:hover {
		border-color: var(--brand);
	}

	.webmail-note {
		margin: 0.6rem 0 0;
		font-size: 0.78rem;
		color: var(--text-secondary);
		line-height: 1.5;
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

	/* Opt-in newsletter */
	.newsletter-optin {
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.newsletter-check {
		display: flex;
		gap: 0.55rem;
		align-items: flex-start;
		font-size: 0.9rem;
		color: var(--text-2);
		cursor: pointer;
		line-height: 1.45;
	}

	.newsletter-check input {
		margin-top: 0.2rem;
		flex-shrink: 0;
	}

	.newsletter-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.75rem;
	}

	.newsletter-input {
		flex: 1;
		min-inline-size: 200px;
		padding: 0.6rem 0.85rem;
		border: 2px solid var(--border);
		border-radius: 9px;
		font-size: 0.95rem;
		background: var(--bg);
		color: var(--text);
	}

	.newsletter-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	.newsletter-error {
		margin-top: 0.5rem;
		font-size: 0.82rem;
		color: #c0392b;
	}

	.newsletter-done {
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--brand-subtle);
	}

	/* Suite après envoi */
	.after-send {
		margin-top: 1.5rem;
		padding: 1.1rem 1.25rem;
		border: 1px solid var(--brand);
		background: var(--brand-light);
		border-radius: 12px;
	}

	.after-send p {
		font-size: 0.9rem;
		margin: 0 0 0.5rem;
	}

	.join-link {
		display: inline-block;
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--brand-subtle);
	}

	.join-link--block {
		margin-top: 1rem;
	}

	/* Passerelle élus → presse en fin de parcours */
	.next-tool {
		margin-top: 1.1rem;
		padding: 1rem 1.25rem;
		border: 1px solid var(--brand);
		border-radius: 12px;
		background: var(--brand-light);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.next-tool p {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
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
