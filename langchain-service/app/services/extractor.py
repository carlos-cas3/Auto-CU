from langchain_ollama import OllamaLLM
import json
from app.prompts.extraction import get_prompt_reqs, get_prompt_cases, get_prompt_normalization, get_prompt_validation_prompt
import time

llm = OllamaLLM(model="llama3")


def extract_requirements_and_use_cases(text: str) -> dict:
    prompt_reqs = get_prompt_reqs(text)
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

def validate_normalized_text(text: str, entry_type: str) -> dict:
    prompt = get_prompt_validation_prompt(entry_type, text)
    time.sleep(5)
    response = llm.invoke(prompt)
    
    try:
        return json.loads(response.strip())
    except json.JSONDecodeError:
        return {
            "valid": False,
            "violations": ["Invalid JSON format from LLM"],
            "reasoning": "The model response could not be parsed as JSON"
        }

    
def normalize_and_validate(text: str, entry_type: str, max_attempts: int = 3, delay: float = 5.0) -> tuple[str, dict]:
    for attempt in range(max_attempts):
        print(f"[{entry_type}] 🌀 Intento {attempt + 1}/{max_attempts}: Normalizando...")
        normalized = normalize_text(text)
        print(f"[{entry_type}] ✏️ Resultado normalizado: \"{normalized}\"")

        validation = validate_normalized_text(normalized, entry_type)
        print(f"[{entry_type}] ✅ Validación: {validation}")

        if validation.get("valid"):
            print(f"[{entry_type}] ✅ Validado correctamente en el intento {attempt + 1}")
            return normalized, validation

        # Si no es válido, espera antes del siguiente intento
        if attempt < max_attempts - 1:
            print(f"[{entry_type}] ⏳ Esperando {delay} segundos antes del siguiente intento...")
            time.sleep(delay)

    # Si todos los intentos fallaron
    print(f"[{entry_type}] ❌ No pasó la validación tras {max_attempts} intentos. Marcado para revisión manual.")
    validation["reasoning"] += " | Flagged for manual review"
    return normalized, validation

