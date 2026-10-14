import os
from dotenv import load_dotenv
import ollama

load_dotenv()


class LocalOllamaLLM:
    """LLM local vía Ollama.

    Conserva la interfaz que usa el pipeline: ``llm.invoke(prompt) -> str``.
    Desactiva los tokens de razonamiento (``think=False``) para que la salida sea
    limpia y parseable. Si el modelo no soporta ``think``, reintenta sin él.
    """

    def __init__(self, model, base_url):
        self.model = model
        self.client = ollama.Client(host=base_url)

    def invoke(self, prompt):
        kwargs = {
            "model": self.model,
            "prompt": prompt,
            "options": {"temperature": 0.3},
        }
        try:
            response = self.client.generate(think=False, **kwargs)
        except Exception:
            response = self.client.generate(**kwargs)
        return response["response"]


def get_llm(model_name=None):
    model = model_name or os.getenv("OLLAMA_MODEL", "mistral")
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    return LocalOllamaLLM(model, base_url)
