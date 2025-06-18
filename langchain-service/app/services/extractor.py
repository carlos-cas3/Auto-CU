import asyncio
from langchain_ollama import OllamaLLM
from app.schemas import ExtractionOutput
from app.prompts.extraction import get_prompt_reqs, get_prompt_cases

llm = OllamaLLM(model="llama3")

def clean_lines(raw_output: str) -> list[str]:
    lines = raw_output.strip().split("\n")
    return [
        line.strip("1234567890.-* ").strip()
        for line in lines
        if line.strip()
        and not line.lower().startswith(("aquí", "estos son", "casos de uso", "requisitos funcionales"))
    ]


async def extract_from_text(content: str, story_id: str) -> ExtractionOutput:
    try:
        print("📩 Recibido texto:", content[:100], "...")
        prompt_reqs = get_prompt_reqs(content)
        prompt_cases = get_prompt_cases(content)

        reqs, cases = await asyncio.gather(
            asyncio.to_thread(llm.invoke, prompt_reqs),
            asyncio.to_thread(llm.invoke, prompt_cases)
        )

        print("✅ Respuesta del modelo:")
        print("Requisitos:\n", reqs)
        print("Casos de uso:\n", cases)

        return ExtractionOutput(
            functional_requirements=clean_lines(reqs),
            use_cases=clean_lines(cases)
        )
    except Exception as e:
        print("❌ Error en extractor:", str(e))
        raise e