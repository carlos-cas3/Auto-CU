from utils.cleaning import clean_user_story 
from app.services.extractor import extract_requirements_and_use_cases, normalize_text
from app.services.parser import parse_requirements, parse_use_cases

def process_user_story(raw_text: str) -> dict:
    # 1. Limpieza
    cleaned = clean_user_story(raw_text)

    # 2. Extracción
    extracted = extract_requirements_and_use_cases(cleaned)
    raw_reqs = extracted["functional_requirements"]
    raw_cases = extracted["use_cases"]

    # 3. Parseo
    rf_list = parse_requirements(raw_reqs)
    cu_list = parse_use_cases(raw_cases)

    # 4. Normalización
    # 4. Normalización con LLM
    for item in rf_list + cu_list:
        item["neutral"] = normalize_text(item["text"])



    return {
        "cleaned_text": cleaned,
        "raw_functional_requirements": raw_reqs,
        "raw_use_cases": raw_cases,
        "parsed_rf": rf_list,
        "parsed_cu": cu_list
    }

""" 

    # 4. Normalización
    for item in rf_list + cu_list:
        item["neutral"] = normalizer.normalize_sentence(item["text"])

    # 5. Embeddings
    for item in rf_list + cu_list:
        item["embedding"] = embeddings.generate_embedding(item["neutral"])

    # 6. Clustering
    all_items = rf_list + cu_list
    clustered_items = clustering.cluster_items(all_items)

    # 7. Generar casos de prueba
    linked_cases = test_generator.link_cu_rf(clustered_items)

    return {
        "rf": rf_list,
        "cu": cu_list,
        "linked_test_cases": linked_cases
    }
"""
    