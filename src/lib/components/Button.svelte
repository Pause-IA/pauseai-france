<script lang="ts">
	import { url as siteUrl } from '$config'

	export let alt = false
	export let href = ''
	export let target = ''
	export let rel = ''
	export let type: 'button' | 'submit' | 'reset' = 'button'
	export let disabled = false

	/* Règle du site : un lien externe s'ouvre dans un nouvel onglet. Les liens
	   des fichiers Markdown passent par `custom/a.svelte`, qui l'applique déjà ;
	   les boutons ne l'avaient nulle part, et onze appels l'oubliaient. On le
	   pose ici une fois plutôt qu'à chaque appel, un `target` explicite reste
	   prioritaire. `rel` protège l'onglet d'origine (`noopener`). */
	$: externe = Boolean(href) && /^https?:\/\//.test(href) && !href.startsWith(siteUrl)
	$: cible = target || (externe ? '_blank' : '')
	$: relation = rel || (cible === '_blank' ? 'noopener noreferrer' : '')
</script>

{#if href}
	<a {href} target={cible} rel={relation} class:alt aria-disabled={disabled}>
		<slot />
	</a>
{:else}
	<button {disabled} {type} on:click class:alt>
		<slot />
	</button>
{/if}

<style>
	button,
	a {
		background-color: var(--btn-bg);
		/* Le fond est orange dans les deux thèmes : le texte doit rester foncé,
		   sinon il tombe à 1,9:1 en mode sombre. La variante claire (.alt)
		   reprend la couleur de texte de la page, plus bas. */
		color: var(--on-brand) !important;
		/* Voir --btn-border : sans ce trait, le bord du bouton est à 2,21:1
		   sur blanc, sous le seuil des contours de composants. */
		border: 1px solid var(--btn-border);
		/* Le dépôt n'a pas de `box-sizing: border-box` global : sans cette
		   ligne, la bordure ajouterait 2 px à la hauteur fixée. */
		box-sizing: border-box;
		border-radius: var(--radius-btn);
		padding: 0.5rem 1rem;
		font-family: var(--font-body);
		cursor: pointer;
		display: inline-flex;
		font-weight: bold;
		position: relative;
		min-width: 7rem;
		/* Appropriate tap targets */
		height: 48px;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		max-width: fit-content;
		transition:
			background-color 0.15s ease,
			transform 0.15s ease,
			box-shadow 0.15s ease;
		box-shadow: var(--shadow-brand);
	}

	button.alt,
	a.alt {
		background-color: var(--btn-alt-bg);
		/* Fond clair en mode clair, sombre en mode sombre : le texte suit. */
		color: var(--text) !important;
		border-color: var(--btn-border);
		box-shadow: 0 2px 6px rgba(var(--ink-rgb), 0.1);
	}

	button:not(.alt):hover,
	a:not(.alt):hover {
		background-color: var(--btn-hover-bg);
		transform: translateY(-1px);
		box-shadow: 0 5px 16px rgba(var(--brand-rgb), 0.42);
	}

	button.alt:hover,
	a.alt:hover {
		background-color: var(--btn-alt-hover-bg);
		transform: translateY(-1px);
		box-shadow: 0 5px 12px rgba(var(--ink-rgb), 0.14);
	}

	button:active,
	a:active {
		background-color: var(--btn-active-bg);
		/* using box-shadow instead of border prevents layout shifts */
		box-shadow: inset 0 0 0 0.125rem var(--btn-active-border);
		transform: translateY(0);
	}

	button.alt:active,
	a.alt:active {
		background-color: var(--btn-alt-active-bg);
		box-shadow: inset 0 0 0 0.125rem var(--btn-alt-active-border);
		transform: translateY(0);
	}

	button:focus-visible,
	a:focus-visible {
		background-color: var(--btn-focus-bg);
		outline: var(--btn-focus-border) solid 0.25rem;
		outline-offset: 0;
	}

	button.alt:focus-visible,
	a.alt:focus-visible {
		background-color: var(--btn-alt-focus-bg);
		outline: var(--btn-alt-focus-border) solid 0.25rem;
		outline-offset: 0;
	}

	/* Disabled state */
	button:disabled,
	a[aria-disabled='true'] {
		background-color: var(--bg-subtle);
		cursor: not-allowed;
		opacity: 0.7;
		box-shadow: none;
		transform: none;
	}
</style>
