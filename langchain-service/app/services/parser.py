import re

def parse_requirements(text: str):
    lines = text.strip().split("\n")
    parsed = []
    for idx, line in enumerate(lines, 1):
        if not line.strip():
            continue
        parsed.append({
            "id": idx,
            "text": line.strip(),
            "type": "RF"
        })
    return parsed

def parse_use_cases(text: str):
    lines = text.strip().split("\n")
    parsed = []
    for idx, line in enumerate(lines, 1):
        if not line.strip():
            continue
        parsed.append({
            "id": idx,
            "text": line.strip(),
            "type": "CU"
        })
    return parsed
