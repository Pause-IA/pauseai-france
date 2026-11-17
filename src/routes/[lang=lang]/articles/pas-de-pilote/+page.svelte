<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Card, LinkCard, LinkGrid, Page } from '$components/ui'
	import type { Lang } from '$lib/i18n'

	export let data: { lang: Lang }
</script>

<PostMeta
	title={'Pas de pilote dans l’avion France | PauseAI France'}
	description={"Chômage massif des jeunes, modèle social fragilisé, dépendance à la Silicon Valley : à quoi ressemblera notre monde si nous ne réagissons pas à la montée de l'IA."}
/>

<Page
	title="Pas de pilote dans l’avion France"
	eyebrow="Actualités"
	lede="Avec une IA hors de contrôle, qu’est-ce qui pourrait mal se passer pour notre modèle économique et social ?"
	width="text"
	variant="note"
	as="article"
>
	<svelte:fragment slot="meta">
		<a href="/{data.lang}/emploi-ia">Campagne Emploi &amp; IA</a> · Article 2/2 · 5 min de lecture
	</svelte:fragment>

	<p>
		Aucune limite n’arrête pour le moment les géants américains de la tech, ni réglementaire, ni
		capitalistique, ni physique (énergie). Le développement des modèles d’IA de pointe se poursuit
		donc, sans autre intention que de les rendre capables de faire aussi bien ou mieux que les
		humains dans quasiment tous les domaines. Avec, à la clé, la promesse d’une croissance
		économique à deux chiffres, nécessaire pour assurer la rentabilité future des capitaux investis,
		mais dont le contenu reste pour le moins flou.
	</p>

	<h2>À tâtons dans le brouillard</h2>

	<p>
		Alors, cette croissance ? Il paraît clair que l’IA puisse être plus productive que les humains
		dans des tâches de plus en plus nombreuses, et par là augmenter les bénéfices des entreprises.
		On veut bien admettre qu’elle puisse rendre le travail plus intéressant pour les humains en les
		« augmentant » (mais ça peut aussi être l’inverse). On voit aussi que, même si le processus peut
		être complexe, le déploiement de l’IA dans les entreprises semble déjà inévitable dans de
		nombreux domaines : celles qui ne l’utiliseront pas ne pourront pas résister à la concurrence.
		On verra même se créer des entreprises entièrement pilotées par l’IA, sans employé ou presque.
	</p>

	<p>
		Au-delà de ces généralités, personne ne sait dire à quoi l’économie de demain ressemblera, sinon
		qu’il y aura moins d’humains occupés à des tâches purement intellectuelles ou, à terme, purement
		manuelles (le développement de la robotique étant également boosté par les progrès de
		l’intelligence artificielle). L’avenir se laisse d’autant moins appréhender que le moteur de
		cette mutation est une technologie littéralement incontrôlée, dont les « progrès » vont de pair
		avec une insécurité croissante.
	</p>

	<p>
		Faut-il croire les optimistes pour qui la révolution de l’IA, comme les révolutions
		industrielles avant elle, va supprimer des emplois pour mieux en créer d’autres et finalement
		déboucher sur une plus grande prospérité (théorie de la destruction créatrice) ? Non car cette
		révolution-là est beaucoup plus rapide que les précédentes : tout va beaucoup trop vite, sans
		stratégie industrielle claire, sans amortisseur social, sans réorientation rapide de notre
		système éducatif.
	</p>

	<h2>Le scénario le plus probable : un chômage massif et brutal</h2>

	<p>
		Dans un premier temps, ce seront surtout les jeunes qui ne trouveront plus d’emploi. Les tâches
		habituellement confiées à des juniors seront de plus en plus effectuées par l’IA, laquelle sera
		mise en place et contrôlée par des personnes expérimentées. Outre les préjudices causés aux
		individus de cette génération, les conséquences systémiques sont graves : les diplômes se
		démonétisent puisqu’ils ne procurent plus d’emploi. Sans emploi, l’acquisition d’expérience
		devient impossible, de même que la transmission des plus âgés vers les plus jeunes.
	</p>

	<p>
		À la différence de crises précédentes (désindustrialisation, automatisation, informatique,
		mondialisation) qui ont touché progressivement des travailleurs peu qualifiés ou très
		spécialisés, les premières tâches automatisables par l’IA sont celles effectuées par des
		professions intellectuelles aux salaires relativement élevés par rapport à la moyenne. C’est
		donc un volume important de recettes de cotisations sociales qui est menacé de volatilisation à
		court terme. L’évolution dépend ensuite des progrès de l’IA, susceptibles de monter à nouveau en
		flèche et entraînant une nouvelle vague d’automatisation.
	</p>

	<h2>Notre modèle socio-économique en jeu</h2>

	<p>
		Il est impensable, dans une économie sans ligne directrice claire, que les personnes déclassées
		par l’IA puissent acquérir en quelques mois de nouvelles compétences non remplaçables par l’IA
		(si elles les acquièrent jamais) et trouver un nouvel emploi.
	</p>

	<p>
		Ce qui est certain en revanche, c’est qu’une fonte rapide et irréversible des revenus du travail
		remettrait en cause notre modèle de société. Schématiquement, moins de travail, c’est moins de
		cotisations sociales donc moins d’argent pour assurer le versement de prestations (assurance
		chômage, maladie, retraite…). C’est moins de revenus pour vivre, pour consommer et pour faire
		tourner l’économie des biens et services de consommation.
	</p>

	<p>
		Même Sam Altman, le PDG d’OpenAI, s’en inquiète. Dans une note publiée en avril 2026, il enjoint
		aux pouvoirs publics de considérer des solutions telles qu’un revenu de remplacement, la
		création d’un fonds alimenté par les entreprises de la tech, ou d’autres.
	</p>

	<h2>Dépendance inacceptable</h2>

	<p>
		Méditons sur cette perspective : voulons-nous que nos vies dépendent des revenus d’entreprises
		hyper-puissantes, dont les produits ont par ailleurs des effets délétères sur nos démocraties,
		nos cerveaux, notre santé mentale, nos ressources naturelles ? Ou préférons-nous garder le
		contrôle de notre économie et de notre modèle social ?
	</p>

	<p>
		Mais au fond, quel contrôle nous reste-t-il, et comment le conserver ? Dans un monde où la
		croissance économique dépendra de moins en moins du travail et de plus en plus du capital
		investi dans l’intelligence artificielle et ses infrastructures, ce sont les revenus de ce
		capital qui devront être redistribués. Qui décidera si ce capital sera investi dans la santé
		pour tous et la transition écologique ou dans la guerre et la colonisation de la planète Mars ?
	</p>

	<p>
		Derrière la question de l’emploi, c’est véritablement notre monde qui est en jeu. Il faut bien
		comprendre que les progrès de l’intelligence artificielle générale accélèrent de manière
		incontrôlée la destruction de notre modèle socio-économique, pour le remplacer par une
		dépendance gravissime à la superpuissance de la Silicon Valley, des États-Unis et de la Chine.
	</p>

	<p>
		Cette perte de souveraineté n’est pas acceptable : nous demandons un moratoire international sur
		l’entraînement des modèles d’intelligence artificielle de pointe, le temps nécessaire pour que
		les conditions de sécurité et de contrôle démocratique soient réunies.
	</p>

	<Card variant="accent">
		<p>Vous aussi, agissez pour un développement de l’IA sûr et démocratique.</p>
		<p><Button href="/{data.lang}/emploi-ia">Je participe à la campagne</Button></p>
	</Card>

	<LinkGrid>
		<LinkCard
			href="/{data.lang}/articles/remplacer-humain"
			title="Remplacer l’humain, tel est l’objectif"
		>
			Article précédent de la série.
		</LinkCard>
		<LinkCard href="/{data.lang}/emploi-ia" title="Campagne Emploi &amp; IA">
			Revenir à la campagne.
		</LinkCard>
	</LinkGrid>
</Page>
