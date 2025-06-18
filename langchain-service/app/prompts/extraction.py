def get_prompt_reqs(content: str) -> str:
    return (
        "You are a Requirements Engineering expert. Extract a list of **unique functional requirements** "
        "expressed as system behaviors, optimized for semantic analysis and automatic clustering.\n\n"

        "**INSTRUCTIONS:**\n"
        "- Focus on what the **system must do**, not what the user wants or does\n"
        "- Use a consistent structure: [Module] [Function] [Trigger] [Behavior]\n"
        "- Ensure each requirement includes distinctive elements for semantic clustering\n\n"

        "**STRICT FORMAT:**\n"
        "[Módulo: FunctionalArea] [Función: verb + system object] [Disparador: specific condition] [Comportamiento: debe + expected outcome]\n\n"

        "**SUGGESTED VERBS:** validar, procesar, generar, actualizar, enviar, almacenar, autorizar, calcular\n"
        "**SUGGESTED MODULES:** Autenticación, Pagos, Inventario, Notificaciones, Sesiones, Reportes\n\n"

        "**EXAMPLES:**\n"
        "[Módulo: Autenticación] [Función: validar credenciales] [Disparador: al enviar formulario de login] [Comportamiento: debe permitir o denegar acceso]\n"
        "[Módulo: Pagos] [Función: generar comprobante] [Disparador: tras pago exitoso] [Comportamiento: debe registrar y enviar el documento]\n\n"

        "**OUTPUT REQUIREMENTS:**\n"
        "- Return the list in **Spanish**\n"
        "- Each requirement in a **numbered line**\n"
        "- Avoid duplicates or vague verbs like '\n"
        "- **Do not mention 'user' or 'cliente'**\n\n"

        f"**TEXT TO ANALYZE:**\n{content}\n\n"
        "**OUTPUT:** Numbered list of unique functional requirements in Spanish:"
    )

def get_prompt_cases(content: str) -> str:
    return (
        "You are a Requirements Engineering expert. Extract **unique, atomic, and semantically distinct use cases** from the text for clustering.\n\n"
        
        "**FORMAT**:\n"
        "[Area: FunctionalArea] [Role: SpecificRole] [Action: verb + object] [Purpose: to + goal]\n\n"

        "**RULES**:\n"
        "- Use same verbs for same actions\n"
        "- Use specific roles (no 'user')\n"
        "- Each case = 1 distinct action\n"
        "- Include 3+ key semantic cues per case\n\n"

        "**EXAMPLES**:\n"
        "[Area: Authentication] [Role: New Customer] [Action: register account] [Purpose: to access system features]\n"
        "[Area: Shopping Cart] [Role: Registered Customer] [Action: remove item] [Purpose: to edit order]\n"
        "[Area: Inventory] [Role: Store Manager] [Action: update stock] [Purpose: to reflect current availability]\n\n"

        "**RESPONSE INSTRUCTIONS**:\n"
        "- Answer in Spanish if input is Spanish\n"
        "- One per line, avoid duplicates or vague verbs like '\n"

        f"**TEXT TO ANALYZE**:\n{content}\n\n"
        "**OUTPUT:**"
    )

