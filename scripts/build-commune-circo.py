#!/usr/bin/env python3
"""
Construit src/lib/data/commune-circo.json : code commune INSEE -> liste des
circonscriptions législatives. Fichier STATIQUE (le découpage des
circonscriptions est inchangé depuis 2012) : à ne régénérer que si le découpage
change. Le générateur Node (generate-elus.js) le lit pour cibler le bon député.

Une commune découpée (grandes villes : Paris, Toulouse, Nantes…) apparaît avec
plusieurs circonscriptions ; toutes sont conservées (la page propose alors les
députés candidats, sans jamais en désigner un faux).

Source : table officielle « correspondance communes / cantons / circonscriptions »
(data.gouv.fr). Nécessite openpyxl (`pip install openpyxl`).

Usage : python3 scripts/build-commune-circo.py
"""
import collections
import io
import json
import os
import urllib.request

import openpyxl

URL = (
    "https://static.data.gouv.fr/resources/circonscriptions-legislatives-table-de-"
    "correspondance-des-communes-et-des-cantons-pour-les-elections-legislatives-de-"
    "2012-et-sa-mise-a-jour-pour-les-elections-legislatives-2017/20170411-141128/"
    "Table_de_correspondance_circo_legislatives2017-1.xlsx"
)
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "data", "commune-circo.json")

# Codes département outre-mer (lettres) → préfixe INSEE des DOM.
DOM = {"ZA": "971", "ZB": "972", "ZC": "973", "ZD": "974", "ZM": "976"}


def insee(dpt, comm):
    if comm is None or dpt is None:
        return None
    comm = str(comm).strip()
    if not comm.isdigit():
        return None
    comm = comm.zfill(3)
    dpt = str(dpt).strip()
    if dpt.isdigit():  # métropole
        return dpt.zfill(2) + comm
    if dpt in ("2A", "2B"):  # Corse
        return dpt + comm
    if dpt in DOM:  # DOM (97x) ; "97" + code commune (3 chiffres) = code INSEE
        return "97" + comm
    return None  # autres collectivités : ignorées (évite toute collision de code)


def main():
    data = urllib.request.urlopen(URL).read()
    ws = openpyxl.load_workbook(io.BytesIO(data), read_only=True).active
    rows = ws.iter_rows(values_only=True)
    next(rows)  # en-tête : CODE DPT, NOM DPT, CODE COMMUNE, NOM COMMUNE, CODE CIRC, ...
    mapping = collections.defaultdict(set)
    for dpt, _nomdpt, codecom, _nomcom, circ, *_rest in rows:
        code = insee(dpt, codecom)
        if not code:
            continue
        try:
            c = int(circ)
        except (TypeError, ValueError):
            continue
        if c > 0:
            mapping[code].add(c)

    out = {k: sorted(v) for k, v in sorted(mapping.items())}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(out)} communes écrites dans {OUT}")
    print(f"  dont {sum(1 for v in out.values() if len(v) > 1)} communes découpées (multi-circo)")


if __name__ == "__main__":
    main()
