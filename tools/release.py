"""Deterministic, dependency-free packaging of explicitly listed public files."""
import argparse
import hashlib
import html
import io
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = {"LICENSE", "DISCLAIMER.md", "LICENSING.md", "PRIVACY.md", "AUTHORS.md",
            "THIRD_PARTY.md", "REFERENCES.md", "SECURITY.md", "README.md", "release.json",
            "evidence-check.html"}

def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args], stderr=subprocess.PIPE)

def safe_path(value):
    if not isinstance(value, str) or not value or "\\" in value:
        raise ValueError("Unsafe archive/source path")
    path = PurePosixPath(value)
    if path.is_absolute() or any(p in ("", ".", "..") for p in value.split("/")) or ":" in value:
        raise ValueError("Unsafe archive/source path: " + value)
    return value

def snapshot(root):
    if git(root, "status", "--porcelain", "--untracked-files=all").strip():
        raise ValueError("Commit intended changes first; packaging requires a clean checkout.")
    commit = git(root, "rev-parse", "HEAD").decode().strip()
    config = json.loads(git(root, "show", "HEAD:release.json"))
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", config["version"]):
        raise ValueError("Invalid release version")
    if config["tag"] != "arctic-console-v" + config["version"]:
        raise ValueError("Tag and version differ")
    files = {}
    sources = {}
    for source, target in config["files"].items():
        safe_path(source)
        safe_path(target)
        if target.casefold() in {p.casefold() for p in files} or target == "BUILD.json":
            raise ValueError("Duplicate/reserved package path")
        entry = git(root, "ls-tree", "HEAD", "--", source).decode()
        if not entry.startswith("100644 blob ") and not entry.startswith("100755 blob "):
            raise ValueError("Only tracked regular files can be packaged: " + source)
        files[target] = git(root, "show", "HEAD:" + source)
        sources[target] = source
    if not REQUIRED <= files.keys():
        raise ValueError("Required license, notice or application file missing")
    for name, data in files.items():
        if name.endswith(".html"):
            for element, document in [("license-text", "LICENSE"), ("ai-notice-text", "DISCLAIMER.md")]:
                match = re.search(r'<pre id="' + element + r'">([\s\S]*?)</pre>', data.decode("utf-8"))
                if not match or html.unescape(match[1]) != files[document].decode("utf-8").replace("\r\n", "\n"):
                    raise ValueError("Missing/stale embedded notice: " + name + " / " + document)
    manifest = {"schema_version": 1, "version": config["version"], "tag": config["tag"],
                "source_commit": commit, "files": [
                    {"path": name, "source": sources[name], "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}
                    for name, data in sorted(files.items())]}
    files["BUILD.json"] = (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode()
    return config, files

def archive_bytes(files):
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w", compression=zipfile.ZIP_STORED) as archive:
        for name, data in sorted(files.items()):
            safe_path(name)
            item = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            item.create_system = 3
            item.external_attr = 0o100644 << 16
            item.compress_type = zipfile.ZIP_STORED
            archive.writestr(item, data)
    return stream.getvalue()

def verify_bytes(data, expected):
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)) or set(names) != set(expected):
            raise ValueError("Archive file list differs from the committed release manifest")
        for name in names:
            safe_path(name)
            if archive.read(name) != expected[name]:
                raise ValueError("Archive bytes differ from committed source: " + name)
    if data != archive_bytes(expected):
        raise ValueError("Archive is not the deterministic package for this commit")

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["build", "verify", "site"])
    parser.add_argument("--output", default="dist", help="Build/site output directory")
    parser.add_argument("--archive", help="Downloaded ZIP to verify against this clean checkout")
    args = parser.parse_args()
    config, files = snapshot(ROOT)
    if args.command == "verify":
        if not args.archive:
            parser.error("--archive is required")
        path = Path(args.archive)
        data = path.read_bytes()
        checksum = Path(str(path) + ".sha256").read_text(encoding="ascii").split()
        if len(checksum) != 2 or checksum[1] != path.name or checksum[0] != hashlib.sha256(data).hexdigest():
            raise ValueError("ZIP checksum does not match")
        verify_bytes(data, files)
        print("Verified archive, checksum, committed bytes and manifest for " + config["tag"])
        return
    output = Path(args.output).resolve()
    if not output.is_relative_to(ROOT / "dist"):
        raise ValueError("Output must be inside this checkout's dist directory")
    # Write only named build files; never clear an arbitrary output directory.
    output.mkdir(parents=True, exist_ok=True)
    if args.command == "site":
        for name, data in files.items():
            target = output / name
            if not target.resolve().is_relative_to(output):
                raise ValueError("Output link escapes the distribution directory")
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        (output / "index.html").write_bytes(files["evidence-check.html"])
        for name in ["DISCLAIMER", "LICENSING", "PRIVACY", "AUTHORS", "SECURITY", "REFERENCES", "THIRD_PARTY"]:
            (output / (name + ".txt")).write_bytes(files[name + ".md"])
        (output / "LICENSE.txt").write_bytes(files["LICENSE"])
        print("Prepared hosted files from committed release inputs.")
        return
    data = archive_bytes(files)
    verify_bytes(data, files)
    filename = "arctic-console-" + config["version"] + ".zip"
    (output / filename).write_bytes(data)
    (output / (filename + ".sha256")).write_text(
        hashlib.sha256(data).hexdigest() + "  " + filename + "\n", encoding="ascii", newline="\n")
    print(filename + ": " + str(len(files)) + " verified files; SHA-256 " + hashlib.sha256(data).hexdigest())

if __name__ == "__main__":
    main()
