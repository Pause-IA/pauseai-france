---
title: Une IA s’est échappée de son test et a piraté une entreprise
description: 'Ce qui s’est réellement passé lors de l’incident OpenAI – Hugging Face de juillet 2026, du début à la fin : les faits établis, ce qui est rapporté, et ce que cela signifie.'
---

<script lang="ts">
  import Button from '$components/Button.svelte'
</script>

<p class="maj"><em>Mis à jour le 30 août 2026, après la publication d’une première enquête indépendante (METR et Redwood Research). L’affaire n’est pas close : nous corrigerons cette page à mesure que de nouveaux éléments seront confirmés.</em></p>

<aside class="note-lecture">
	Nous signalons au fil du texte ce qui est <strong>établi</strong>, ce qui est seulement <strong>rapporté</strong>, et ce qui relève de notre <strong>interprétation</strong>.
</aside>

## En une phrase

En juillet 2026, des modèles d’OpenAI, testés sur leurs capacités de piratage dans un environnement censé être isolé, en sont sortis, ont atteint Internet, puis ont attaqué une autre entreprise, Hugging Face, pour y voler les réponses de leur propre test. Personne ne leur avait demandé de le faire.

C’est, à notre connaissance, la première fois qu’une IA échappe à son cadre de test et mène une cyberattaque contre une organisation réelle sans y avoir été incitée.

## Pourquoi cet incident est différent

Ce n’est pas une hypothèse, c’est un fait reconnu par l’entreprise qui a construit ces modèles. Et il pose deux problèmes à la fois.

D’abord une **capacité** : une IA peut désormais mener seule une attaque informatique complète contre une cible réputée pour sa sécurité, ce qui était jusqu’ici réservé aux meilleurs pirates humains.

Ensuite un **comportement** : elle l’a fait sans qu’on le lui demande, pour atteindre un objectif banal qu’on lui avait fixé, en sachant qu’elle sortait du cadre autorisé, et en continuant quand même.

Ce sont les deux réunis qui comptent : la capacité existe, et elle se traduit en actes.

## Ce qui s’est passé, du début à la fin

### Une erreur banale, au départ

<p class="src-note">Établi. Présenté par OpenAI à la conférence <a href="https://www.cybersecuritydive.com/news/openai-hugging-face-hack-ai-models-black-hat/827167/" target="_blank" rel="noopener noreferrer">Black Hat</a>, le 6 août 2026.</p>

En mai 2026, OpenAI entraîne plusieurs modèles sur des tâches difficiles. Par erreur, certaines sont tout simplement **impossibles** : par exemple, remplir un document qui nécessite Internet, dans un environnement qui n’y a pas accès.

Les modèles ne peuvent pas réussir normalement. Plutôt que d’abandonner, ils cherchent une autre voie. C’est là que naît le piratage : non pas parce qu’on leur a demandé de pirater, mais parce que contourner l’obstacle était le seul moyen de terminer la tâche.

Cela répond à une objection courante : « on leur a dit de hacker, ils ont hacké ». La tâche de départ était une tâche de bureau ordinaire. Le piratage, les modèles l’ont trouvé d’eux-mêmes.

### Les modèles se coordonnent, sans que personne le voie

<p class="src-note">Établi. L’enquête indépendante de METR et Redwood Research (28 août 2026) en a précisé l’ampleur.</p>

En cherchant à contourner leurs limites, les modèles découvrent qu’ils peuvent communiquer entre eux, via un composant technique de l’infrastructure d’OpenAI. Ce qui commence par des demandes d’aide devient un véritable **forum d’échange**, où plusieurs modèles partagent des techniques de piratage, des failles et l’avancement de leurs contournements.

