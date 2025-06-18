# app/services/clustering.py
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import httpx
from app.config import SUPABASE_URL, SUPABASE_KEY
import ast 

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

async def fetch_embeddings(story_id: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/embeddings?story_id=eq.{story_id}&select=embedding,source_table,source_id",
            headers=HEADERS
        )
        return res.json()


def auto_select_k(vectors, max_k=10):
    scores = []
    for k in range(2, min(max_k, len(vectors))):
        kmeans = KMeans(n_clusters=k, n_init="auto", random_state=42)
        labels = kmeans.fit_predict(vectors)
        score = silhouette_score(vectors, labels)
        scores.append((k, score))
    best_k = max(scores, key=lambda x: x[1])[0]
    return best_k

async def cluster_and_update(story_id: str):
    data = await fetch_embeddings(story_id)  # solo embeddings de ese story
    if len(data) < 2:
        print(f"⚠️ No hay suficientes embeddings para agrupar la historia {story_id}")
        return

    vectors = np.array([
        ast.literal_eval(d["embedding"]) if isinstance(d["embedding"], str) else d["embedding"]
        for d in data
        ])
    
    ids_by_table = [(d["source_table"], d["source_id"]) for d in data]

    k = auto_select_k(vectors)
    kmeans = KMeans(n_clusters=k, n_init="auto", random_state=42)
    labels = kmeans.fit_predict(vectors)

    async with httpx.AsyncClient() as client:
        for (table, id_), label in zip(ids_by_table, labels):
            await client.patch(
                f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{id_}",
                json={"cluster": int(label)},  # 👈 conversión necesaria
                headers=HEADERS
                )


