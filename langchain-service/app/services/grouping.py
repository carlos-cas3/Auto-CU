from collections import defaultdict

def group_by_cluster_with_original(items_with_clusters: list) -> dict:
    grouped = defaultdict(list)
    for item in items_with_clusters:
        grouped[item["cluster"]].append({
            "type": item["type"],
            "original": item["original"],
            "neutral": item["neutral"],
            "embedding": item.get("embedding", []),
            "cluster_prob": item["cluster_prob"]
        })
    return dict(grouped)