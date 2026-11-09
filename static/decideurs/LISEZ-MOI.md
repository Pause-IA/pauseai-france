# Portraits de l'espace décideurs

Les huit portraits de `/fr/ressources-decideurs` viennent de Wikimedia Commons.
Ils sont déjà dans ce dossier, recadrés au carré et réduits à 256 px (ils
s'affichent dans un rond de 3 rem) : 101 Ko au total, contre 2,4 Mo à l'origine.

## Il manque les crédits, et c'est bloquant

Wikimedia retire les métadonnées d'auteur du fichier JPEG : le crédit ne vit pas
dans l'image mais sur la page de description du fichier. Tant que l'auteur et la
licence ne sont pas renseignés dans `src/lib/data/ressources-decideurs.ts`
(table `portraits`), **la page affiche les initiales au lieu de la photo**. Les
licences CC BY et CC BY-SA imposent de créditer, et un crédit inventé ne vaut
pas mieux qu'une absence de crédit.

Une fois les deux champs remplis, la photo s'affiche et la ligne de crédits se
construit toute seule en bas de page.

## Relever les crédits

Sur chaque page de fichier, les champs « Auteur » et « Licence ». Ou, en une
seule requête, l'API de Commons :

```
curl -s 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=File:Geoffrey%20E.%20Hinton,%202024%20Nobel%20Prize%20Laureate%20in%20Physics%20(cropped1).jpg|File:Yoshua%20Bengio%202019%20cropped.jpg|File:Demis%20Hassabis,%202024%20Nobel%20Prize%20Laureate%20in%20Chemistry%20(cropped).jpg|File:Sam%20Altman%20CropEdit%20James%20Tamim.jpg|File:Dario%20Amodei%20at%20TechCrunch%20Disrupt%202023%2002%20(cropped).jpg|File:Bill%20Gates%20-%202023%20-%20P062021-203496%20(cropped).jpg|File:Stuart%20Russell.jpg|File:Max%20Tegmark%202024%20(cropped).jpg' \
  | python3 -c "import json,sys,re
for p in json.load(sys.stdin)['query']['pages'].values():
    m = p['imageinfo'][0]['extmetadata']
    nettoyer = lambda c: re.sub('<[^>]+>', '', m.get(c, {}).get('value', '')).strip()
    print(p['title'], '|', nettoyer('Artist'), '|', nettoyer('LicenseShortName'))"
```

| Fichier               | Page Commons                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `geoffrey-hinton.jpg` | https://commons.wikimedia.org/wiki/File:Geoffrey_E._Hinton,_2024_Nobel_Prize_Laureate_in_Physics_(cropped1).jpg |
| `yoshua-bengio.jpg`   | https://commons.wikimedia.org/wiki/File:Yoshua_Bengio_2019_cropped.jpg                                          |
| `demis-hassabis.jpg`  | https://commons.wikimedia.org/wiki/File:Demis_Hassabis,_2024_Nobel_Prize_Laureate_in_Chemistry_(cropped).jpg    |
| `sam-altman.jpg`      | https://commons.wikimedia.org/wiki/File:Sam_Altman_CropEdit_James_Tamim.jpg                                     |
| `dario-amodei.jpg`    | https://commons.wikimedia.org/wiki/File:Dario_Amodei_at_TechCrunch_Disrupt_2023_02_(cropped).jpg                |
| `bill-gates.jpg`      | https://commons.wikimedia.org/wiki/File:Bill_Gates_-_2023_-_P062021-203496_(cropped).jpg                        |
| `stuart-russell.jpg`  | https://commons.wikimedia.org/wiki/File:Stuart_Russell.jpg                                                      |
| `max-tegmark.jpg`     | https://commons.wikimedia.org/wiki/File:Max_Tegmark_2024_(cropped).jpg                                          |
