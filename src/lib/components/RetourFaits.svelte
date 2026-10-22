<script lang="ts">
	// Lien « ← Les faits » en haut de chaque section de l'espace « Les faits ».
	import { ArrowLeft } from 'lucide-svelte'

	export let lang = 'fr'
</script>

<a class="retour" href="/{lang}/faits">
	<ArrowLeft size={16} aria-hidden="true" />
	{lang === 'en' ? 'The facts' : 'Les faits'}
</a>

<style>
	.retour {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-bottom: 1.25rem;
		color: var(--brand-subtle);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
	}

	.retour:hover {
		text-decoration: underline;
	}
</style>
