from sentence_transformers import SentenceTransformer
import hdbscan

model = SentenceTransformer("all-mpnet-base-v2")

def compute_embeddings_and_clusters(combined_data: list, min_cluster_size=2) -> list:
    texts = [item["neutral"] for item in combined_data]
    embeddings = model.encode(texts, show_progress_bar=True)

    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=min_cluster_size,
        min_samples=1,
        metric="euclidean"
    )
    labels = clusterer.fit_predict(embeddings)
    probs = clusterer.probabilities_

    # Añadir cluster, probabilidad y el embedding a cada item
    for i, item in enumerate(combined_data):
        item["cluster"] = int(labels[i])
        item["cluster_prob"] = float(probs[i])
        item["embedding"] = embeddings[i].tolist()  # Esta línea es clave

    return combined_data
