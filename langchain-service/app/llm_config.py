from langchain_ollama import OllamaLLM

def get_llm(model_name="mistral"):
    return OllamaLLM(
        model=model_name,
        base_url="http://localhost:11434",
        streaming=True,
        temperature=0.3
    )
