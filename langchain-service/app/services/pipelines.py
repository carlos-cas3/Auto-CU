from utils.cleaning import clean_user_story 
from app.services.extractor import extract_requirements_and_use_cases, normalize_and_validate
from app.services.parser import parse_requirements, parse_use_cases
from app.services.embeddings import compute_embeddings_and_clusters
from app.services.grouping import group_by_cluster_with_original
import time

def process_user_story(raw_text: str, verbose: bool = True) -> dict:
    start = time.time()

    # 1. Limpieza
    cleaned = clean_user_story(raw_text)

    # 2. Extracción IA
    extracted = extract_requirements_and_use_cases(cleaned)
    raw_reqs = extracted["functional_requirements"]
    raw_cases = extracted["use_cases"]

    # 3. Parseo
    rf_list = parse_requirements(raw_reqs)
    cu_list = parse_use_cases(raw_cases)

    # 4. Normalización + Validación
    valid_rf, invalid_rf = [], []
    for item in rf_list:
        neutral, validation = normalize_and_validate(item["text"], "RF")
        result = {
            "original": item["text"],
            "neutral": neutral,
            "validation": validation
        }
        if validation["valid"]:
            valid_rf.append(result)
        else:
            invalid_rf.append(result)

    valid_cu, invalid_cu = [], []
    for item in cu_list:
        neutral, validation = normalize_and_validate(item["text"], "CU")
        result = {
            "original": item["text"],
            "neutral": neutral,
            "validation": validation
            }
        if validation["valid"]:
            valid_cu.append(result)
        else:
            invalid_cu.append(result)

    # 5. Embedding + Clustering
    combined = []
    for item in valid_rf:
        combined.append({
            "type": "RF",
            "original": item["original"],
            "neutral": item["neutral"]
        })
    for item in valid_cu:
        combined.append({
            "type": "CU",
            "original": item["original"],
            "neutral": item["neutral"]
        })

    embedded = compute_embeddings_and_clusters(combined)
    grouped_clusters = group_by_cluster_with_original(embedded)

    return {
        "cleaned_text": cleaned,
        "parsed_rf": rf_list,
        "parsed_cu": cu_list,
        "valid_rf": valid_rf,
        "invalid_rf": invalid_rf,
        "valid_cu": valid_cu,
        "invalid_cu": invalid_cu,
        "embedded": embedded,
        "grouped_clusters": grouped_clusters
        }