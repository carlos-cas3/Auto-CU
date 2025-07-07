from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.services.pipelines import process_user_story
from fastapi.middleware.cors import CORSMiddleware
import sys
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)


app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserStoryRequest(BaseModel):
    text: str

@app.post("/analyze/")
async def analyze_user_story(request: UserStoryRequest):
    logging.info("📥 [main.py] Recibido POST /analyze")
    logging.info(f"📝 Texto recibido (primeros 200 caracteres): {request.text[:200]}")

    try:
        result = process_user_story(request.text)
    except Exception as e:
        logging.error("❌ Error durante el procesamiento:")
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error interno en el procesamiento")

    logging.info("✅ [main.py] Proceso completado, devolviendo resultados.")
    return {"test_cases": result["test_cases"]}



@app.get("/health")
async def health_check():
    return {"status": "ok"}

