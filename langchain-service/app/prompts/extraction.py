def get_prompt_reqs(content: str) -> str:
    return (
        f"Del siguiente texto, extrae una lista de **requisitos funcionales** del sistema. "
        f"No repitas casos de uso. "
        f"Un requisito funcional debe describir lo que el sistema debe hacer, "
        f"sin mencionar al usuario ni la intención del usuario.\n\n"
        f"❌ Evita frases como 'Como usuario quiero...'\n"
        f"✅ Usa frases como 'El sistema debe...'\n"
        f"No incluyas frases introductorias ni explicaciones. "
        f"Devuelve cada requisito en una línea sin numeración ni formato markdown:\n\n{content}"
    )

def get_prompt_cases(content: str) -> str:
    return (
        f"Del siguiente texto, extrae una lista de **casos de uso**. "
        f"Un caso de uso describe una acción que un usuario realiza con el sistema para lograr un objetivo. "
        f"No repitas requisitos funcionales. "
        f"Devuelve cada caso de uso en una línea sin numeración ni formato markdown:\n\n{content}"
    )
