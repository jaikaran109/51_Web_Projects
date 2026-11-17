#!/usr/bin/env python3
"""Losslessly or perceptually optimize raster assets in this repository.

Install the optional dependency with:
    python -m pip install -r scripts/requirements-image-optimization.txt

Run from the repository root:
    python scripts/optimize_images.py
Preview the potential savings without changing files:
    python scripts/optimize_images.py --dry-run
"""

from __future__ import annotations

import argparse
import io
import os
from pathlib import Path

from PIL import Image

SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp"}
EXCLUDED_DIRS = {".git", "node_modules", "dist", "build", ".venv", "venv"}


def iter_images(root: Path):
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_FORMATS:
            continue
        if any(part in EXCLUDED_DIRS for part in path.parts):
            continue
        yield path


def optimize_image(path: Path, quality: int = 82, dry_run: bool = False):
    """Return (original_bytes, optimized_bytes), or None when no savings apply."""
    original = path.read_bytes()
    try:
        with Image.open(io.BytesIO(original)) as image:
            if getattr(image, "n_frames", 1) > 1:
                return None

            output = io.BytesIO()
            image_format = image.format
            if image_format == "JPEG":
                options = {
                    "quality": quality,
                    "optimize": True,
                    "progressive": True,
                }
                if image.info.get("exif"):
                    options["exif"] = image.info["exif"]
                if image.info.get("icc_profile"):
                    options["icc_profile"] = image.info["icc_profile"]
                image.convert("RGB").save(output, format="JPEG", **options)
            elif image_format == "PNG":
                image.save(output, format="PNG", optimize=True, compress_level=9)
            elif image_format == "WEBP":
                image.save(output, format="WEBP", quality=quality, method=6)
            else:
                return None
    except (OSError, ValueError):
        return None

    optimized = output.getvalue()
    if len(optimized) >= len(original):
        return None

    if not dry_run:
        mode = path.stat().st_mode
        temporary = path.with_name(path.name + ".optimized")
        temporary.write_bytes(optimized)
        os.chmod(temporary, mode)
        temporary.replace(path)

    return len(original), len(optimized)


def main():
    parser = argparse.ArgumentParser(description="Optimize repository raster images.")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--quality", type=int, default=82, choices=range(50, 96))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    processed = 0
    saved = 0
    for path in iter_images(args.root.resolve()):
        result = optimize_image(path, quality=args.quality, dry_run=args.dry_run)
        if result is None:
            continue
        before, after = result
        processed += 1
        saved += before - after
        print(f"{path.relative_to(args.root.resolve())}: {before:,} -> {after:,} bytes")

    action = "Would save" if args.dry_run else "Saved"
    print(f"{action} {saved:,} bytes across {processed} image(s).")


if __name__ == "__main__":
    main()
