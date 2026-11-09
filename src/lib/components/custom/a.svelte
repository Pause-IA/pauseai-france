<script lang="ts">
	import { url as siteUrl } from '$config'
	import { estEnAnglais } from '$lib/liensAnglais'
	import { onMount } from 'svelte'
	import Mail from 'lucide-svelte/icons/mail'
	import { page } from '$app/stores'
	import { pushState } from '$app/navigation'

	enum Type {
		Internal,
		External,
		Mail
	}

	export let href: string
	export let target: string | null = null

	const ICON_PROPS = { size: '0.8em' }

	let type = Type.Internal
	let anchor: HTMLAnchorElement

	// Les fichiers Markdown écrivent leurs liens internes sans préfixe de langue
	// (/propositions, /dangers…) pour rester lisibles et communs aux deux
	// langues. Les pages n'existent plus qu'en /fr et /en : on préfixe ici,
	// d'après la langue de la page courante, plutôt que dans chaque fichier.
	const LANG_FREE = ['/fr/', '/en/', '/api/', '/pdfs/', '/campaigns/', '/hero/', '/membres/']
	// Pages restées sans préfixe (françaises uniquement).
	const NO_LANG = ['/recrutement', '/guide-recrutement', '/rss', '/fr', '/en']
	$: lang = ($page.data.lang as string | undefined) ?? 'fr'
	$: resolved =
		href.startsWith('/') &&
		!LANG_FREE.some((p) => href.startsWith(p)) &&
		!NO_LANG.includes(href.replace(/[?#].*$/, '')) &&
		!/\.[a-z0-9]{2,4}($|[?#])/i.test(href)
			? `/${lang}${href}`
			: href

	if ((href.startsWith('http:') || href.startsWith('https:')) && !href.startsWith(siteUrl)) {
		type = Type.External
		target ??= '_blank'
	} else if (href.startsWith('mailto:')) type = Type.Mail

	// Prévenir le lecteur francophone qu'il va arriver sur une page en anglais.
	// Du texte, pas une icône : il est lu par les lecteurs d'écran et compris
	// sans légende. Masqué sur le site anglais, où il n'apprend rien.
	$: anglais = type === Type.External && lang !== 'en' && estEnAnglais(href)

	onMount(() => {
		if (href.startsWith('#')) {
			anchor.addEventListener('click', (ev) => {
				ev.preventDefault()
				const url = $page.url
				url.hash = href
				pushState(url, $page.state)
				const target = document.querySelector<HTMLElement>(href)
				if (!target) return
				target.scrollIntoView({ behavior: 'smooth' })
				target.tabIndex = -1
				target.focus({ preventScroll: true })
			})
		}
	})
</script>

<a
	href={resolved}
	{target}
	hreflang={anglais ? 'en' : undefined}
	rel={target === '_blank' ? 'noopener noreferrer' : undefined}
	bind:this={anchor}
>
	<slot />{#if anglais}<span class="en-anglais">&nbsp;(en anglais)</span
		>{/if}{#if type != Type.Internal}
		<span style="white-space: nowrap">
			<div class="icon">
				<!-- {#if type == Type.External}
					<ExternalLink {...ICON_PROPS} /> -->
				{#if type == Type.Mail}
					<Mail {...ICON_PROPS} />
				{/if}
			</div>
		</span>
	{/if}
</a>

<style>
	.en-anglais {
		font-size: 0.85em;
		opacity: 0.75;
		white-space: nowrap;
	}

	.icon {
		display: inline;
		vertical-align: text-top;
		margin-left: 0.1em;
	}
</style>
