from sentence_transformers import SentenceTransformer
from .database import insert_embedding

model = SentenceTransformer("all-MiniLM-L6-v2")

async def generate_and_store_embeddings(client, story_id, texts, types, ids):
    vectors = model.encode(texts)

    for text, tipo, source_id, vector in zip(texts, types, ids, vectors):
        payload = {
            "story_id": story_id,
            "source_table": tipo,
            "source_id": source_id,
            "embedding": vector.tolist()
        }
        response = await insert_embedding(client, payload)
        if response.status_code >= 400:
            print(f"❌ Error al insertar embedding: {response.text}")
