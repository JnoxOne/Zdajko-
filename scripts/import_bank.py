"""Turns the ministry's question catalogue (xlsx) and media folder into the app's question bank.

Usage: python3 scripts/import_bank.py katalog.xlsx media_dir public/bank

Writes public/bank/questions.json and one .webp picture per question into public/bank/img/.
Photos are resized; for videos the last frame is used, the moment the exam question refers to.
"""
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

import openpyxl

WIDTH = 800


def norm(v):
    return "" if v is None else str(v).strip()


def media_index(root):
    index = {}
    for dirpath, _, files in os.walk(root):
        for f in files:
            index.setdefault(f.lower(), os.path.join(dirpath, f))
    return index


def convert(src, dst):
    if os.path.exists(dst):
        return True
    video = not src.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif"))
    cmd = ["ffmpeg", "-v", "error", "-y"]
    cmd += ["-sseof", "-0.4", "-i", src] if video else ["-i", src]
    cmd += ["-frames:v", "1", "-vf", f"scale='min({WIDTH},iw)':-2", "-c:v", "libwebp", "-quality", "72", dst]
    ok = subprocess.run(cmd, capture_output=True).returncode == 0 and os.path.exists(dst)
    if not ok and video:
        # Very short clips: take the first frame instead.
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", src, "-frames:v", "1", "-vf", f"scale='min({WIDTH},iw)':-2", "-c:v", "libwebp", "-quality", "72", dst]
        ok = subprocess.run(cmd, capture_output=True).returncode == 0 and os.path.exists(dst)
    return ok


def main(xlsx, media_dir, out_dir):
    img_dir = os.path.join(out_dir, "img")
    os.makedirs(img_dir, exist_ok=True)
    index = media_index(media_dir)
    rows = list(openpyxl.load_workbook(xlsx, read_only=True)["katalog"].iter_rows(values_only=True))
    head = [norm(h) for h in rows[0]]
    col = {name: head.index(name) for name in head if name}

    questions, jobs, missing, skipped = [], [], [], 0
    for r in rows[1:]:
        get = lambda name: norm(r[col[name]]) if col[name] < len(r) else ""
        number, correct = get("Numer pytania"), get("Poprawna odp").upper()
        if not number or correct not in ("T", "N", "A", "B", "C"):
            skipped += 1
            continue
        q = {
            "id": int(number),
            "q": get("Pytanie"),
            "ok": correct,
            "p": int(get("Liczba punktów") or 1),
            "c": [c.strip() for c in get("Kategorie").split(",") if c.strip()],
        }
        if correct in ("A", "B", "C"):
            q["o"] = [get("Odpowiedź A"), get("Odpowiedź B"), get("Odpowiedź C")]
        media = get("Media")
        if media:
            src = index.get(media.lower())
            if src:
                q["m"] = f"{number}.webp"
                jobs.append((q, src, os.path.join(img_dir, q["m"])))
            else:
                missing.append(media)
        questions.append(q)

    with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as pool:
        results = list(pool.map(lambda j: convert(j[1], j[2]), jobs))
    failed = 0
    for (q, src, _), ok in zip(jobs, results):
        if not ok:
            failed += 1
            q.pop("m", None)
            print("convert failed:", src)

    questions.sort(key=lambda q: q["id"])
    with open(os.path.join(out_dir, "questions.json"), "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, separators=(",", ":"))
    with_media = sum(1 for q in questions if "m" in q)
    print(f"questions {len(questions)}, with picture {with_media}, media missing {len(missing)}, convert failed {failed}, rows skipped {skipped}")
    for m in missing[:30]:
        print("missing:", m)


if __name__ == "__main__":
    main(*sys.argv[1:4])
