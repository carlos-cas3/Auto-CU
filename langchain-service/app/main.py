# app/main.py
from fastapi import FastAPI
from app.schemas import DocumentInput, ExtractionOutput
from app.services.extractor import extract_from_text

app = FastAPI()

@app.post("/analyze", response_model=ExtractionOutput)
def analyze_document(data: DocumentInput):
    return extract_from_text(data.content, data.story_id)
