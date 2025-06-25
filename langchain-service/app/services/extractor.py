from langchain_ollama import OllamaLLM
from app.prompts.extraction import get_prompt_reqs, get_prompt_cases, get_prompt_normalization

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
    response = llm.invoke(prompt)
    return response.strip()
