<script lang="ts">
	import Logo from './Logo.svelte'
</script>

<a href="/emploi-ia/questionnaire" title="Questionnaire sur l'IA et l'emploi de Pause IA">
	<h3>Questionnaire</h3>
	<div class="logo"><Logo fill_circle="white" fill_ai="white" emploi_ia={true} /></div>
	<p>Répondez à notre questionnaire sur l'IA et l'emploi</p>
</a>

<style>
	h3 {
		color: black;
	}

	p {
		color: white;
	}

	.logo {
		width: 16rem;
		height: 10rem;
	}

	a {
		display: flex;
		background-color: #ff9416;
		text-decoration: none;
		max-width: 500px;
		height: 200px;
		flex-direction: column;
		justify-content: center;
		padding: 1rem;
		margin: 5rem 0;
		border-radius: 16px;
		transition: transform 150ms ease;
	}

	a:hover {
		transform: translateY(-2px);
	}
</style>
