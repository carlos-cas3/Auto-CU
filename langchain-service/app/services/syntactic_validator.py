import spacy

nlp = spacy.load("en_core_web_sm")

def validate_syntactically(text: str) -> dict:
    doc = nlp(text)

    violations = []
    reasoning = []

    # Verbo infinitivo al inicio
    if not doc[0].pos_ == "VERB" or doc[0].tag_ != "VB":
        violations.append("Start with infinitive verb")
        reasoning.append(f"Starts with '{doc[0].text}', which is not a base-form verb")

    # No más de 15 palabras
    if len(doc) > 15:
        violations.append("Exceeds 15 words")
        reasoning.append(f"Sentence has {len(doc)} words")

    # No referencias humanas
    human_refs = {"user", "customer", "student", "teacher", "agent", "patient", "client"}
    if any(tok.text.lower() in human_refs for tok in doc):
        violations.append("Contains human reference")
        reasoning.append("Detected human-related noun(s)")

    return {
        "valid": len(violations) == 0,
        "violations": violations,
        "reasoning": " | ".join(reasoning) if reasoning else "All rules passed"
    }
