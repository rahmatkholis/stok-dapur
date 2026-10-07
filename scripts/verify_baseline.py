import hashlib
import json
from pathlib import Path
import sys

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'docs/BASELINE.json').read_text())
errors=[]
for entry in manifest['runtime_files']:
    path=root/'baseline/v1'/entry['path'].removeprefix('dist/')
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=entry['sha256']:
        errors.append(entry['path'])
print(f"{len(manifest['runtime_files'])-len(errors)}/{len(manifest['runtime_files'])} baseline files intact")
legacy=json.loads((root/'docs/LEGACY-PROVENANCE.json').read_text())
for entry in legacy['retained_text_sources']:
    path=root/entry['path']
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=entry['sha256']:
        errors.append(entry['path'])
print(f"Original ZIP source references checked: {len(legacy['retained_text_sources'])}")
for error in errors:print('CHANGED',error)
sys.exit(1 if errors else 0)
