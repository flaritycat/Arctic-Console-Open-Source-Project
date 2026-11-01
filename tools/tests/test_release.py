import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import warnings
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
        with warnings.catch_warnings(), zipfile.ZipFile(data, "w") as archive:
            warnings.filterwarnings("ignore", message="Duplicate name:", category=UserWarning)
            archive.writestr("x", b"1")
            archive.writestr("x", b"2")
        with self.assertRaisesRegex(ValueError, "file list"):
            release.verify_bytes(data.getvalue(), {"x": b"2"})


class SnapshotTests(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        self.git("init", "-q")
        self.config = {"version": "0.2.0", "tag": "arctic-console-v0.2.0",
                       "files": {p: p for p in sorted(release.REQUIRED)}}
        for name in self.config["files"]:
            data = ('<pre id="license-text">terms</pre><pre id="ai-notice-text">terms</pre>'
                    if name.endswith(".html") else "terms")
            (self.root / name).write_bytes(data.encode())
        self.save_manifest()

    def git(self, *args):
        subprocess.run(["git", "-C", str(self.root), "-c", "user.name=Test",
                        "-c", "user.email=fixture@example.invalid", *args],
                       check=True, capture_output=True)

    def save_manifest(self):
        (self.root / "release.json").write_bytes(json.dumps(self.config).encode())
        self.git("add", "-A")
        self.git("commit", "-qm", "fixture", "--no-gpg-sign")

    def test_dirty_tree_refused_even_for_unlisted_file(self):
        _, files = release.snapshot(self.root)
        self.assertEqual(json.loads(files["BUILD.json"])["tag"], self.config["tag"])
        (self.root / "unlisted.txt").write_text("unreviewed")
        with self.assertRaisesRegex(ValueError, "clean checkout"):
            release.snapshot(self.root)

    def test_missing_application_is_rejected(self):
        del self.config["files"]["practice.html"]
        self.save_manifest()
        with self.assertRaisesRegex(ValueError, "missing"):
            release.snapshot(self.root)

    def test_stale_inline_notice_is_rejected(self):
        (self.root / "DISCLAIMER.md").write_bytes(b"revised notice")
        self.save_manifest()
        with self.assertRaisesRegex(ValueError, "stale embedded notice"):
            release.snapshot(self.root)


if __name__ == "__main__":
    unittest.main()
