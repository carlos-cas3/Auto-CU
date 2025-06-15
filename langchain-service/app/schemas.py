# app/schemas.py
from pydantic import BaseModel
from typing import List

class DocumentInput(BaseModel):
    content: str
    story_id: str

class ExtractionOutput(BaseModel):
    functional_requirements: List[str]
    use_cases: List[str]
