<script lang="ts">
	/** Grille de LinkCard : autant de colonnes que la largeur le permet. */
	export let min = '15rem'
</script>

<div class="link-grid" style:--min={min}>
	<slot />
</div>

<style>
	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(var(--min), 100%), 1fr));
		gap: 1rem;
		margin: 1.25rem 0 2.5rem;
	}
</style>
