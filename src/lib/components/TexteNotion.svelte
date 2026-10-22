<script lang="ts">
	// Affiche un texte venu de Notion (gras, italique, liens https) sans jamais
	// l'interpréter comme du HTML.
	import type { Segment } from '$lib/server/idees-recues'

	export let segments: Segment[]
</script>

{#each segments as s}{#if s.lien}<a href={s.lien} target="_blank" rel="noopener"
			><span class:gras={s.gras} class:italique={s.italique}>{s.texte}</span></a
		>{:else}<span class:gras={s.gras} class:italique={s.italique}>{s.texte}</span>{/if}{/each}

<style>
	.gras {
		font-weight: 700;
	}

	.italique {
		font-style: italic;
	}
</style>
