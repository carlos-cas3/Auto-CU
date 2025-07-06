import os
from langchain_ollama import OllamaLLM as Ollama

def get_llm(model_name="llama3"):
    base_url = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    return Ollama(model=model_name, base_url=base_url)