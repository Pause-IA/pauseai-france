# Portraits de l'espace décideurs

Les huit portraits de `/fr/ressources-decideurs` viennent de Wikimedia Commons.
Déposer ici les fichiers, en `.jpg`, carrés ou presque, recadrés sur le visage,
largeur 320 px suffit (ils sont affichés à 3 rem) :

| Fichier               | Page Commons                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `geoffrey-hinton.jpg` | https://commons.wikimedia.org/wiki/File:Geoffrey_E._Hinton,_2024_Nobel_Prize_Laureate_in_Physics_(cropped1).jpg |
| `yoshua-bengio.jpg`   | https://commons.wikimedia.org/wiki/File:Yoshua_Bengio_2019_cropped.jpg                                          |
| `demis-hassabis.jpg`  | https://commons.wikimedia.org/wiki/File:Demis_Hassabis,_2024_Nobel_Prize_Laureate_in_Chemistry_(cropped).jpg    |
| `sam-altman.jpg`      | https://commons.wikimedia.org/wiki/File:Sam_Altman_CropEdit_James_Tamim.jpg                                     |
| `dario-amodei.jpg`    | https://commons.wikimedia.org/wiki/File:Dario_Amodei_in_2023_(cropped).jpg                                      |
| `bill-gates.jpg`      | https://commons.wikimedia.org/wiki/File:Bill_Gates_-_2023_-_P062021-203496_(cropped).jpg                        |
| `stuart-russell.jpg`  | https://commons.wikimedia.org/wiki/File:Stuart_Russell.jpg                                                      |
| `ilya-sutskever.jpg`  | https://commons.wikimedia.org/wiki/File:Ilya_Sutskever_and_Sam_Altman_in_TAU_(cropped).jpg                      |

Déposer les fichiers ne suffit pas : il faut aussi remplir le bloc `portrait`
de la personne dans `src/lib/data/ressources-decideurs.ts`, avec le nom de
l'auteur et la licence **relevés sur la page du fichier** (champs « Author » et
« Licensing »). Sans ces deux informations, la photo ne doit pas être publiée :
les licences CC BY et CC BY-SA imposent de créditer.

Tant qu'une personne n'a pas de bloc `portrait`, la page affiche ses initiales.
Les crédits se construisent tout seuls, en bas de page, à partir des portraits
renseignés.
