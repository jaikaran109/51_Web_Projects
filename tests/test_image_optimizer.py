import importlib.util
import tempfile
import struct
from unittest.mock import patch
import unittest
from pathlib import Path

from PIL import Image

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "optimize_images.py"
SPEC = importlib.util.spec_from_file_location("optimize_images", MODULE_PATH)
optimizer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(optimizer)


class ImageOptimizerTests(unittest.TestCase):
    def test_jpeg_is_reduced_without_changing_dimensions(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.jpg"
            Image.effect_noise((512, 512), 80).convert("RGB").save(path, format="JPEG", quality=100, subsampling=0)
            original_size = path.stat().st_size
            result = optimizer.optimize_image(path, quality=75)
            self.assertIsNotNone(result)
            self.assertLess(path.stat().st_size, original_size)
            with Image.open(path) as optimized:
                self.assertEqual(optimized.size, (512, 512))

    def test_dry_run_does_not_modify_image(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.jpg"
            Image.new("RGB", (128, 128), "red").save(path, quality=100)
            original = path.read_bytes()
            optimizer.optimize_image(path, dry_run=True)
            self.assertEqual(path.read_bytes(), original)

    def test_optimizer_output_is_not_reencoded(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.jpg"
            Image.effect_noise((512, 512), 80).convert("RGB").save(path, quality=100)
            self.assertIsNotNone(optimizer.optimize_image(path, quality=75))
            optimized = path.read_bytes()
            self.assertIsNone(optimizer.optimize_image(path, quality=70))
            self.assertEqual(path.read_bytes(), optimized)

    def test_exclusions_are_relative_to_root(self):
        with tempfile.TemporaryDirectory(prefix="build-") as directory:
            root = Path(directory) / "site"
            root.mkdir()
            included = root / "image.jpg"
            excluded = root / "dist" / "image.jpg"
            excluded.parent.mkdir()
            Image.new("RGB", (2, 2), "red").save(included)
            Image.new("RGB", (2, 2), "blue").save(excluded)
            self.assertEqual(list(optimizer.iter_images(root)), [included])

    def test_png_and_webp_preserve_exif_orientation(self):
        with tempfile.TemporaryDirectory() as directory:
            for suffix, image_format in ((".png", "PNG"), (".webp", "WEBP")):
                path = Path(directory) / f"oriented{suffix}"
                exif = Image.Exif()
                exif[274] = 6
                image = Image.new("RGB", (512, 512), "red")
                save_options = {"format": image_format, "exif": exif}
                if image_format == "PNG":
                    save_options["compress_level"] = 0
                else:
                    save_options["quality"] = 100
                image.save(path, **save_options)
                original_size = path.stat().st_size
                result = optimizer.optimize_image(path, quality=70)
                self.assertIsNotNone(result)
                self.assertLess(path.stat().st_size, original_size)
                with Image.open(path) as optimized:
                    self.assertEqual(optimized.getexif().get(274), 6)

    def test_cmyk_jpeg_keeps_its_pixel_mode(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.jpg"
            Image.new("CMYK", (256, 256), (20, 40, 60, 80)).save(path, quality=100)
            optimizer.optimize_image(path, quality=70)
            with Image.open(path) as optimized:
                self.assertEqual(optimized.mode, "CMYK")

    def test_png_preserves_gamma_and_chromaticity_metadata(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "color-profile.png"
            pnginfo = optimizer.PngInfo()
            gamma = 0.45455
            chromaticity = (0.3127, 0.3290, 0.64, 0.33, 0.30, 0.60, 0.15, 0.06)
            pnginfo.add(b"gAMA", struct.pack(">I", round(gamma * 100000)))
            pnginfo.add(b"cHRM", struct.pack(">8I", *(round(value * 100000) for value in chromaticity)))
            image = Image.effect_noise((512, 512), 80).convert("RGB")
            image.save(path, format="PNG", compress_level=0, pnginfo=pnginfo)
            result = optimizer.optimize_image(path)
            self.assertIsNotNone(result)
            with Image.open(path) as optimized:
                self.assertAlmostEqual(optimized.info["gamma"], gamma, places=5)
                for actual, expected in zip(optimized.info["chromaticity"], chromaticity):
                    self.assertAlmostEqual(actual, expected, places=5)

    def test_syntax_error_during_decode_leaves_file_unchanged(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "malformed.png"
            path.write_bytes(b"not a valid image")
            original = path.read_bytes()
            with patch.object(optimizer.Image, "open", side_effect=SyntaxError("malformed image")):
                self.assertIsNone(optimizer.optimize_image(path))
            self.assertEqual(path.read_bytes(), original)

    def test_unsupported_files_are_ignored(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "notes.txt"
            path.write_text("not an image", encoding="utf-8")
            self.assertIsNone(optimizer.optimize_image(path))


if __name__ == "__main__":
    unittest.main()
