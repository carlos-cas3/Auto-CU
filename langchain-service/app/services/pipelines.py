import mlflow
import logging
import time
import json
import os

from utils.cleaning import clean_user_story
from app.services.extractor import extract_requirements_and_use_cases, normalize_and_validate
from app.services.parser import parse_requirements, parse_use_cases
from app.services.embeddings import compute_embeddings_and_clusters
from app.services.grouping import group_by_cluster_with_original
from app.services.test_case_generator import generate_all_test_cases
from app.optimizer.genetic_test_case_selector import optimize_test_cases

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def process_user_story(raw_text: str, verbose: bool = True) -> dict:
    start = time.time()
    mlflow.set_tracking_uri("http://127.0.0.1:5000")   # Asegura que apunte a tu servidor MLflow
    mlflow.set_experiment("UserStoryAnalysis")         # Nombre del experimento

    # 🔹 Iniciamos un experimento en MLflow
    with mlflow.start_run(run_name="process_user_story"):
        mlflow.log_param("input_length", len(raw_text))
        mlflow.log_param("input_preview", raw_text[:100])  # primeros 100 chars
        

        # 1. Limpieza
        logging.info("🔧 [pipelines.py] Iniciando limpieza de texto...")
        cleaned = clean_user_story(raw_text)

        # 2. Extracción IA
        extracted = extract_requirements_and_use_cases(cleaned)
        raw_reqs = extracted["functional_requirements"]
        raw_cases = extracted["use_cases"]

        mlflow.log_metric("num_raw_requirements", len(raw_reqs))
        mlflow.log_metric("num_raw_use_cases", len(raw_cases))

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

        mlflow.log_metric("valid_rf", len(valid_rf))
        mlflow.log_metric("invalid_rf", len(invalid_rf))
        mlflow.log_metric("valid_cu", len(valid_cu))
        mlflow.log_metric("invalid_cu", len(invalid_cu))

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

        if not combined:
            mlflow.log_param("status", "no_valid_items")
            return {
                "cleaned_text": cleaned,
                "parsed_rf": rf_list,
                "parsed_cu": cu_list,
                "valid_rf": valid_rf,
                "invalid_rf": invalid_rf,
                "valid_cu": valid_cu,
                "invalid_cu": invalid_cu,
                "embedded": [],
                "grouped_clusters": {},
                "mixed_clusters": {},
                "test_cases": []
            }

        embedded = compute_embeddings_and_clusters(combined)
        grouped_clusters = group_by_cluster_with_original(embedded)

        # 6. Agrupación de Clusters Mixtos
        mixed_clusters = {}
        for cluster_id, items in grouped_clusters.items():
            types_in_cluster = set(item['type'] for item in items)
            if 'CU' in types_in_cluster and 'RF' in types_in_cluster:
                mixed_clusters[cluster_id] = items

        mlflow.log_metric("num_clusters", len(grouped_clusters))
        mlflow.log_metric("mixed_clusters", len(mixed_clusters))

        # 7. Generar Casos de Prueba con IA
        test_cases = generate_all_test_cases(mixed_clusters, threshold=0.4)

        # 8. Optimización con algoritmo genético
        test_cases = optimize_test_cases(test_cases)

        # 9. Filtrar casos sin CU o RF
        test_cases = [tc for tc in test_cases if tc.get("cu") and tc.get("rf")]

        mlflow.log_metric("final_test_cases", len(test_cases))

        # 🔹 Guardamos los test cases como artefacto
        os.makedirs("outputs", exist_ok=True)
        output_path = "outputs/test_cases.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(test_cases, f, ensure_ascii=False, indent=2)

        mlflow.log_artifact(output_path)

        end = time.time()
        mlflow.log_metric("execution_time_sec", end - start)

        return {
            "cleaned_text": cleaned,
            "parsed_rf": rf_list,
            "parsed_cu": cu_list,
            "valid_rf": valid_rf,
            "invalid_rf": invalid_rf,
            "valid_cu": valid_cu,
            "invalid_cu": invalid_cu,
            "embedded": embedded,
            "grouped_clusters": grouped_clusters,
            "mixed_clusters": mixed_clusters,
            "test_cases": test_cases
        }
