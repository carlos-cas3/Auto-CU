from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.schemas import DocumentInput, ExtractionOutput
from app.services.extractor import extract_from_text
from app.services.embeddings import generate_and_store_embeddings
from app.services.database import insert_functional_requirement, insert_use_case

import httpx

app = FastAPI()

@app.post("/analyze", response_model=ExtractionOutput)
async def analyze_document(data: DocumentInput):
    output = await extract_from_text(data.content, data.story_id)
    
    textos = []
    tipos = []
    ids = []

    async with httpx.AsyncClient() as client:
        for req in output.functional_requirements:
            res = await insert_functional_requirement(client, data.story_id, req)
            if res.status_code >= 400:
                print(f"❌ Error al insertar RF: {res.text}")
                continue
            rf_id = res.json()[0]["id"]
            textos.append(req)
            tipos.append("functional_requirements")
            ids.append(rf_id)

        for uc in output.use_cases:
            res = await insert_use_case(client, data.story_id, uc)
            if res.status_code >= 400:
                print(f"❌ Error al insertar CU: {res.text}")
                continue
            uc_id = res.json()[0]["id"]
            textos.append(uc)
            tipos.append("use_cases")
            ids.append(uc_id)

        await generate_and_store_embeddings(client, data.story_id, textos, tipos, ids)

    return output

@app.get("/")
async def root():
    return JSONResponse(content={"message": "API de extracción activa. Usa /docs para ver la documentación."})
