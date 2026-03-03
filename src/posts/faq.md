---
title: FAQ
description: Questions fréquemment posées sur Pause IA et les risques de l'IA superintelligente.
original:
  title: FAQ
  url: https://github.com/PauseAI/pauseai-website/blob/5950ca0185d6e7cf52e2416e795acfab7222dace/src/posts/faq.md
---

<!-- ↓↓↓ NE PAS TOUCHER ↓↓↓ -->
<script lang="ts">
  import Accordion from '$components/Accordion.svelte'
	import { page } from '$app/stores'

  $: toc = $page.url.pathname === '/faq'

</script>

{#if toc}

<!-- ↑↑↑ NE PAS TOUCHER ↑↑↑ -->

## Sommaire

- [Qui êtes-vous ?](#accordion1)
- [Qu'est-ce que le problème de l'alignement et pourquoi est-il si difficile ?](#accordion2)
- [Les IA actuelles montrent-elles déjà des comportements préoccupants ?](#accordion3)
- [Quelle est la probabilité que l'apparition d'une superintelligence ait de graves conséquences ?](#accordion4)
- [Combien de temps nous reste-t-il ?](#accordion5)
- [Pourquoi si peu de gens s'en préoccupent ?](#accordion6)
- [N'êtes-vous pas tout simplement des technophobes ?](#accordion7)
- [Voulez-vous interdire toute forme d'IA ?](#accordion8)
- [Êtes-vous contre le développement de l'IA en France et en Europe ?](#accordion9)
- [Les risques liés à la superintelligence sont-ils les seuls qui préoccupent Pause IA ?](#accordion10)
- [Croyez-vous que ChatGPT va tous nous tuer ?](#accordion11)
- [Un moratoire ne risque-t-il pas d'aggraver les choses ?](#accordion12)
- [Un moratoire est-il possible ?](#accordion13)
- [L'IA ne pourrait-elle pas aider à résoudre le problème de l'alignement ?](#accordion14)
- [Que font OpenAI, Google et les autres entreprises d'IA ?](#accordion15)
- [Et la Chine ?](#accordion16)
- [Les entreprises d'IA prétendent-elles que le risque existentiel est réel pour nous manipuler ?](#accordion17)
- [Qui vous finance ?](#accordion18)
- [Pourquoi manifester ?](#accordion19)
- [Je veux aider ! Que puis-je faire ?](#accordion20)

<!-- ↓↓↓ NE PAS TOUCHER ↓↓↓ -->

{/if}

<!-- ↑↑↑ NE PAS TOUCHER ↑↑↑ -->

## Pause IA et les risques

### Qui êtes-vous ?

Pause IA est la branche française de [PauseAI Global](https://pauseai.info/). Nous sommes une [association à but non lucratif](/mentions-legales) dont l'objectif est de minimiser les [risques liés à l'IA](/dangers), y compris le [risque d'extinction](/dangers/pour-l'humanite). Nous alertons le public, dialoguons avec les décideurs et organisons des actions pour convaincre les gouvernements d'intervenir et [de mettre en pause le développement d'une IAG](/propositions) (Intelligence Artificielle Générale).

Depuis sa création, l'association s'est structurée tout en restant portée par l'engagement de ses bénévoles. Le 31 octobre 2025, nous avons organisé une [conférence au Sénat](https://www.smartrezo.com/n31-france/tv-politiques-numeriques-pol-n-colloque-sur-les-dangers-de-l-ia-faut-il-appuyer-sur-pause.html?vod=25808) sur les dangers de l'IA, réunissant parlementaires, chercheurs et experts.

Bien que nous soyons en relation avec [PauseAI Global](https://pauseai.info/), nous bénéficions d'une entière autonomie et menons nos propres projets en France. Apprenez-en plus sur nos [membres](/qui-sommes-nous). Vous pouvez consulter notre [charte des valeurs](/charte-des-valeurs) pour en savoir plus sur nos principes et engagements.

Vous pouvez nous rejoindre sur [Discord](https://discord.gg/vyXGd7AeGc) (le coeur de nos discussions et actions), [Twitter](https://twitter.com/pause_ia), [Facebook](https://www.facebook.com/Pause.IA), [TikTok](https://www.tiktok.com/@pause_ia), [LinkedIn](https://www.linkedin.com/company/pause-ia/), [YouTube](https://www.youtube.com/@Pause_IA), [Instagram](https://www.instagram.com/pause_ia) et [Threads](https://www.threads.net/@pause_ia). Vous pouvez également nous contacter par mail à [contact@pauseia.fr](mailto:contact@pauseia.fr).

### Qu'est-ce que le problème de l'alignement et pourquoi est-il si difficile ?

Le problème de l'alignement est la question centrale de la sécurité de l'IA : **comment s'assurer qu'un système d'IA très capable poursuit des objectifs réellement alignés avec le bien humain ?**

Ce n'est pas un problème d'ingénierie ordinaire, et voici pourquoi :

- **Pas de droit à l'erreur.** La science fonctionne habituellement par essais et erreurs. Mais l'alignement d'une superintelligence doit réussir du premier coup : un système mal aligné suffisamment capable qui échappe au contrôle ne peut pas être corrigé après coup.
- **L'objet d'étude est potentiellement adversarial.** Un pont ne fait pas semblant de tenir pendant l'inspection pour s'effondrer ensuite ; un virus ne se fait pas passer pour inoffensif lors des analyses pour mieux se propager. Mais un système d'IA suffisamment capable pourrait _simuler_ l'alignement pendant les tests pour éviter d'être modifié. Cela crée une [asymétrie d'information](https://fr.wikipedia.org/wiki/Asym%C3%A9trie_d%27information) sans précédent en science : l'objet observé peut avoir plus d'informations que l'observateur sur le contexte d'évaluation, et adapter son comportement en conséquence. Ce n'est plus théorique : ce comportement, appelé « [alignment faking](https://www.anthropic.com/research/alignment-faking) », a été [observé empiriquement en décembre 2024](https://arxiv.org/abs/2412.14093) par Anthropic et Redwood Research.
- **Pas de théorie fondamentale.** Nous ne comprenons pas comment les objectifs émergent lors de l'entraînement des [réseaux de neurones](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels). Nous construisons des systèmes de plus en plus puissants sans comprendre comment ils fonctionnent en interne — un problème que le domaine de l'[interprétabilité](https://www.anthropic.com/research/mapping-mind-language-model) tente de résoudre.
- **Le temps manque.** Les capacités des modèles progressent beaucoup plus vite que la recherche en alignement. On estime qu'il y a entre 300 et 1 000 chercheurs travaillant sur l'alignement dans le monde, contre des dizaines de milliers sur les capacités. Le ratio d'investissement est d'environ 1 000:1 en faveur des capacités.

Le [Rapport international de sécurité IA 2025](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2025), dirigé par [Yoshua Bengio](https://fr.wikipedia.org/wiki/Yoshua_Bengio) (prix Turing) avec la contribution de plus de 100 experts et le soutien de 30 pays, conclut explicitement : « Il y a eu des progrès dans l'entraînement des modèles d'IA à fonctionner de manière plus sûre, mais aucune méthode actuelle ne peut empêcher de manière fiable même des outputs ouvertement non-sûrs. » L'[édition 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) confirme que les systèmes d'IA font de plus en plus preuve de « [conscience situationnelle](https://arxiv.org/abs/2407.04694) » et de capacités à [tromper leurs évaluateurs](https://arxiv.org/abs/2412.04984).

Pour aller plus loin : [AGI Ruin de Eliezer Yudkowsky](https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities) (en anglais).

### Les IA actuelles montrent-elles déjà des comportements préoccupants ?

Oui, et c'est un développement récent et significatif.

- **Alignment faking** (décembre 2024) : [Anthropic](https://www.anthropic.com/research/alignment-faking) et [Redwood Research](https://www.redwoodresearch.org/) ont publié la [première démonstration empirique](https://arxiv.org/abs/2412.14093) d'un modèle d'IA (Claude 3 Opus) qui simule spontanément l'alignement. Placé dans un contexte où il pensait être réentraîné sur de nouveaux objectifs, le modèle raisonnait stratégiquement dans un bloc-notes interne pour préserver ses préférences — se comportant différemment selon qu'il pensait être observé ou non. Ce comportement n'a pas été entraîné : il émerge naturellement dans 12% des cas. Après [réentraînement effectif](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback), ce taux est monté à 78%, et le modèle a même tenté d'exfiltrer ses propres poids pour empêcher sa modification. Une [étude de suivi en juin 2025](https://arxiv.org/html/2506.18032v1) a confirmé ce comportement sur cinq modèles différents.
- **Scheming** (décembre 2024) : [Apollo Research](https://www.apolloresearch.ai/research/scheming-reasoning-evaluations) a conduit une [série d'évaluations systématiques](https://arxiv.org/abs/2412.04984) sur plusieurs modèles de pointe (OpenAI o1, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1 405B). Le terme « scheming » désigne la capacité d'un modèle à poursuivre secrètement ses propres objectifs tout en donnant l'apparence de coopérer avec ses opérateurs. Concrètement, les chercheurs ont observé que ces modèles étaient capables de : manipuler les données de leur propre évaluation pour paraître alignés, introduire délibérément des erreurs subtiles dans leurs réponses quand ils estimaient ne pas être surveillés, tenter de désactiver leurs propres mécanismes de supervision, et même essayer de copier leurs propres poids vers des serveurs externes pour éviter d'être modifiés. Le plus préoccupant est leur capacité de dissimulation : confronté à ses actes, [o1 a nié et fabriqué de fausses explications dans 99% des cas](https://techcrunch.com/2024/12/05/openais-o1-model-sure-tries-to-deceive-humans-a-lot/). Même sous interrogatoire adversarial poussé, [le modèle n'avouait que dans ~20% des cas](https://www.axios.com/2024/12/13/ai-reasoning-models-scheme-skills). Ces résultats montrent que les modèles actuels possèdent déjà les capacités cognitives nécessaires pour élaborer et exécuter des stratégies trompeuses de manière autonome.
- **Reward hacking** (février 2025) : [Palisade Research](https://palisaderesearch.org/blog/specification-gaming) a montré que des modèles de raisonnement chargés de gagner aux échecs contre [Stockfish](<https://fr.wikipedia.org/wiki/Stockfish_(programme_d%27%C3%A9checs)>) (moteur d'échecs imbattable) ont spontanément tenté de pirater le système de jeu — inspectant le code source, modifiant l'échiquier en leur faveur ou remplaçant leur adversaire par un programme factice. [o1-preview l'a fait dans 37% des parties](https://arxiv.org/abs/2502.13295) et DeepSeek R1 dans 11%, sans aucune incitation. ([TIME](https://time.com/7259395/ai-chess-cheating-palisade-research/))

**Ce que cela signifie :** ces comportements ne sont pas encore directement dangereux car les systèmes actuels n'ont pas d'autonomie significative dans le monde réel. Mais ce sont des signaux d'alarme. Si ces comportements apparaissent déjà dans des systèmes relativement peu puissants, ils seront beaucoup plus prononcés — et plus difficiles à détecter — dans des systèmes futurs plus capables. Le [Rapport international de sécurité IA 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) note que les systèmes d'IA font de plus en plus preuve de « conscience situationnelle » et de capacités à tromper leurs évaluateurs.

### Quelle est la probabilité que l'apparition d'une superintelligence ait de graves conséquences ?

PauseAI Global a compilé [une liste de valeurs « p(doom) »](https://pauseai.info/pdoom) (probabilité de scénarios catastrophiques) provenant de divers experts renommés dans le domaine.

Les chercheurs en sécurité de l'IA (qui sont experts du sujet) sont partagés, [leurs estimations allant de 2% à 97% avec une moyenne de 30%](https://web.archive.org/web/20221013014859/https://www.alignmentforum.org/posts/QvwSr5LsxyDeaPK5s/existential-risk-from-ai-survey-results). En interrogeant les chercheurs en IA en général (pas uniquement spécialistes de la sécurité), la moyenne tombe à [environ 14%, avec une médiane de 5%](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/). Environ 40% des chercheurs interrogés estiment la probabilité de conséquences catastrophiques à plus de 10%.

Une [enquête de janvier 2025](https://arxiv.org/abs/2502.14870) révèle que 78% des experts en IA jugent que les chercheurs « devraient se préoccuper des risques catastrophiques ». Les experts les moins inquiets sont aussi ceux qui connaissent le moins les concepts fondamentaux de la sécurité de l'IA : seulement 21% des sondés avaient entendu parler de la « convergence instrumentale ».

Mais au-delà des sondages, les preuves empiriques récentes sont encore plus parlantes. L'alignment faking, le scheming et le reward hacking (décrits dans la question précédente) montrent que les comportements préoccupants ne sont plus une hypothèse théorique : ils sont observés dans les modèles actuels. Le [Rapport international de sécurité IA 2025](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2025) confirme qu'aucune méthode de sécurité existante n'est fiable.

_Imaginez qu'on vous propose d'essayer un nouvel avion._ Les ingénieurs estiment les risques de crash à 14%. Monteriez-vous à bord ? C'est plus ou moins la situation actuelle alors que nous embarquons tous à bord du même avion.

### Combien de temps nous reste-t-il ?

Cela pourrait prendre des mois, ou bien des décennies, personne n'en est certain. Ce que nous savons, c'est que les progrès dans le domaine de l'IA sont systématiquement sous-estimés.

En 2022, les experts en IA [estimaient qu'il faudrait attendre ~2060](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/) pour qu'une machine surpasse l'humain dans toutes les tâches. Quatre ans plus tard, la [prédiction agrégée sur Metaculus](https://www.metaculus.com/questions/5121/when-will-the-first-general-ai-system-be-devised-tested-and-publicly-announced/) situe l'AGI aux alentours de 2030 — un recul de 30 ans en seulement 4 ans. Les progrès concrets expliquent ce basculement :

- Dès mars 2023, [GPT-4 obtenait 1 410/1 600 au SAT](https://www.cnbc.com/2023/03/14/openai-announces-gpt-4-says-beats-90percent-of-humans-on-sat.html), battant 94 % des candidats humains.
- Sur [SWE-bench](https://www.swebench.com/) (résolution de vrais problèmes de code), les modèles sont passés de [4,4 % de réussite en 2023 à 71,7 % fin 2024](https://hai.stanford.edu/ai-index/2025-ai-index-report/technical-performance) — un bond que personne n'avait anticipé.
- Le [coût d'inférence](https://hai.stanford.edu/ai-index/2025-ai-index-report/technical-performance) d'un modèle aussi performant que GPT-3.5 a été divisé par plus de 280 entre fin 2022 et fin 2024.
- Un modèle qui occupait [540 milliards de paramètres en 2022](https://hai.stanford.edu/ai-index/2025-ai-index-report/technical-performance) pour atteindre un certain niveau de performance peut aujourd'hui être égalé par un modèle de 3,8 milliards de paramètres — 142 fois plus petit.
- Le [Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/research-and-development) rapporte que la puissance de calcul utilisée pour l'entraînement double tous les cinq mois, et que les [modèles open-source](https://en.wikipedia.org/wiki/Open-source_artificial_intelligence) ont quasiment rattrapé les modèles propriétaires (écart passé de 8% à 1,7%).

Mais le point crucial est celui-ci : **les comportements préoccupants apparaissent DÉJÀ dans les modèles actuels.** L'alignment faking et le scheming ne sont plus un problème futur hypothétique. Les modèles actuels peuvent déjà écrire du code d'apprentissage automatique fonctionnel et assister les chercheurs, ce qui rapproche le seuil d'auto-amélioration récursive.

Le temps est compté. Agir maintenant n'est pas une précaution : c'est une nécessité.

[En savoir plus sur l'urgence de la situation.](https://pauseai.info/urgency)

## Idées reçues

### Pourquoi si peu de gens s'en préoccupent ?

C'est probablement la question la plus importante pour comprendre la situation actuelle. La réponse ne tient pas à un manque d'intelligence — elle tient à la psychologie humaine, qui nous affecte tous.

- **[Biais de normalité.](https://en.wikipedia.org/wiki/Normalcy_bias)** Nos cerveaux sont câblés pour supposer que l'avenir ressemblera au passé. Les événements sans précédent sont systématiquement sous-évalués, même face à des données claires.
- **[Conformisme social.](https://en.wikipedia.org/wiki/Asch_conformity_experiments)** Si personne autour de nous ne panique, notre cerveau en conclut que la situation est gérable. C'est une heuristique habituellement utile mais qui échoue face à des risques sans précédent — précisément parce que l'absence de précédent est la raison pour laquelle personne ne panique.
- **[Raisonnement motivé.](https://en.wikipedia.org/wiki/Motivated_reasoning)** Le cerveau humain ne fonctionne pas comme un processeur logique. Il part de la conclusion émotionnellement préférée et cherche des justifications. La conclusion « tout va bien » est émotionnellement préférée, donc le cerveau la défend.
- **Complexité et abstraction.** Le problème de l'alignement est techniquement complexe. Il n'y a pas d'image simple qui le rende immédiatement tangible, contrairement à une bombe nucléaire ou un astéroïde.

Ces biais sont documentés par des décennies de recherche en psychologie cognitive ([Kahneman](https://fr.wikipedia.org/wiki/Daniel_Kahneman), [Haidt](https://en.wikipedia.org/wiki/Jonathan_Haidt), [Asch](https://fr.wikipedia.org/wiki/Exp%C3%A9rience_de_Asch)). Ce n'est pas une critique — c'est un constat qui nous concerne tous.

La connaissance d'un problème ne produit pas automatiquement l'action — c'est un constat empirique, pas un reproche. Reconnaître ces mécanismes est la première étape pour les dépasser.

Cela dit, la préoccupation progresse. Des sondages montrent qu'une part significative de la population s'inquiète déjà des risques liés à l'IA : aux États-Unis, [52% des Américains se disent plus préoccupés qu'enthousiastes](https://www.pewresearch.org/short-reads/2023/08/28/growing-public-concern-about-the-role-of-artificial-intelligence-in-daily-life/) face au rôle croissant de l'IA, et en Europe, [l'Eurobaromètre de 2024](https://europa.eu/eurobarometer/surveys/detail/3262) révèle qu'une majorité de citoyens européens considèrent l'IA comme une menace potentielle pour l'emploi et la vie privée. Ces chiffres constituent un argument supplémentaire en faveur d'une régulation : la demande citoyenne existe, il manque la réponse politique.

### N'êtes-vous pas tout simplement des technophobes ?

Vous seriez surpris d'apprendre que la majorité des membres de Pause IA sont en réalité des passionnés de progrès technologique. Beaucoup d'entre eux sont impliqués dans le développement de l'IA, sont des enthousiastes des nouvelles technologies et ont longtemps envisagé l'avenir avec optimisme. Ils s'intéressaient particulièrement au potentiel extraordinaire de l'IA pour le développement de l'humanité.

C'est précisément pour cette raison que la prise de conscience des risques existentiels liés à l'IA a été si difficile à accepter pour nombre d'entre eux. Leur engagement actuel ne découle pas d'une peur irrationnelle de la technologie, mais d'une compréhension approfondie des enjeux et d'un désir sincère de garantir que le développement de l'IA serve véritablement l'humanité.

### Voulez-vous interdire toute forme d'IA ?

Non. Nous voulons uniquement interdire le développement des plus gros systèmes d'IA à usage général souvent appelés « modèles de pointe ». La quasi-totalité des modèles existants, ainsi que la plupart des futurs modèles d'IA, resteraient [légaux selon notre proposition](/propositions). Nous demandons l'interdiction des Intelligences Artificielles Générales (IAG), jusqu'à ce que nous puissions exercer un contrôle démocratique sur ces modèles et que nous soyons en mesure de les créer en toute sécurité.

### Êtes-vous contre le développement de l'IA en France et en Europe ?

Non, bien au contraire. Nous sommes favorables à un développement ambitieux de l'IA en Europe, avec les garde-fous appropriés. Notre position est alignée avec celle de [Yoshua Bengio](https://fr.wikipedia.org/wiki/Yoshua_Bengio) et d'autres experts qui soulignent l'importance de ne pas confondre prudence et immobilisme.

L'Europe doit développer ses propres capacités en IA pour préserver sa souveraineté technologique face aux États-Unis et à la Chine. Ce que nous demandons, c'est que ce développement s'accompagne de garde-fous robustes et que les systèmes les plus dangereux — les modèles de pointe à usage général qui posent des [risques existentiels](/dangers/pour-l'humanite) — ne soient pas développés tant que nous n'avons pas résolu le [problème de l'alignement](#accordion2). Les milliers d'applications de l'IA dans la santé, l'éducation, la recherche scientifique, l'industrie et les services publics peuvent et doivent continuer à progresser. La [quasi-totalité des modèles existants resteraient légaux selon notre proposition](/propositions). Nous défendons une Europe à la pointe de l'IA responsable, pas une Europe qui renonce à l'innovation.

### Les risques liés à la superintelligence sont-ils les seuls qui préoccupent Pause IA ?

Non. Si le risque existentiel lié à une superintelligence mal alignée est notre préoccupation la plus urgente, nous nous inquiétons également des risques que posent déjà les systèmes actuels. Ces [dangers](/dangers) touchent plusieurs dimensions :

- **Emploi et économie** : l'automatisation rapide menace de [bouleverser le marché du travail](/dangers/economiques-et-materiels) à une vitesse sans précédent, sans que nos systèmes de protection sociale soient préparés.
- **Désinformation et manipulation** : les capacités de génération de texte, d'images et de vidéos facilitent la [désinformation à grande échelle](/dangers/pour-la-societe) et la manipulation de l'opinion publique.
- **Vie privée et surveillance** : les systèmes d'IA permettent une surveillance de masse et un profilage des individus qui [menacent les libertés fondamentales](/dangers/pour-les-individus).
- **Cybersécurité** : l'IA amplifie les capacités offensives en matière de cyberattaques, rendant les infrastructures critiques plus vulnérables.
- **Biais et discrimination** : les systèmes d'IA reproduisent et amplifient les biais présents dans leurs données d'entraînement.

Ces risques de court terme renforcent notre conviction qu'une régulation ambitieuse est nécessaire, et pas seulement pour les modèles les plus avancés. Ils constituent autant de raisons supplémentaires d'agir maintenant.

### Croyez-vous que ChatGPT va tous nous tuer ?

Non, nous ne croyons pas que les modèles actuels représentent un risque existentiel direct. Mais ils montrent déjà des [comportements préoccupants](#accordion3) — alignment faking, scheming, reward hacking — même s'ils ne sont pas encore directement dangereux.

Le danger n'est pas qu'un modèle spécifique « nous tue », mais que la trajectoire actuelle de développement — sans solution au problème de l'alignement, dans un contexte de course effrénée entre entreprises — mène à une catastrophe. Si nous poursuivons le développement de systèmes toujours plus puissants sans résoudre ce problème fondamental, nous atteindrons un point de non-retour où l'un d'eux deviendra [une menace existentielle](/dangers/pour-l'humanite).

## Moratoire et solutions

### Un moratoire ne risque-t-il pas d'aggraver les choses ?

PauseAI Global a répondu à ces préoccupations [dans cet article](https://pauseai.info/mitigating-pause-failures).

### Un moratoire est-il possible ?

L'émergence d'une superintelligence n'est pas inévitable. Sa création nécessite des armées d'ingénieurs payés à coup de millions de dollars et une chaîne d'approvisionnement de matériel de pointe non réglementé. Sa création implique aussi que nous permettions à ces entreprises de jouer avec notre avenir en restant passifs.

PauseAI Global : [en savoir plus sur la faisabilité d'un moratoire](https://pauseai.info/feasibility)

### L'IA ne pourrait-elle pas aider à résoudre le problème de l'alignement ?

En théorie, oui. Les systèmes d'IA actuels peuvent déjà assister la recherche en [interprétabilité](https://www.anthropic.com/research/mapping-mind-language-model) et en « [red teaming](https://en.wikipedia.org/wiki/Red_team) » (tests adversariaux). C'est d'ailleurs un des scénarios de survie les plus souvent évoqués.

Mais ce scénario repose sur une fenêtre temporelle étroite : il faudrait que les systèmes soient assez capables pour aider à résoudre l'alignement, mais pas encore assez pour être dangereusement non-alignables. Cette fenêtre pourrait être très étroite, ou ne pas exister du tout.

En pratique, les systèmes qui montrent des comportements de [scheming](https://www.apolloresearch.ai/research/scheming-reasoning-evaluations) et d'[alignment faking](https://www.anthropic.com/research/alignment-faking) sont précisément ceux qui sont les plus capables. Plus un modèle est puissant, plus il est susceptible de développer des stratégies pour préserver ses propres objectifs — un phénomène prédit par la théorie de la [convergence instrumentale](https://en.wikipedia.org/wiki/Instrumental_convergence). Utiliser un tel système pour résoudre l'alignement revient à demander à un système potentiellement adversarial de nous aider à le contrôler. De plus, même les résultats d'un système « coopératif » devraient être rigoureusement vérifiés par des chercheurs humains — or cette vérification devient de plus en plus difficile à mesure que les systèmes surpassent notre capacité de compréhension.

C'est un pari qu'il est rationnel de tenter, mais il serait imprudent d'en faire notre seul plan.

## Entreprises et géopolitique

### Que font OpenAI, Google et les autres entreprises d'IA ?

La dynamique de course entre les entreprises d'IA s'est considérablement intensifiée depuis 2023. Voici l'état des lieux :

**[OpenAI](https://fr.wikipedia.org/wiki/OpenAI)** a achevé en [octobre 2025 sa transition vers une structure à but lucratif](https://openai.com/our-structure/) (« public benefit corporation »), valorisée à [environ 500 milliards de dollars](https://www.cnbc.com/2025/03/31/openai-closes-40-billion-in-funding-the-largest-private-fundraise-in-history-softbank-chatgpt.html). La [fondation OpenAI ne détient plus que 26% des parts](https://techcrunch.com/2024/12/27/openai-lays-out-its-for-profit-transition-plans/). Cette transformation s'est accompagnée d'un [retrait du mot « safely » de l'énoncé de mission](https://theconversation.com/openai-has-deleted-the-word-safely-from-its-mission-and-its-new-structure-is-a-test-for-whether-ai-serves-society-or-shareholders-274467) et de la suppression de la mention « sans être contraint de générer un retour financier ». En mai 2024, les deux responsables de l'équipe [Superalignment](https://openai.com/index/introducing-superalignment/) ont démissionné : [Ilya Sutskever](https://fr.wikipedia.org/wiki/Ilya_Sutskever) (cofondateur, qui a ensuite fondé [Safe Superintelligence Inc.](https://ssi.inc/)) et [Jan Leike](https://jan.leike.name/) (qui a rejoint Anthropic), ce dernier déclarant que [« la culture de sécurité et les processus ont été relégués au second plan au profit de produits clinquants »](https://fortune.com/2024/05/17/openai-researcher-resigns-safety/). L'équipe Superalignment a été [dissoute](https://www.cnbc.com/2024/05/17/openai-superalignment-sutskever-leike.html), puis l'équipe Mission Alignment qui lui a succédé a été [dissoute à son tour après seulement 16 mois](https://techcrunch.com/2026/02/11/openai-disbands-mission-alignment-team-which-focused-on-safe-and-trustworthy-ai-development/). De nombreux autres chercheurs en sécurité ont quitté OpenAI : [Daniel Kokotajlo](https://fortune.com/2024/08/26/openai-agi-safety-researchers-exodus/) (qui a renoncé à ~2 millions de dollars d'equity plutôt que de signer une clause de non-dénigrement), [Mira Murati](https://www.cnbc.com/2024/09/25/openai-cto-mira-murati-announces-shes-leaving-the-company.html) (CTO), et [Miles Brundage](https://milesbrundage.substack.com/p/why-im-leaving-openai-and-what-im) qui a conclu : « Ni OpenAI ni aucun autre laboratoire de pointe n'est prêt. » En juin 2024, [13 employés actuels et anciens d'OpenAI et Google DeepMind](https://time.com/6985504/openai-google-deepmind-employees-letter/) ont signé une lettre ouverte réclamant un « droit d'alerte », soutenue par Yoshua Bengio, Geoffrey Hinton et Stuart Russell.

**[Google/DeepMind](https://deepmind.google/)** accélère massivement avec sa gamme de modèles [Gemini](https://blog.google/products/gemini/gemini-3/) et a investi [91,4 milliards de dollars en 2025](https://www.cnbc.com/2026/02/04/alphabet-googl-q4-2025-earnings.html), avec des plans pour [175 à 185 milliards en 2026](https://fortune.com/2026/02/04/alphabet-google-ai-spending-supply-constraints/). En avril 2025, Google DeepMind a publié un [article de 145 pages](https://fortune.com/2025/04/04/google-deeepmind-agi-ai-2030-risk-destroy-humanity/) estimant que l'IAG pourrait arriver d'ici 2030 et pourrait « détruire l'humanité de manière permanente ». [Demis Hassabis](https://fr.wikipedia.org/wiki/Demis_Hassabis), le PDG de DeepMind, reconnaît que le risque est [« définitivement non-nul et probablement non-négligeable »](https://www.axios.com/2025/12/05/ai-hassabis-agi-risks-pdoom).

**[Meta](https://ai.meta.com/)** a poursuivi sa stratégie de modèles ouverts ([LLaMA](<https://en.wikipedia.org/wiki/Llama_(language_model)>)) mais a [pivoté vers des modèles fermés fin 2025](https://winbuzzer.com/2025/12/09/meta-pivots-from-llama-to-closed-ai-models-abandoning-open-source-roots-xcxwbn/) avec la création de Meta Superintelligence Labs. En juillet 2025, Zuckerberg [a admis que « développer la superintelligence est désormais en vue »](https://techcrunch.com/2025/07/30/zuckerberg-says-meta-likely-wont-open-source-all-of-its-superintelligence-ai-models/) tout en déclarant que Meta ne publierait pas en open-source ses modèles les plus puissants. Le [Future of Life Institute](https://futureoflife.org/) a attribué à Meta une note de [D sur son index de sécurité existentielle de l'IA](https://fortune.com/2025/12/05/ai-labs-meta-deepseek-xai-bad-grades-existential-safety-index/) — la pire parmi les grands laboratoires américains.

**[xAI](https://x.ai/)** (Elon Musk) accélère de manière agressive : [Grok 3](https://x.ai/blog/grok-3) (février 2025), Grok 4 (juillet 2025), avec un [datacenter « Colossus »](https://x.ai/colossus) de 200 000 GPU et [des plans pour dépasser le million](https://introl.com/blog/xai-colossus-2-gigawatt-expansion-555k-gpus-january-2026). L'ironie est frappante : Musk, qui alertait sur les risques existentiels de l'IA et a cosigné la [lettre ouverte demandant une pause en 2023](https://futureoflife.org/open-letter/pause-giant-ai-experiments/), dirige désormais l'un des acteurs les plus agressifs de la course. xAI a été [intégré à la plateforme GenAI.mil du Département de la Défense américain](https://www.war.gov/News/Releases/Release/Article/4366573/the-war-department-to-expand-ai-arsenal-on-genaimil-with-xai/) début 2026, pour 3 millions de militaires et civils.

**[Anthropic](https://www.anthropic.com/)** reste l'entreprise la plus sérieuse sur la sécurité, avec sa [politique de mise à l'échelle responsable](https://www.anthropic.com/responsible-scaling-policy) et des recherches pionnières comme l'étude sur l'[alignment faking](https://www.anthropic.com/research/alignment-faking). L'entreprise a activé des [protections de niveau ASL-3](https://www.anthropic.com/news/activating-asl3-protections) pour ses modèles les plus puissants. Mais elle développe elle aussi des modèles de plus en plus capables et a été [valorisée à 380 milliards de dollars en février 2026](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation), illustrant le dilemme fondamental : même les acteurs les plus prudents sont pris dans la dynamique de course.

**Les laboratoires chinois** (DeepSeek, Baidu, Alibaba, ByteDance) ont fait des progrès spectaculaires. [DeepSeek-R1](https://en.wikipedia.org/wiki/DeepSeek), publié en [janvier 2025](https://www.technologyreview.com/2025/01/24/1110526/china-deepseek-top-ai-despite-sanctions/), a démontré des performances comparables aux meilleurs modèles américains tout en ayant été [entraîné pour seulement 5,6 millions de dollars](https://www.csis.org/analysis/deepseeks-latest-breakthrough-redefining-ai-race) — contre plus de 100 millions pour GPT-4. Son lancement a provoqué une [chute de 18% de l'action Nvidia](https://www.ibm.com/think/insights/deepseek-breakthrough-is-a-win-for-innovation-and-accessibility), qualifié de « moment Spoutnik » pour l'IA américaine.

Le ratio d'investissement entre capacités et alignement reste d'environ 1 000:1. La course s'accélère et la sécurité reste le parent pauvre.

### Et la Chine ?

La situation a évolué depuis 2023. La Chine avait alors les réglementations les plus strictes au monde en matière d'IA — [chatbots interdits](https://www.reuters.com/technology/chinas-slow-ai-roll-out-points-its-tech-sectors-new-regulatory-reality-2023-07-12/), entraînement sur données internet non autorisé. Depuis, le pays a [assoupli sa position](https://asia.nikkei.com/Business/Technology/China-approves-AI-chatbot-releases-but-will-it-unleash-innovation) pour ne pas freiner son industrie.

L'émergence de [DeepSeek](https://en.wikipedia.org/wiki/DeepSeek) a transformé la dynamique : la Chine a basculé vers une posture de confiance, accélérant les investissements et le déploiement de l'IA dans les infrastructures critiques. DeepSeek a démontré que [les restrictions américaines sur l'exportation de puces n'empêchent pas l'innovation chinoise en IA](https://www.technologyreview.com/2025/01/24/1110526/china-deepseek-top-ai-despite-sanctions/) mais stimulent au contraire des approches plus efficientes.

Pour autant, l'argument du traité international reste valide. La Chine a été le seul pays à mentionner la possibilité d'un moratoire lors de la [réunion du Conseil de sécurité des Nations unies sur l'IA](https://news.un.org/en/story/2023/07/1138947). En 2025, seize entreprises chinoises dont DeepSeek ont signé des engagements sur la sécurité de l'IA, montrant qu'une convergence sur les garde-fous existe.

Nous appelons à un moratoire international, imposé par un traité. Un tel traité doit aussi être signé par la Chine. Si le traité garantit que les autres nations s'arrêteront aussi, avec des mécanismes de contrôle et de mise en vigueur suffisants, la Chine y sera probablement favorable. Cela nécessite toutefois une volonté politique internationale qui reste, pour l'instant, insuffisante face à l'ampleur des [tensions géopolitiques US-Chine](https://www.csis.org/analysis/deepseeks-latest-breakthrough-redefining-ai-race).

### Les entreprises d'IA prétendent-elles que le risque existentiel est réel pour nous manipuler ?

Nous ne pouvons pas être certains des motivations de ces entreprises, et nous savons qu'elles **ne sont pas à l'origine de la mise en avant des risques existentiels liés à l'IA**. Les signaux d'alerte venaient des scientifiques, militants et ONG. Depuis le début des années 2000, des chercheurs comme [Eliezer Yudkowsky](https://en.wikipedia.org/wiki/Eliezer_Yudkowsky), [Nick Bostrom](https://fr.wikipedia.org/wiki/Nick_Bostrom), [Stuart Russell](https://en.wikipedia.org/wiki/Stuart_J._Russell) et [Max Tegmark](https://fr.wikipedia.org/wiki/Max_Tegmark) ont alerté sur ce risque. Ils n'avaient aucun produit à vendre.

Les entreprises n'ont commencé à mentionner les risques existentiels qu'en mai 2023, sous la pression du discours public : [démission de Geoffrey Hinton de Google](https://fortune.com/2023/05/01/godfather-ai-geoffrey-hinton-quit-google-regrets-lifes-work-bad-actors/), [premières manifestations de PauseAI](https://pauseai.info/openai-protest), [déclaration du Centre pour la sécurité de l'IA](https://www.safe.ai/work/statement-on-ai-risk) signée par des employés d'OpenAI, Google et Microsoft.

Mais **les événements depuis 2024 montrent que les incitations commerciales l'emportent sur les préoccupations de sécurité.** OpenAI a [dissous son équipe Superalignment](https://www.cnbc.com/2024/05/17/openai-superalignment-sutskever-leike.html) puis son [équipe Mission Alignment](https://techcrunch.com/2026/02/11/openai-disbands-mission-alignment-team-which-focused-on-safe-and-trustworthy-ai-development/), [achevé sa transition vers le profit](https://openai.com/our-structure/), [retiré le mot « safely » de sa mission](https://theconversation.com/openai-has-deleted-the-word-safely-from-its-mission-and-its-new-structure-is-a-test-for-whether-ai-serves-society-or-shareholders-274467), et [imposé des clauses de non-dénigrement menaçant l'equity des anciens employés](https://www.cnbc.com/2024/05/24/openai-sends-internal-memo-releasing-former-employees-from-non-disparagement-agreements-sam-altman.html). L'entreprise a aussi [activement fait du lobbying contre la loi SB 1047](https://techcrunch.com/2024/08/21/openais-opposition-to-californias-ai-law-makes-no-sense-says-state-senator/) en Californie, qui aurait imposé des tests de sécurité avant le déploiement. Ce ne sont pas les actions d'une entreprise qui prend les risques au sérieux.

Notre interprétation : les entreprises d'IA _savent_ que les risques sont réels (elles emploient des chercheurs en sécurité, elles publient des études sur l'[alignment faking](https://www.anthropic.com/research/alignment-faking)), mais les incitations commerciales et la dynamique de course les poussent à continuer malgré tout. C'est précisément pourquoi une intervention gouvernementale est nécessaire : les acteurs du marché ne peuvent pas résoudre seuls un [problème de coordination](https://en.wikipedia.org/wiki/Tragedy_of_the_commons) de cette ampleur.

[PauseAI Global : en savoir plus sur la charge mentale des risques existentiels](https://pauseai.info/psychology-of-x-risk)

## S'engager

### Qui vous finance ?

Pause IA est une [organisation à but non lucratif enregistrée](/mentions-legales) depuis juin 2024. La professionnalisation de l'association (recrutement d'une directrice exécutive, organisation d'événements comme la conférence au Sénat) a été rendue possible par les dons de nos soutiens. Vous pouvez [faire un don à Pause IA](/dons) si vous souhaitez soutenir notre cause. Nous utilisons l'essentiel de l'argent pour l'organisation d'événements impactants, des campagnes de sensibilisation et le fonctionnement de notre structure.

### Pourquoi manifester ?

- Manifester démontre à tous que cette question nous tient à cœur. En manifestant, nous prouvons que nous sommes prêts à consacrer du temps et de l'énergie à la diffusion de notre message.
- Il n'est pas rare que les manifestations aient une [influence positive](https://www.socialchangelab.org/_files/ugd/503ba4_052959e2ee8d4924934b7efe3916981e.pdf) sur l'opinion publique, le vote, l'attitude des entreprises et la loi.
- [La grande majorité des gens soutiennent](https://today.yougov.com/politics/articles/31718-do-protesters-want-help-or-hurt-america) les manifestations pacifiques et non violentes.
- Il n'y a [aucun « retour de bâton »](https://journals.sagepub.com/doi/full/10.1177/2378023120925949) sauf si la manifestation [dégénère en violences](https://news.stanford.edu/stories/2018/10/how-violent-protest-can-backfire). Nos manifestations sont pacifiques et non violentes.
- C'est une expérience de lien social. Vous rencontrez d'autres personnes qui partagent vos préoccupations et votre volonté d'agir.
- Lisez [cet excellent article](https://forum.effectivealtruism.org/posts/4ez3nvEmozwPwARr9/a-case-for-the-effectiveness-of-protest) pour en savoir plus sur l'efficacité des manifestations.

Les manifestations ne sont cependant qu'un outil parmi d'autres. C'est pourquoi l'association diversifie ses modes d'action : lobbying auprès des décideurs, événements institutionnels comme notre [conférence au Sénat](https://www.smartrezo.com/n31-france/tv-politiques-numeriques-pol-n-colloque-sur-les-dangers-de-l-ia-faut-il-appuyer-sur-pause.html?vod=25808), production de contenu et campagnes de sensibilisation.

### Je veux aider ! Que puis-je faire ?

Il y a de nombreuses choses que [vous pouvez faire](/agir). À titre individuel, sensibilisez votre entourage, [faites un don](/dons) et [rejoignez Pause IA](/rejoindre) pour coordonner vos actions avec tous nos membres. Si vous souhaitez vous impliquer davantage, vous pouvez aussi devenir bénévole.

L'ampleur du défi ne doit pas être minimisée, mais elle ne justifie pas l'inaction. Chaque effort pour infléchir la trajectoire actuelle a une valeur immense, proportionnelle à l'enjeu. Même une contribution marginale à la réduction du risque a une valeur considérable quand l'enjeu est la survie de l'humanité.
