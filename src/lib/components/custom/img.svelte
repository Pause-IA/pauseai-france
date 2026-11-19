<script lang="ts">
	/** Image d'un contenu Markdown. */
	export let src: string
	export let alt: string
</script>

<img {src} {alt} loading="lazy" decoding="async" />

<style>
	/* Sans cette contrainte, une image part à sa taille naturelle : celle de la
	   cartographie de réseau du guide sortait de la colonne de lecture sur
	   1 400 px. `height: auto` garde ses proportions. */
	img {
		max-inline-size: 100%;
		block-size: auto;
		border-radius: var(--radius-md);
	}
</style>
