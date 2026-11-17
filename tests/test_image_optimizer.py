import importlib.util
import tempfile
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
            Image.effect_noise((512, 512), 80).convert("RGB").save(
                path, format="JPEG", quality=100, subsampling=0
            )
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

    def test_unsupported_files_are_ignored(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "notes.txt"
            path.write_text("not an image", encoding="utf-8")

            self.assertIsNone(optimizer.optimize_image(path))


if __name__ == "__main__":
    unittest.main()
