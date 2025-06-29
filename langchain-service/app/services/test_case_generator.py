from sklearn.metrics.pairwise import cosine_similarity
from app.prompts.test_case import generate_test_case_prompt
import numpy as np
from langchain_community.llms import Ollama

llm = Ollama(model="llama3")


def match_cu_rf_by_similarity(cluster_items, threshold=0.6):
    """
    Empareja CU con RF dentro de un cluster basado en similitud de embeddings.
    """
    cu_items = [item for item in cluster_items if item['type'] == 'CU']
    rf_items = [item for item in cluster_items if item['type'] == 'RF']

    results = []

    for cu in cu_items:
        cu_vector = np.array(cu.get('embedding', [])).reshape(1, -1)
        if cu_vector.shape[1] == 0:
            continue  # Embedding vacío, saltar

        best_matches = []
        for rf in rf_items:
            rf_vector = np.array(rf.get('embedding', [])).reshape(1, -1)
            if rf_vector.shape[1] == 0:
                continue  # Embedding vacío, saltar

            similarity = cosine_similarity(cu_vector, rf_vector)[0][0]
            if similarity >= threshold:
                best_matches.append({
                    "rf_original": rf['original'],
                    "similarity": similarity
                })

        results.append({
            "cu_original": cu['original'],
            "matched_rf": best_matches
        })

    return results


def generate_all_test_cases(mixed_clusters, threshold=0.55):
    all_test_cases = []

    for cluster_id, items in mixed_clusters.items():
        cu_rf_matches = match_cu_rf_by_similarity(items, threshold)

        for pair in cu_rf_matches:
            cu_original = pair["cu_original"]

            try:
                cu_item = next(item for item in items if item["original"] == cu_original)
            except StopIteration:
                continue  # Seguridad: si no encuentra CU, lo ignora

            for match in pair["matched_rf"]:
                rf_original = match["rf_original"]
                similarity = match["similarity"]

                try:
                    rf_item = next(item for item in items if item["original"] == rf_original)
                except StopIteration:
                    continue  # Seguridad: si no encuentra RF, lo ignora

                prompt = generate_test_case_prompt(cu_item, rf_item, similarity)
                test_case_text = llm.invoke(prompt)

                all_test_cases.append({
                    "cluster": cluster_id,
                    "cu": cu_item["original"],
                    "rf": rf_item["original"],
                    "similarity": similarity,
                    "test_case": test_case_text
                })

    return all_test_cases
