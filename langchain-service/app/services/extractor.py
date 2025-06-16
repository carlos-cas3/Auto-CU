import asyncio
from langchain_ollama import OllamaLLM
from app.schemas import ExtractionOutput

llm = OllamaLLM(model="llama3")

def clean_lines(raw_output: str) -> list[str]:
    lines = raw_output.strip().split("\n")
    return [
        line.strip("1234567890.-* ")  # elimina numeración y bullets
        for line in lines
        if line.strip() and not line.lower().startswith("a continuación")
    ]


async def extract_from_text(content: str, story_id: str) -> ExtractionOutput:
    try:
        print("📩 Recibido texto:", content[:100], "...")
        prompt_reqs = (
            f"Extrae una lista de requisitos funcionales del siguiente texto. "
            f"No incluyas frases introductorias ni explicaciones. Devuelve cada requisito en una línea sin numeración ni formato markdown."
            f"Sólo el contenido de cada requisito:\n\n{content}"
            )
        prompt_cases = (
            f"Extrae una lista de casos de uso del siguiente texto. "
            f"No incluyas frases introductorias ni explicaciones. Devuelve cada caso de uso en una línea sin numeración ni formato markdown."
            f"Sólo el contenido de cada caso de uso:\n\n{content}"
            )

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
