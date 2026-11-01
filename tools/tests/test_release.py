import importlib.util
import io
from pathlib import Path
import unittest
import zipfile

spec = importlib.util.spec_from_file_location("release", Path(__file__).parents[1] / "release.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)

class ReleaseTests(unittest.TestCase):
    def test_deterministic_and_exact(self):
        files = {"LICENSE": b"terms\n", "nested/example.txt": b"hello"}
        data = release.archive_bytes(files)
        self.assertEqual(data, release.archive_bytes(dict(reversed(list(files.items())))))
        release.verify_bytes(data, files)
        with self.assertRaisesRegex(ValueError, "bytes differ"):
            release.verify_bytes(data, {**files, "LICENSE": b"changed"})
        with self.assertRaisesRegex(ValueError, "file list"):
            release.verify_bytes(data, {"LICENSE": b"terms\n"})

    def test_unsafe_paths_rejected(self):
        for path in ["../secret", "/absolute", "C:/secret", "a\\b", "a//b", "./x"]:
            with self.subTest(path=path), self.assertRaises(ValueError):
                release.safe_path(path)

    def test_duplicate_entries_rejected(self):
        data = io.BytesIO()
        with zipfile.ZipFile(data, "w") as archive:
            archive.writestr("x", b"1")
            archive.writestr("x", b"2")
        with self.assertRaisesRegex(ValueError, "file list"):
            release.verify_bytes(data.getvalue(), {"x": b"2"})

if __name__ == "__main__":
    unittest.main()
