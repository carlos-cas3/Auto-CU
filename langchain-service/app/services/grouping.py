from collections import defaultdict

def group_by_cluster_with_original(items_with_clusters: list) -> dict:
    """
    Agrupa por número de clúster y devuelve textos originales.

    items_with_clusters: lista de dicts con:
    - 'type': 'RF' o 'CU'
    - 'original': texto original
    - 'cluster': int
    - 'cluster_prob': float
    """
    grouped = defaultdict(list)

    for item in items_with_clusters:
        grouped[item["cluster"]].append({
            "type": item["type"],
            "original": item["original"],
            "prob": item["cluster_prob"]
        })

    return dict(grouped)
