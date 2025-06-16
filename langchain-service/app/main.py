# app/main.py
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.schemas import DocumentInput, ExtractionOutput
from app.services.extractor import extract_from_text

from sentence_transformers import SentenceTransformer
import httpx

# Cargar variables de entorno
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

app = FastAPI()

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Las variables SUPABASE_URL o SUPABASE_KEY no están definidas en el entorno.")

@app.post("/analyze", response_model=ExtractionOutput)
async def analyze_document(data: DocumentInput):
    # Paso 1: Extraer requisitos y casos de uso usando LLM
    output = await extract_from_text(data.content, data.story_id)
    
    # Paso 2: Generar embeddings
    model = SentenceTransformer("all-MiniLM-L6-v2")

    textos = []
    tipos = []

    for req in output.functional_requirements:
        textos.append(req)
        tipos.append("requirement")

    for cu in output.use_cases:
        textos.append(cu)
        tipos.append("use_case")

    embeddings = model.encode(textos)

    # Paso 3: Enviar embeddings a Supabase
    async with httpx.AsyncClient() as client:
        for text, tipo, vector in zip(textos, tipos, embeddings):
            payload = {
                "story_id": data.story_id,
                "type": tipo,
                "text": text,
                "embedding": vector.tolist()
            }
            response = await client.post(
                f"{SUPABASE_URL}/rest/v1/embeddings",
                json=payload,
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                }
            )
            if response.status_code >= 400:
                print(f"❌ Error al subir embedding: {response.text}")

    return output


@app.get("/")
async def root():
    return JSONResponse(content={"message": "API de extracción activa. Usa /docs para ver la documentación."})
