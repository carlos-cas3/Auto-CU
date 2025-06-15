# app/services/extractor.py
from langchain_ollama.llms import OllamaLLM
from app.schemas import ExtractionOutput

llm = OllamaLLM(model="llama3")

def extract_from_text(content: str, story_id: str) -> ExtractionOutput:
    prompt_reqs = f"Extrae los requisitos funcionales de este texto:\n{content}"
    prompt_cases = f"Extrae los casos de uso de este texto:\n{content}"

    reqs = llm.invoke(prompt_reqs)
    cases = llm.invoke(prompt_cases)

    return ExtractionOutput(
        functional_requirements=reqs.strip().split("\n"),
        use_cases=cases.strip().split("\n")
    )
