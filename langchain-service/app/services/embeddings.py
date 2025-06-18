from sentence_transformers import SentenceTransformer
from .database import insert_embedding
from app.config import SUPABASE_URL, SUPABASE_KEY
import httpx

model = SentenceTransformer("all-MiniLM-L6-v2")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# Diccionario para normalizar sinónimos
def normalize_text(text: str) -> str:
    synonyms = {
        "crear": "generar",
        "eliminar": "borrar",
        "comprobante": "recibo",
        "usuario": "cliente",
        "cliente": "cliente",  # por si acaso aparece en singular/plural
        "validar": "verificar",
        "iniciar sesión": "autenticar",
        "producto": "item",
        "stock": "inventario"
    }
    for a, b in synonyms.items():
        text = text.replace(a, b)
    return text.strip()

async def fetch_metadata(client, tipo, source_id):
    fields = {
        "functional_requirements": "title,requirement,description",
        "use_cases": "actor,use_case,goal,description"
    }

    if tipo not in fields:
        return None

    res = await client.get(
        f"{SUPABASE_URL}/rest/v1/{tipo}?id=eq.{source_id}&select={fields[tipo]}",
        headers=HEADERS
    )
    if res.status_code >= 400 or not res.json():
        print(f"❌ Error al obtener metadatos para {tipo} con ID {source_id}: {res.text}")
        return None

    return res.json()[0]

async def generate_and_store_embeddings(client, story_id, texts, types, ids):
    for text, tipo, source_id in zip(texts, types, ids):
        metadata = await fetch_metadata(client, tipo, source_id)
        if not metadata:
            continue

        # Unificamos el formato del texto a embebar
        if tipo == "functional_requirements":
            enriched = f"{metadata['title']} {metadata['requirement']} {metadata['description']}"
        elif tipo == "use_cases":
            enriched = f"{metadata['use_case']} {metadata['actor']} {metadata['goal']} {metadata['description']}"
        else:
            enriched = text  # fallback si se agrega un tipo nuevo

        # Normalizamos sinónimos para aumentar coherencia semántica
        enriched = normalize_text(enriched)

        vector = model.encode(enriched).tolist()

        payload = {
            "story_id": story_id,
            "source_table": tipo,
            "source_id": source_id,
            "embedding": vector
        }

        response = await insert_embedding(client, payload)
        if response.status_code >= 400:
            print(f"❌ Error al insertar embedding: {response.text}")
