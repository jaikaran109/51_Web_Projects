#!/usr/bin/env python3
"""Optimize supported raster assets without repeatedly degrading image quality."""
from __future__ import annotations

import argparse
import io
import os
from pathlib import Path

from PIL import Image

SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp"}
EXCLUDED_DIRS = {".git", "node_modules", "dist", "build", ".venv", "venv"}
OPTIMIZER_EXIF_TAG = 0x9286
OPTIMIZER_MARKER = b"ASCII\x00\x00\x00image-optimizer-v1"


def iter_images(root: Path):
    """Yield supported images, excluding only directories inside root."""
    root = root.resolve()
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_FORMATS:
            continue
        if any(part in EXCLUDED_DIRS for part in path.relative_to(root).parts[:-1]):
            continue
        yield path


def _stat_signature(path: Path):
    stat = path.stat()
    return stat.st_dev, stat.st_ino, stat.st_size, stat.st_mtime_ns


def optimize_image(path: Path, quality: int = 82, dry_run: bool = False):
    """Return (original_bytes, optimized_bytes), or None when no savings apply."""
    original_stat = _stat_signature(path)
    original_mode = path.stat().st_mode
    original = path.read_bytes()
    try:
        with Image.open(io.BytesIO(original)) as image:
            if getattr(image, "n_frames", 1) > 1:
                return None
            exif = image.getexif()
            if exif.get(OPTIMIZER_EXIF_TAG) == OPTIMIZER_MARKER:
                return None
            exif[OPTIMIZER_EXIF_TAG] = OPTIMIZER_MARKER
            metadata = {"exif": exif.tobytes()}
            if image.info.get("icc_profile"):
                metadata["icc_profile"] = image.info["icc_profile"]

            output = io.BytesIO()
            if image.format == "JPEG":
                options = {"quality": quality, "optimize": True, "progressive": True}
                options.update(metadata)
                # Keep CMYK pixels paired with their CMYK profile.
                source = image if image.mode in {"L", "RGB", "CMYK"} else image.convert("RGB")
                if source.mode == "RGB" and image.mode not in {"RGB", "L"}:
                    options.pop("icc_profile", None)
                source.save(output, format="JPEG", **options)
            elif image.format == "PNG":
                image.save(output, format="PNG", optimize=True, compress_level=9, **metadata)
            elif image.format == "WEBP":
                image.save(output, format="WEBP", quality=quality, method=6, **metadata)
            else:
                return None
    except (OSError, ValueError, Image.DecompressionBombError):
        return None

    optimized = output.getvalue()
    if len(optimized) >= len(original):
        return None
    if not dry_run:
        temporary = path.with_name(path.name + ".optimized")
        try:
            temporary.write_bytes(optimized)
            os.chmod(temporary, original_mode)
            if _stat_signature(path) != original_stat:
                return None
            temporary.replace(path)
        finally:
            temporary.unlink(missing_ok=True)
    return len(original), len(optimized)


def main():
    parser = argparse.ArgumentParser(description="Optimize repository raster images.")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--quality", type=int, default=82, choices=range(50, 96))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    processed = saved = 0
    for path in iter_images(root):
        result = optimize_image(path, quality=args.quality, dry_run=args.dry_run)
        if result is None:
            continue
        before, after = result
        processed += 1
        saved += before - after
        print(f"{path.relative_to(root)}: {before:,} -> {after:,} bytes")
    action = "Would save" if args.dry_run else "Saved"
    print(f"{action} {saved:,} bytes across {processed} image(s).")


if __name__ == "__main__":
    main()
