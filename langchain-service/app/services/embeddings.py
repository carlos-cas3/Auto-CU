from sentence_transformers import SentenceTransformer
import hdbscan

model = SentenceTransformer("all-mpnet-base-v2")

def compute_embeddings_and_clusters(combined_data: list, min_cluster_size=2) -> list:
    texts = [item["neutral"] for item in combined_data]
    
    # 🧠 No intentar clustering si hay menos de 2 elementos
    if len(texts) < 2:
        print(f"⚠️ Solo hay {len(texts)} ítems. Se omite clustering.")
        embeddings = model.encode(texts, show_progress_bar=False)
        for i, item in enumerate(combined_data):
            item["cluster"] = -1
            item["cluster_prob"] = 0.0
            item["embedding"] = embeddings[i].tolist()
        return combined_data

    # Caso normal: sí aplicar clustering
    embeddings = model.encode(texts, show_progress_bar=True)

    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=min_cluster_size,
        min_samples=1,
        metric="euclidean"
    )

    try:
        labels = clusterer.fit_predict(embeddings)
        probs = clusterer.probabilities_
    except ValueError as e:
        print("❌ Error en clustering:", e)
        # fallback a no clustering
        labels = [-1] * len(texts)
        probs = [0.0] * len(texts)

    for i, item in enumerate(combined_data):
        item["cluster"] = int(labels[i])
        item["cluster_prob"] = float(probs[i])
        item["embedding"] = embeddings[i].tolist()

    return combined_data
