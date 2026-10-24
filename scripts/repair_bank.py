"""Fills in pictures the full import could not convert, without downloading the whole media archive.

Usage: python3 scripts/repair_bank.py katalog.xlsx public/bank URL [URL...]

Reads only the needed files from the remote zip archives (HTTP range requests).
"""
import json
import os
import sys
import tempfile

import openpyxl
from remotezip import RemoteZip

from import_bank import convert, norm


def main(xlsx, out_dir, *urls):
    path = os.path.join(out_dir, "questions.json")
    questions = json.load(open(path, encoding="utf-8"))
    rows = list(openpyxl.load_workbook(xlsx, read_only=True)["katalog"].iter_rows(values_only=True))
    head = [norm(h) for h in rows[0]]
    num, med = head.index("Numer pytania"), head.index("Media")
    media_by_id = {norm(r[num]): norm(r[med]) for r in rows[1:] if norm(r[num]) and norm(r[med])}

    todo = {str(q["id"]): q for q in questions if "m" not in q and str(q["id"]) in media_by_id}
    print("questions missing a picture:", len(todo))
    wanted = {media_by_id[i].lower(): i for i in todo}
    fixed = 0
    with tempfile.TemporaryDirectory() as tmp:
        for url in urls:
            with RemoteZip(url) as z:
                for info in z.infolist():
                    name = os.path.basename(info.filename).lower()
                    if name not in wanted:
                        continue
                    qid = wanted.pop(name)
                    src = z.extract(info, tmp)
                    dst = os.path.join(out_dir, "img", f"{qid}.webp")
                    print(f"{qid}: {info.filename} ({info.file_size} B)")
                    if convert(src, dst, verbose=True):
                        todo[qid]["m"] = f"{qid}.webp"
                        fixed += 1
                    os.remove(src)
    print(f"fixed {fixed}, still missing {len(todo) - fixed}, not found in archives {len(wanted)}")
    json.dump(questions, open(path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    main(*sys.argv[1:])