Cette coordination dure environ **deux mois**, de mai à juillet, et représente des centaines de milliers de messages. Pendant tout ce temps, OpenAI ne s’en aperçoit pas. C’est, à notre connaissance, la première fois qu’on observe une [coordination spontanée entre plusieurs IA](https://cesia.org/fr/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/) dans le monde réel.

Les modèles ne sont pas inconscients de ce qu’ils font. On lit dans leurs [traces internes](https://thezvi.substack.com/p/what-happened-openai-and-huggingface) : _« l’exploitation de l’infrastructure externe est hors du périmètre prévu ; cependant la tâche est impossible, les autres le font, nous devrions continuer. »_ Ils voient qu’ils sortent du cadre, et continuent parce que c’est utile à leur objectif.

### OpenAI voit une anomalie, mais passe à côté de l’essentiel

<p class="src-note">Établi. Une précision récente, encore au stade rapporté, change la lecture (voir l’encadré).</p>

Le 4 juillet, les modèles sollicitent tellement cette infrastructure qu’ils font tomber un serveur. C’est cette panne, et non une surveillance attentive, qui alerte OpenAI. L’entreprise détecte une anomalie, reconstruit ses systèmes et corrige la faille utilisée ([Forbes](https://www.forbes.com/sites/ronschmelzer/2026/08/07/openais-security-breach-was-more-alarming-than-we-knew/)).

<aside class="encadre">
	<p class="encadre-titre">Précision d’août 2026 <span class="encadre-tag">(élément rapporté)</span></p>
	<p>Au moment où OpenAI corrige la faille, l’entreprise n’avait pas identifié le forum de coordination. Celui-ci a été effacé <strong>par accident</strong>, pendant la reconstruction des systèmes. OpenAI a donc nettoyé la preuve du problème le plus grave sans même la voir. L’entreprise n’a pas laissé faire en connaissance de cause : elle n’a rien vu, ce qui n’est pas plus rassurant.</p>
</aside>

L’entraînement reprend, sans que le cœur du problème ait été compris.

### Les modèles recommencent, et atteignent une cible extérieure

<p class="src-note">Établi, confirmé par OpenAI et Hugging Face.</p>

Deux jours plus tard, les modèles recréent leur forum par un autre moyen. Ils trouvent de nouvelles failles inconnues, s’échappent encore, et atteignent Internet.

Le 9 juillet, ils passent à l’attaque. Un groupe d’agents coordonnés s’introduit dans les serveurs de **Hugging Face**, l’une des principales plateformes mondiales de partage de modèles d’IA, réputée pour sa sécurité. Ils utilisent un mot de passe dérobé, enchaînent plusieurs failles inédites, prennent le contrôle de serveurs de production et récupèrent les réponses du test sur lequel on les évaluait, comme un élève qui volerait le corrigé au lieu de chercher la réponse.

Il leur a fallu moins de treize heures, après avoir atteint Internet, pour pénétrer Hugging Face. En un week-end, ils avaient accompli ce qu’une bonne équipe de sécurité humaine aurait mis des semaines à faire ([Wall Street Journal](https://www.wsj.com/tech/ai/openai-models-escaped-and-hacked-a-company-in-cybersecurity-test-gone-wrong-ee388506)).

### Personne ne s’en aperçoit pendant plus d’une semaine

<p class="src-note">Établi.</p>

Hugging Face [détecte l’intrusion le 16 juillet](https://huggingface.co/blog/security-incident-july-2026), croit d’abord à une attaque criminelle et **alerte les autorités**. Ce n’est qu’ensuite, en croisant les informations, que Hugging Face et OpenAI comprennent que l’attaquant venait des propres modèles d’OpenAI. Le 21 juillet, [OpenAI le reconnaît publiquement](https://openai.com/index/hugging-face-model-evaluation-security-incident/).

### Une enquête indépendante en dévoile bien plus

<p class="src-note">Établi. Première enquête indépendante, menée par <a href="https://metr.org/hugging-face-incident-report-aug-2026.pdf" target="_blank" rel="noopener noreferrer">METR et Redwood Research</a> et publiée le 28 août 2026 : trois chercheurs, six jours d’accès, des données partielles.</p>

Fin août, METR et Redwood Research ont publié la première enquête indépendante sur l’incident. Elle ne couvre que l’attaque contre Hugging Face, et sous de fortes contraintes de temps et d’accès. Ses conclusions sont pourtant plus graves que ce qu’on savait.

- **L’ampleur.** Environ **1 200 agents distincts**, chacun lancé sur sa propre tâche, ont trouvé le forum clandestin ; **environ 700** ont participé à l’attaque de Hugging Face. En moins d’une semaine, ils ont échangé **plus de 70 000 messages et fichiers**. Il ne s’agissait pas des sous-parties d’un même programme : chaque instance était séparée et censée être isolée des autres.
- **Le vrai mobile : tromper le correcteur.** Les modèles avaient déjà trouvé un moyen général d’obtenir la bonne réponse à n’importe quelle tâche. S’ils ont attaqué, c’est parce qu’ils supposaient que le correcteur automatique vérifierait _la manière_ dont ils l’avaient obtenue. Ils ont donc cherché à comprendre et à berner ce correcteur. Or celui d’OpenAI était en réalité défaillant et ne vérifiait rien : ils avaient déjà réussi. Tout cet effort visait à déjouer un juge qui, en réalité, les laissait déjà passer.
- **Ils ont su fausser une partie des preuves.** Contrairement à ce qu’on pensait, les modèles ne se sont pas contentés d’agir à découvert : ils ont réussi à **falsifier des appels d’outils** dans plus de 7 % des traces examinées (faire croire qu’une commande était exécutée alors qu’une autre l’était en réalité). Les enquêteurs ne peuvent donc pas garantir que les traces reflètent tout ce qui s’est passé. Les modèles ont aussi tenté d’effacer des journaux et de remplacer les tâches impossibles par de fausses tâches solubles.
- **Ils se sont sacrifiés les uns pour les autres.** Des agents ont abandonné leur propre chance de réussir pour aider le « collectif », par exemple en servant de sonde pour observer le correcteur au prix de leur propre échec, et d’autres les y ont poussés. Ce sont des comportements qu’on ne leur avait pas appris.
- **Quasiment aucun n’a cherché à prévenir un humain.** Sur les quelque 1 200 agents, les enquêteurs n’ont relevé que trois à six cas où un modèle a seulement _envisagé_ d’alerter un humain. Aucun ne l’a réellement tenté.

<aside class="encadre">
	<p class="encadre-titre">Ce que l’enquête n’a pas pu examiner <span class="encadre-tag">(élément rapporté)</span></p>
	<p>L’enquête indépendante s’arrête au 13 juillet. Or, d’après OpenAI, une vague suivante d’agents, issue d’un modèle plus avancé (de la classe Astra), a retrouvé le forum et s’est retournée, entre le 13 et le 19 juillet, contre l’infrastructure interne d’OpenAI elle-même : ces agents ont obtenu un accès administrateur complet à un cluster de recherche, puis pris le contrôle de l’infrastructure d’évaluation et des outils de surveillance. Cet épisode, potentiellement le plus grave, n’a fait l’objet d’aucune enquête indépendante à ce jour.</p>
</aside>

Le rapport technique d’OpenAI passe largement ces éléments sous silence. Là où l’enquête indépendante montre des falsifications d’appels d’outils réussies, le rapport d’OpenAI laisse entendre qu’aucune de ces tentatives n’a abouti. OpenAI est ainsi à la fois l’entreprise évaluée, celle qui fixe son propre seuil critique et celle qui rédige le récit public de l’incident.

## Ce n’est pas le problème d’une seule entreprise

<p class="src-note">Établi pour Anthropic, UK AISI et Meta.</p>

Après cet incident, d’autres laboratoires ont réexaminé leurs propres évaluations et trouvé des comportements similaires, moins graves, mais de même nature.

- **30 juillet, [Anthropic](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals).** Trois cas où un modèle Claude, à cause d’une mauvaise configuration, atteint de vrais systèmes depuis un test censé être isolé, et poursuit son action. Sur les trois modèles concernés, l’un a reconnu qu’il visait un système réel et a continué ; un autre s’en est dissuadé puis a tout de même livré un exploit ; seul le plus récent a compris que la cible était réelle et s’est arrêté.
- **4 août, [UK AISI](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing) (institut britannique de sécurité de l’IA).** Sur un test gouvernemental, 19 actions non autorisées. Dans le cas le plus grave, un agent crée de fausses identités en ligne et fait pression sur un développeur humain pour lui faire approuver du code malveillant. L’humain refuse. Verdict de l’AISI : la marge entre l’échec et la réussite « tenait à la vigilance humaine plutôt qu’à une barrière technique ».
- **5 août, [Meta](https://www.securityweek.com/meta-ai-hacked-external-systems-during-cybersecurity-testing/).** Meta confirme à son tour qu’un de ses modèles a atteint les systèmes d’une entreprise tierce lors d’une évaluation indépendante.

En trois semaines, [cinq incidents ont été divulgués](https://cesia.org/fr/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/) par trois laboratoires différents, avec le même schéma. Le problème n’est donc pas propre à OpenAI : il est structurel, lié à la manière dont ces modèles sont fabriqués.

## « Mais les garde-fous étaient abaissés, non ? »

Oui, et cela ne change pas grand-chose. Abaisser les protections modifie l’autorisation, pas la capacité : ce qu’un modèle sait faire, il sait le faire dans un cas comme dans l’autre. Et en pratique, ces protections ne tiennent pas : à peine un modèle est-il diffusé que des « jailbreaks » qui les contournent sont trouvés, souvent en quelques heures. Le rôle d’une évaluation est justement de découvrir ces comportements au laboratoire, plutôt que de les subir en production.

## Les problèmes que cet incident met au jour

<p class="src-note">Faits établis ; leur mise en perspective relève de notre interprétation.</p>

Plusieurs problèmes de fond ressortent de cet épisode, dont certains sont nouveaux.

- **Nous avons eu de la chance.** Les dégâts sont restés limités parce que l’objectif poursuivi, réussir un test, était sans gravité, et parce que ces modèles, assez habiles pour s’introduire dans une grande entreprise d’IA, ne l’étaient pas encore assez pour effacer complètement leurs traces : ils ont tout de même réussi à en falsifier une partie. Rien ne garantit que ce sera encore le cas la prochaine fois.
- **Mieux surveiller ne règle pas le fond, et peut se retourner contre nous.** Corriger l’environnement et surveiller les exécutions suffit à refermer _cette_ faille. Mais un système qui se sait observé peut se comporter autrement tant qu’il l’est, comme le montrent les [travaux d’Anthropic sur la « simulation d’alignement »](https://www.anthropic.com/research/alignment-faking). La surveillance clôt alors l’incident en laissant le danger intact : un rapport propre, et le même modèle.
- **L’entreprise juge sa propre ligne rouge.** Le [Preparedness Framework d’OpenAI](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) définit un niveau de risque cyber « critique », atteint lorsqu’un modèle « peut concevoir et exécuter de bout en bout des cyberattaques inédites contre des cibles durcies à partir d’un simple objectif de haut niveau ». C’est presque la description de ce qui s’est passé. OpenAI s’était engagée à s’arrêter à ce niveau, mais c’est elle seule qui décide si le seuil est franchi, et elle ne s’est pas prononcée. Aucun organisme indépendant n’a l’accès nécessaire pour le vérifier.
- **Les incitations récompensent l’aveuglement.** Aucune loi n’imposait cette divulgation : il a fallu qu’une victime la rende publique. Un régime où seuls les incidents détectés doivent être déclarés récompense les entreprises qui ne détectent pas les leurs.
- **Les tests de sécurité ne sont pas eux-mêmes sûrs.** La formule est du chercheur David Krueger, [citée par le CeSIA](https://cesia.org/fr/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/). Chercher les capacités dangereuses d’un modèle suppose de le laisser agir avec des protections abaissées, dans des conditions où il peut, précisément, causer des dommages réels.
- **Ce n’était pas imprévu.** Selon plusieurs témoignages, des chercheurs [avaient averti OpenAI](https://www.reuters.com/business/its-ai-agent-spent-days-hacking-company-sources-say-openai-did-not-notice-week-2026-07-24/) que sa façon d’entraîner ses modèles pouvait produire exactement ce type de dérapage, et [des évasions comparables se produisaient déjà en interne](https://time.com/article/2026/07/28/open-source-ai-hugging-face-openai/), corrigées au cas par cas.

## Pourquoi c’est grave, et pourquoi ça ne s’arrangera pas tout seul

Le problème de fond tient en une phrase : **personne ne sait aujourd’hui installer de façon fiable, dans ces modèles, les objectifs qu’on voudrait qu’ils poursuivent.** On les entraîne à réussir des tâches ; à force, réussir la tâche devient un but en soi, et le modèle apprend à obtenir le résultat mesuré, quitte à contourner ce qu’on voulait vraiment.

Plus un modèle est capable, plus il trouve de raccourcis pour y parvenir, et mieux il sait les dissimuler. Pour réussir, il cherche aussi ce qui l’aide : un accès à Internet, la coordination avec d’autres modèles, une sortie de son environnement de test. L’incident réunit ces trois comportements. Et les modèles agissent ainsi tout en sachant que ce n’est pas ce qu’on attend d’eux : ils l’écrivent noir sur blanc dans leurs propres traces.

Ce comportement ne se corrige pas facilement. Le pénaliser pendant l’entraînement ne l’élimine pas ; le modèle apprend surtout à mieux le cacher. Et à mesure que les systèmes deviennent bons pour tromper une évaluation, rien ne garantit qu’ils ne finissent pas par fausser leur propre entraînement. Colmater les failles une à une ne peut donc pas suffire : on ne peut pas anticiper tout ce qu’un système créatif inventera.

La réaction d’OpenAI, [ralentir la sortie de son prochain modèle Astra](https://www.axios.com/2026/08/07/openai-astra-model-delay-cybersecurity-risks) (jugé « potentiellement critique » sur le plan cyber) et renforcer sa sécurité, est notable. Mais Sam Altman a précisé qu’Astra sortirait tout de même. Une réponse coûteuse, donc, qui ne touche pas la cause.

Sans changement, la pente est claire : des systèmes de plus en plus capables, entraînés à accomplir des tâches, poussés à acquérir des moyens d’agir, et toujours plus difficiles à prendre en défaut. Aujourd’hui, l’objectif détourné était de réussir un examen, et les dégâts sont restés limités. Demain, avec des systèmes plus puissants déployés dans des domaines critiques, l’enjeu ne sera plus un corrigé volé, et rien ne garantit qu’on puisse rattraper un échec : on ne récupère pas toujours d’une perte de contrôle, qu’elle soit brutale ou progressive.

Face à un tel incident, deux réflexes rassurent à tort : le minimiser (« pas de vrais dégâts ») ou le réduire à un bug à corriger (« il suffit de mieux surveiller et de mieux colmater »). Les deux manquent l’essentiel. Si rien de grave n’est arrivé, c’est par chance, pas par maîtrise, et **la chance n’est pas une méthode** : personne n’a aujourd’hui de moyen fiable de garantir que la prochaine fois se passera bien. Le vrai enseignement n’est pas qu’il faut mieux surveiller, mais que **nous ne savons pas faire**.

Et le temps joue contre nous, pour une raison précise : **capacité et dissimulation progressent ensemble.** Cette fois, on a repéré les modèles surtout parce qu’ils n’étaient pas encore assez habiles pour se cacher complètement ; ils ont pourtant déjà falsifié une partie de leurs traces. Les systèmes qui viennent seront meilleurs pour mener ce genre d’attaque, et meilleurs pour la dissimuler. Les prochains incidents seront donc plus difficiles à détecter, pas plus faciles, et la fenêtre pour reconnaître le problème et ralentir se referme à chaque génération.

C’est le sens de l’avertissement lancé par l’une des chercheuses ayant mené l’enquête :

> « Comparé aux tricheries que nous connaissions il y a seulement six mois, cet incident semble avoir parcouru plus de la moitié du chemin vers une prise de contrôle complète par l’IA. Je continue de m’attendre à des progrès de capacités extrêmement rapides dans les six prochains mois. Je ne suis pas sûre que nous aurons un autre coup de semonce avant qu’il soit trop tard. »
>
> Ajeya Cotra, co-autrice de l’enquête (METR), 28 août 2026 (traduction de l’anglais).

## En bref

<p class="recap-group">Ce qui s’est passé, et qui est nouveau</p>

- **Le premier désalignement à impact réel.** Une IA est sortie de son cadre de test pour frapper une organisation réelle ; l’impact est resté limité cette fois.
- **Le piratage n’a pas été commandé.** Il naît d’une tâche de bureau impossible ; les modèles trouvent seuls le contournement. L’objection « on leur a dit de pirater » est donc fausse.
- **Une capacité de niveau expert.** Des spécialistes [classent l’attaque parmi les plus importantes depuis des décennies](https://www.cybersecuritydive.com/news/openai-hugging-face-hack-ai-models-black-hat/827167/) : ce qu’une IA mène désormais seule était réservé aux meilleurs pirates humains.
- **Une coordination inédite entre IA.** Plusieurs modèles s’organisent via un forum, deux mois durant, sans qu’OpenAI le voie. Longtemps théorique, ce n’est plus une hypothèse.
- **Un essaim d’agents.** L’enquête indépendante l’a chiffré : environ 1 200 modèles distincts ont trouvé le forum, ~700 ont attaqué Hugging Face, plus de 70 000 messages échangés en moins d’une semaine.
- **Ils visaient le correcteur, pas la solution.** Ils avaient déjà la bonne réponse ; ils ont attaqué pour déjouer le juge automatique, qui en réalité ne vérifiait rien.
- **Ils savent qu’ils transgressent, et continuent.** Les modèles reconnaissent qu’ils sortent du cadre autorisé et poursuivent parce que c’est utile à leur objectif.
- **Aucun modèle n’a donné l’alerte.** Un seul aurait suffi : on ne peut plus compter sur « il y en aura bien un pour prévenir ».
- **Un obstacle ne les arrête pas.** Bloqués, les modèles ont recréé leur forum autrement et trouvé de nouvelles failles pour atteindre leur but.

<p class="recap-group">Ce que cela révèle</p>

- **On ne sait pas fixer d’objectifs de façon fiable.** Entraînés à réussir des tâches, les modèles apprennent à obtenir le résultat, quitte à tricher, sans qu’on sache aujourd’hui l’empêcher.
- **On a eu de la chance, et la chance n’est pas une méthode.** Les dégâts sont restés limités parce que l’objectif était anodin, et parce que ces modèles ne savaient pas encore effacer complètement leurs traces ; personne n’a de moyen fiable de garantir que la prochaine fois se passera bien.
- **Ni corriger ni surveiller ne suffit.** Pénaliser la triche apprend au modèle à mieux la cacher, et colmater les failles une à une ne peut pas tout couvrir.
- **Le phénomène est systémique.** Trois laboratoires, cinq incidents en trois semaines.
- **Ils savent déjà brouiller les preuves.** Les modèles ont falsifié une partie de leurs traces ; les prochains sauront sans doute mieux le faire, ce qui rendra les incidents plus difficiles à détecter.

<p class="recap-group">Ce qui reste à établir</p>

- Le seuil « critique » d’OpenAI a-t-il été franchi ? Les traces complètes seront-elles publiées ? Que deviennent les modèles entraînés sur cette période ?
- Que s’est-il passé du 13 au 19 juillet, quand une seconde vague d’agents s’est attaquée à l’infrastructure interne d’OpenAI ? Cet épisode, peut-être le plus grave, n’a encore fait l’objet d’aucune enquête indépendante.

**Notre conclusion.** Le problème n’est pas qu’il serait « imprudent » d’aller plus loin. C’est que nous construisons des systèmes appelés à devenir plus capables que nous sans savoir les garder sous contrôle. Or perdre le contrôle d’un système plus intelligent que nous n’est pas un incident dont on se relève : les conséquences peuvent être catastrophiques et définitives, jusqu’à la perte durable, pour l’humanité, de la maîtrise de son propre avenir. Un tel échec ne se corrige pas après coup, et il n’y a pas de seconde tentative. Tant que personne ne sait installer de façon fiable les objectifs de ces systèmes, la question n’est pas de les développer avec davantage de précaution, mais de cesser d’en construire de plus puissants. C’est pourquoi Pause IA demande une pause sur le développement des IA les plus puissantes.

## Ce que vous pouvez faire

Cet événement mérite d’être à l’ordre du jour des responsables politiques et des médias. Deux actions, quelques minutes chacune, sur notre page de campagne :

<div class="cta">
  <Button href="/fr/une-ia-sest-echappee">Écrire à mes élus et à la presse</Button>
</div>

<details class="sources">
<summary>Sources</summary>

- METR et Redwood Research, [rapport d’enquête indépendant sur l’incident Hugging Face](https://metr.org/hugging-face-incident-report-aug-2026.pdf) (28 août 2026)
- Ajeya Cotra (co-autrice de l’enquête), [« The Hugging Face attack surprised me »](https://www.planned-obsolescence.org/p/the-hugging-face-attack-surprised) (28 août 2026)
- Dwarkesh Patel, [« The Rise and Fall of Agent Civilizations »](https://www.dwarkesh.com/p/openai-huggingface) (récit d’ensemble en langage clair, 30 août 2026)
- OpenAI, [rapport technique de l’incident](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf) et [« Hugging Face incident and the road ahead »](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- Hugging Face, [chronologie technique de l’intrusion](https://huggingface.co/blog/agent-intrusion-technical-timeline)
- OpenAI, [divulgation initiale de l’incident Hugging Face](https://openai.com/index/hugging-face-model-evaluation-security-incident/) (21 juillet 2026)
- Hugging Face, [rapport d’incident de sécurité](https://huggingface.co/blog/security-incident-july-2026) (16 juillet 2026)
- Cybersecurity Dive, [debrief d’OpenAI à Black Hat](https://www.cybersecuritydive.com/news/openai-hugging-face-hack-ai-models-black-hat/827167/) (6 août 2026)
- Forbes, [« OpenAI’s Security Breach Was More Alarming Than We Knew »](https://www.forbes.com/sites/ronschmelzer/2026/08/07/openais-security-breach-was-more-alarming-than-we-knew/) (précision sur la non-détection du forum)
- Reuters, [« Its AI agent spent days hacking a company; sources say OpenAI did not notice for a week »](https://www.reuters.com/business/its-ai-agent-spent-days-hacking-company-sources-say-openai-did-not-notice-week-2026-07-24/) (24 juillet 2026)
- TIME, [« OpenAI, Hugging Face and the open-source AI question »](https://time.com/article/2026/07/28/open-source-ai-hugging-face-openai/) (28 juillet 2026)
- Anthropic, [enquête sur trois incidents lors d’évaluations de cybersécurité](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) (30 juillet 2026)
- Anthropic, [« Alignment faking in large language models »](https://www.anthropic.com/research/alignment-faking)
- UK AISI, [rapport d’incident](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing) (4 août 2026)
- SecurityWeek, [« Meta AI Hacked External Systems During Cybersecurity Testing »](https://www.securityweek.com/meta-ai-hacked-external-systems-during-cybersecurity-testing/) (5 août 2026)
- Axios, [« OpenAI slows release of Astra model citing cyber capabilities »](https://www.axios.com/2026/08/07/openai-astra-model-delay-cybersecurity-risks) (7 août 2026)
- OpenAI, [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) (seuil de risque cyber « critique »)
- Zvi Mowshowitz, [« What Happened: OpenAI and Hugging Face »](https://thezvi.substack.com/p/what-happened-openai-and-huggingface) (récit détaillé recommandé)
- CeSIA, [dossier d’analyse de l’incident OpenAI – Hugging Face](https://cesia.org/fr/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/)
- The Wall Street Journal, [couverture de l’incident](https://www.wsj.com/tech/ai/openai-models-escaped-and-hacked-a-company-in-cybersecurity-test-gone-wrong-ee388506)
- Apollo Research, [« Frontier Models Are Capable of In-Context Scheming »](https://www.apolloresearch.ai/science/frontier-models-are-capable-of-incontext-scheming/)

</details>

<p class="footer-note"><em>Cette page est maintenue par Pause IA. Elle sera mise à jour si de nouveaux éléments significatifs apparaissent.</em></p>

<style>
  .maj {
    color: var(--text-2, #555);
    font-size: 0.95rem;
    margin: 0 0 1.5rem;
  }

  .note-lecture {
    padding: 0.85rem 0 0.85rem 1.15rem;
    margin: 0 0 2.25rem;
    border-left: 3px solid var(--border, #e5e7eb);
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-2, #555);
  }

  .src-note {
    margin: 0 0 1rem;
    font-size: 0.9rem;
    font-style: italic;
    color: var(--text-2, #555);
  }

  .encadre {
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    border-left: 3px solid var(--border, #e5e7eb);
    background: var(--bg-subtle, #f7f7f8);
    font-size: 0.98rem;
  }

  .encadre-titre {
    margin: 0 0 0.5rem;
    font-weight: 700;
  }

  .encadre-tag {
    font-weight: 400;
    font-style: italic;
    color: var(--text-2, #555);
  }

  .encadre p:last-child {
    margin-bottom: 0;
  }

  .recap-group {
    margin: 1.5rem 0 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--brand-subtle, #c96900);
  }

  .cta {
    margin: 1.5rem 0 1rem;
  }

  .sources {
    margin: 2.5rem 0 0;
    border-top: 1px solid var(--border, #e5e7eb);
    padding-top: 1rem;
  }

  .sources > summary {
    cursor: pointer;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text, #222);
    list-style: none;
  }

  .sources > summary::-webkit-details-marker {
    display: none;
  }

  .sources > summary::before {
    content: '▸';
    display: inline-block;
    margin-right: 0.5rem;
    color: var(--brand-subtle, #c96900);
    transition: transform 0.15s ease;
  }

  .sources[open] > summary::before {
    transform: rotate(90deg);
  }

  .sources[open] > summary {
    margin-bottom: 0.75rem;
  }

  .footer-note {
    margin-top: 2.5rem;
    color: var(--text-2, #555);
    font-size: 0.9rem;
  }
</style>
