<!--
	Mise en valeur du second membre du titre du héros (« agissons maintenant »).

	Le texte reste de l'encre de la page et c'est le SOULIGNEMENT qui porte
	l'orange de marque, plein. Un orange lisible en texte aurait demandé de
	l'assombrir à rgb(217, 106, 0) au minimum — l'orange de marque ne fait que
	2,21:1 sur blanc, sous le seuil même des grands titres — et le résultat ne
	ressemblait plus à la marque. Le trait, lui, est une décoration : il porte
	la vraie couleur sans aucune contrainte de contraste.
-->
<span>
	<slot />
</span>

<style>
	span {
		color: var(--text);
		text-decoration: underline;
		text-decoration-color: var(--brand);
		text-decoration-thickness: 0.12em;
		text-underline-offset: 0.12em;
	}
</style>
