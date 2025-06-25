import re
import time
import textwrap
import pandas as pd
from tqdm import tqdm
from langchain_community.llms import Ollama

# Inicializar LLM (solo una vez)
llm = Ollama(model="llama3")


def build_neutral_prompt(sentence: str) -> str:
    return textwrap.dedent(f"""
        Transform the following requirement or use case into a standardized neutral sentence for semantic analysis.

        **STRICT FORMAT:**
        "The actor must [VERB] [OBJECT] [CONDITION] to [PURPOSE]."

        **MANDATORY RULES:**
        • Use ONLY these verbs: access, manage, process, confirm, validate, view, track, modify, generate, store, send
        • Replace ALL specific actors (user, system, customer, manager, etc.) with "The actor"
        • Keep the core action and purpose
        • Remove implementation details
        • Use present tense
        • Maximum 15 words

        **EXAMPLES:**
        Input: "the system must validate registration when user registers in order to allow access"
        Output: "The actor must validate registration to confirm access eligibility."

        Input: "the customer must add product when browsing catalog in order to build purchase list"
        Output: "The actor must manage cart contents to organize selected items."

        **INPUT:**
        {sentence}

        **OUTPUT (one sentence only):**
    """).strip()


def llama_rephrase(row) -> str:
    prompt = build_neutral_prompt(row["rewrite"])
    for attempt in range(3):
        try:
            response = llm.invoke(prompt).strip()
            match = re.search(r"(The actor must .*?[\.\n])", response)
            if match:
                return match.group(1).strip()
            return response.strip().strip('"')
        except Exception as err:
            print(f"[⚠️] Error en fila {row.name} (intento {attempt+1}/3): {err}")
            time.sleep(1)
    return row["rewrite"]


def normalize_sentences(df: pd.DataFrame) -> pd.DataFrame:
    tqdm.pandas(desc="🔄 Normalizando")
    df["neutral"] = df.progress_apply(llama_rephrase, axis=1)
    return df
