#!/usr/bin/env python3
"""Check runtime bytes against the exported live version 1 baseline."""
import hashlib
import json
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'docs/BASELINE.json').read_text())
failures = []
for entry in manifest['runtime_files']:
    path = root / entry['path']
    if not path.is_file():
        failures.append(f"MISSING {entry['path']}")
        continue
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != entry['sha256']:
        failures.append(f"CHANGED {entry['path']}")
    else:
        print(f"PASS {entry['path']}")
for message in failures:
    print(message, file=sys.stderr)
print(f"{len(manifest['runtime_files']) - len(failures)}/{len(manifest['runtime_files'])} runtime files match baseline")
sys.exit(1 if failures else 0)
