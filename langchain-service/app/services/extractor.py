
import json
from app.prompts.extraction import get_prompt_reqs, get_prompt_cases, get_prompt_normalization
from app.services.syntactic_validator import validate_syntactically
import time
import re
from app.llm_config import get_llm
import logging
# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

llm = get_llm()

def extract_requirements_and_use_cases(text: str) -> dict:
    logging.info("🤖 [extractor.py] Invocando LLM para extraer requisitos...")
    prompt_reqs = get_prompt_reqs(text)

    logging.info("🤖 [extractor.py] Invocando LLM para extraer casos de uso...")
    prompt_cases = get_prompt_cases(text)

    
    output_reqs = llm.invoke(prompt_reqs)
    output_cases = llm.invoke(prompt_cases)

    return {
        "functional_requirements": output_reqs,
        "use_cases": output_cases
    }

def normalize_text(text: str) -> str:
    prompt = get_prompt_normalization(text)
    time.sleep(5)
    response = llm.invoke(prompt)
    return response.strip()

def normalize_and_validate(text: str, entry_type: str, max_attempts: int = 3) -> tuple[str, dict]:
    for attempt in range(max_attempts):
        normalized = normalize_text(text)
        validation = validate_syntactically(normalized)

        if validation.get("valid"):
            return normalized, validation

    validation["reasoning"] += " | Flagged for manual review"
    return normalized, validation  # ← Este return debe estar sí o sí
