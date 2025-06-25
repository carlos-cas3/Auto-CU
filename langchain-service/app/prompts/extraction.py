def get_prompt_reqs(content: str) -> str:
    return (
        "You are an AI specialized in extracting software functional requirements in a format optimized for semantic clustering.\n\n"
        "INSTRUCTIONS:\n"
        "- Output ONLY a numbered list of functional requirements\n"
        "- DO NOT include any intros, explanations, or closing remarks\n"
        "- Each requirement must follow this strict structure:\n"
        "  [Module: <system module>] [Function: <verb + system object>] [Trigger: <event>] [Behavior: must <system response>]\n"
        "- Use precise, system-oriented verbs: validate, store, generate, send, calculate, authorize, update\n"
        "- Requirements must be atomic (contain one system action only)\n"
        "- DO NOT mention users, customers, roles, or UI elements\n"
        "- Avoid vague terms like 'handle', 'manage', 'process' unless they are contextually specific\n"
        "- The output must be in English\n\n"
        "EXAMPLES:\n"
        "1. [Module: Payments] [Function: generate receipt] [Trigger: after successful transaction] [Behavior: must create and store receipt record]\n"
        "2. [Module: Notifications] [Function: send email] [Trigger: order confirmation] [Behavior: must include order details and timestamp]\n\n"
        f"TEXT TO ANALYZE:\n{content}\n\n"
        "Return ONLY the numbered list of requirements (no other text):"
    )



def get_prompt_cases(content: str) -> str:
    return (
        "You are an AI specialized in extracting software use cases, optimized for semantic clustering and atomic decomposition.\n\n"
        "INSTRUCTIONS:\n"
        "- Output ONLY a numbered list of use cases\n"
        "- DO NOT include explanations, headers, or formatting beyond the use case format\n"
        "- Each use case must follow this strict structure:\n"
        "  [Area: <domain>] [Role: <specific actor>] [Action: <verb + object>] [Purpose: to <goal>]\n"
        "- Each use case must be atomic, unique, and semantically rich (at least 3 key concepts)\n"
        "- Avoid vague verbs like 'manage', 'handle', or 'deal with'\n"
        "- Do NOT use generic roles like 'user' or 'system'; prefer roles like 'Student', 'Administrator', 'Buyer', etc.\n"
        "- Use consistent verb-object structures (e.g., 'submit request', 'view records')\n"
        "- Output must be in English\n\n"
        "EXAMPLES:\n"
        "1. [Area: Admissions] [Role: Applicant] [Action: submit application] [Purpose: to request enrollment in a program]\n"
        "2. [Area: Sales] [Role: Customer] [Action: track order status] [Purpose: to monitor delivery progress]\n\n"
        f"TEXT TO ANALYZE:\n{content}\n\n"
        "Return ONLY the numbered list of use cases (no other text):"
    )



def get_prompt_normalization(text: str) -> str:
    return (
        "You are a software requirements assistant. Normalize the following into a single sentence "
        "that describes a **system behavior** using precise, clear language.\n\n"
        "RULES:\n"
        "- Use active voice\n"
        "- Use **infinitive verbs** (e.g., validate, process, generate)\n"
        "- Do **not** include humans (user, customer, student, etc.)\n"
        "- Avoid modal verbs like 'must'\n"
        "- Keep it under 15 words\n"
        "- Focus only on what the **system does**\n\n"
        "**EXAMPLES:**\n"
        "- Validate credentials against stored records upon login request\n"
        "- Store order data after successful checkout\n"
        "- Generate tracking code when shipment is created\n\n"
        f"INPUT:\n{text}\n\n"
        "OUTPUT:"
    )




