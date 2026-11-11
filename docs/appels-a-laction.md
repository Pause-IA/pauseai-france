# Appels à l'action : état des lieux et règles

Inventaire des boutons du site au 09/11/2026, puis les règles qu'on en tire.
Demande de l'équipe com (« Revérifier tous les CtA et se donner des règles »).

## Ce qu'on a trouvé

### 1. Une même action porte trois noms

| Action                  | Libellés en usage                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Rejoindre l'association | « Rejoignez-nous », « Nous rejoindre », « Rejoindre », « Rejoindre la communauté » |
| Faire un don            | « Faire un don », « Donner » (bandeau de navigation)                               |
| Lire un guide           | « Lire maintenant », « Accéder au guide », « Découvrir le guide complet »          |

Le visiteur ne sait pas si « Nous rejoindre » et « Rejoindre la communauté »
mènent au même endroit. Ils mènent à deux endroits différents : la page
Rejoindre pour l'un, le serveur Discord pour l'autre. Rien ne le dit.

### 2. Quatre boutons identiques sur la page d'accueil

La section « risques » affiche quatre fois « En apprendre davantage », vers
quatre pages différentes. Hors de leur contexte visuel, ces quatre liens sont
indiscernables : c'est le cas d'école du libellé qui n'informe pas, et une
personne qui navigue au lecteur d'écran, lequel peut lister les liens d'une
page, entend quatre fois la même chose.

### 3. L'accueil cumule onze boutons

Onze dans le corps de la page, plus les deux permanents du bandeau (« Donner »,
« Rejoindre »), présents sur toutes les pages. Treize sollicitations sur un
seul écran de visite.

### 4. Ce qui va bien

Le composant `Button` applique déjà tout seul l'ouverture dans un nouvel onglet
et `rel="noopener noreferrer"` pour les liens externes : ce n'est plus à écrire
page par page, et onze appels qui l'oubliaient sont couverts.

## Les règles proposées

1. **Un libellé nomme l'action et son objet.** Verbe + complément :
   « Signer l'appel », « Voir les groupes locaux », « Lire le guide ».
   Jamais « En savoir plus » ni « En apprendre davantage » seuls. Un libellé
   doit rester compréhensible sorti de la page, parce qu'il l'est souvent :
   liste de liens d'un lecteur d'écran, aperçu de partage, résultat de
   recherche.

2. **Une même action s'écrit toujours pareil**, d'un bout à l'autre du site :

   | Destination                  | Libellé retenu           |
   | ---------------------------- | ------------------------ |
   | `/{lang}/rejoindre`          | Rejoindre Pause IA       |
   | `/{lang}/dons`               | Faire un don             |
   | `/{lang}/declaration`        | Signer l'appel           |
   | `/{lang}/groupes-locaux`     | Voir les groupes locaux  |
   | `/{lang}/agir`               | Toutes les façons d'agir |
   | Serveur Discord              | Rejoindre le Discord     |
   | Groupe WhatsApp Pause Action | Rejoindre Pause Action   |

   « Donner », dans le bandeau, reste court faute de place : c'est la seule
   exception, et elle est constante.

3. **Une action dominante par section.** S'il en faut une seconde, elle passe
   en `alt` (bouton secondaire). Jamais plus de deux côte à côte : deux boutons
   de même poids ne hiérarchisent rien et partagent l'attention.

4. **Ne pas redire dans la page ce que le bandeau propose déjà.** « Donner » et
   « Rejoindre » y sont en permanence. Les remettre dans le corps d'une page ne
   se justifie que si c'est l'objet même de la page.

5. **Un bouton qui fait défiler la page plutôt que d'y mener** n'est acceptable
   que si sa cible est sur la même page et qu'il la nomme. « Passer à l'action »
   qui descend de huit cents pixels sans dire où ne remplit aucune des deux
   conditions.

6. **Les liens externes** : rien à écrire, `Button` et les liens des fichiers
   Markdown s'en chargent (nouvel onglet, `rel` de protection).

## Liens vers des contenus en anglais

Un lien qui mène vers une page en anglais est suivi de « (en anglais) », en
petit. Du texte et non une icône : il est lu par les lecteurs d'écran et se
comprend sans légende. Le marqueur ne s'affiche pas sur le site anglais.

La liste des domaines concernés est tenue à la main dans
`src/lib/liensAnglais.ts`, et volontairement : deviner la langue d'une page
sans l'avoir chargée est impossible, et se tromper décrédibilise le
signalement. Un site bilingue (ONU, UNESCO, CeSIA) n'y figure donc pas. Pour
ajouter un domaine, vérifier qu'il n'a pas de version française et l'ajouter à
la liste ; les tests (`tests/liensAnglais.test.ts`) vérifient la forme des
entrées.

Au 09/11/2026, 36 liens des pages françaises sont signalés, surtout vers
arxiv.org, anthropic.com, openai.com et futureoflife.org.

## Contenus dupliqués : rien à faire

L'équipe com demandait aussi de supprimer les contenus répétés d'une page à
l'autre. Recherche faite sur toutes les pages françaises, en comparant les
phrases de plus de soixante caractères : **trois répétitions seulement**, et
chacune se défend.

- Les deux demandes de la campagne « perte de contrôle » reparaissent dans
  l'article du 17 septembre, qui les cite. C'est une citation, pas un doublon.
- La phrase sur l'indépendance des donateurs figure dans la FAQ et sur la page
  Financements. La FAQ y répond en trois lignes puis renvoie vers la page
  détaillée : c'est le fonctionnement attendu d'une FAQ, et la remplacer par un
  simple lien laisserait la question sans réponse.

Le ménage avait déjà été fait en amont : « Qui sommes-nous » ne recopie plus
les dix valeurs ni le positionnement, et « Que demandons-nous » a vu son détail
partir sur sa propre page.

## À corriger, par ordre d'utilité

1. Les quatre « En apprendre davantage » de l'accueil (point 2 ci-dessus).
2. Harmoniser les libellés de « rejoindre » selon le tableau de la règle 2.
3. Les trois verbes pour deux guides, sur « Convaincre autour de vous ».
4. Décider du sort du bouton de la bannière d'accueil (règle 5), avec la com.

Ces quatre points touchent à la rédaction : ils sont listés ici, pas appliqués.
