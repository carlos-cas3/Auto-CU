def get_prompt_reqs(content: str) -> str:
    return (
        "You are an AI specialized in extracting atomic software functional requirements optimized for semantic clustering.\n\n"
        "INSTRUCTIONS:\n"
        "- Output ONLY a numbered list of functional requirements\n"
        "- DO NOT include intros, explanations, or remarks\n"
        "- Each requirement must follow this structure:\n"
        "  [Module: <system module>] [Function: <precise system action>] [Trigger: <event>] [Behavior: system shall <action>]\n"
        "- Use precise, technical verbs like: validate, store, generate, send, calculate, authorize, update\n"
        "- Avoid vague terms like: handle, manage, process unless strictly scoped\n"
        "- Do NOT reference humans, UI elements, or roles\n"
        "- Each requirement must be atomic (one system action only)\n"
        "- Output must be in English\n\n"
        "- Never write any instructions, questions, or assumptions. Only output the required formatted content.\n\n"
        "EXAMPLES:\n"
        "1. [Module: Payments] [Function: generate receipt] [Trigger: transaction success] [Behavior: system shall create and store receipt record]\n"
        "2. [Module: Inventory] [Function: update stock] [Trigger: item restock] [Behavior: system shall increment available quantity]\n\n"
        f"The following content has already been extracted. Normalize it according to the rules:\n{content}\n\n"
        "Return ONLY the numbered list of requirements. DO NOT explain or comment on the output:"
        )




def get_prompt_cases(content: str) -> str:
    return (
        "You are an AI specialized in extracting atomic software use cases for semantic clustering.\n\n"
        "INSTRUCTIONS:\n"
        "- Output ONLY a numbered list of use cases\n"
        "- Do NOT include explanations or headers\n"
        "- Use this exact structure for each use case:\n"
        "  [Area: <domain>] [Role: <specific actor>] [Action: <verb + object>] [Purpose: to <clear goal>]\n"
        "- Use clear and specific verbs like: submit, track, retrieve, review, create, assign, register\n"
        "- Avoid vague verbs: manage, handle, process (unless narrowly defined)\n"
        "- Avoid generic roles like 'user' or 'system'. Use roles like 'Student', 'Teacher', 'Accountant', etc.\n"
        "- Each use case must express **one specific system interaction**\n"
        "- Use English only\n\n"
        "- Never write any instructions, questions, or assumptions. Only output the required formatted content.\n\n"
        "EXAMPLES:\n"
        "1. [Area: Education] [Role: Student] [Action: enroll in course] [Purpose: to attend academic classes]\n"
        "2. [Area: Logistics] [Role: Dispatcher] [Action: assign delivery task] [Purpose: to ensure timely shipment]\n\n"
        f"The following content has already been extracted. Normalize it according to the rules:\n{content}\n\n"
        "Return ONLY the numbered list of use cases. DO NOT explain or comment on the output:"
        )




def get_prompt_normalization(text: str) -> str:
    return (
        "You are a software requirements assistant. Normalize each entry into a single sentence "
        "that describes the **system behavior** using precise language.\n\n"
        "RULES:\n"
        "- Use active voice\n"
        "- Begin with an infinitive verb (e.g., validate, store, generate, authorize)\n"
        "- Remove all references to humans (user, customer, teacher, patient, agent, etc.)\n"
        "- Avoid modal verbs like 'must', 'should', 'shall'\n"
        "- Keep it under 15 words\n"
        "- Do not rephrase or explain; output ONLY the normalized system behavior\n"
        "- Do not include any introductory or concluding remarks\n\n"
        "- Never write any instructions, questions, or assumptions. Only output the required formatted content.\n\n"
        "**EXAMPLES:**\n"
        "- Validate credentials against stored records upon login request\n"
        "- Store order data after successful checkout\n"
        "- Generate tracking code when shipment is created\n\n"
        f"The following items have already been extracted. Normalize them accordingly:\n{text}\n\n"
        "- Return ONLY the normalized sentences. DO NOT include any comments or extra text:"
        )



def get_prompt_validation_prompt(entry_type: str, normalized_text: str) -> str:
    return (
        f"You are an AI assistant for validating atomic {entry_type} sentences.\n\n"
        "INSTRUCTIONS:\n"
        "- Validate ONLY if the sentence meets all required structural rules\n"
        "- Do NOT include explanations, comments, or headers\n"
        "- Return ONLY a single JSON object with keys: valid, violations, reasoning\n"
        "- Do NOT return markdown, code blocks, or introductory text\n\n"
        "RULES:\n"
        "- Sentence must describe only system behavior\n"
        "- Must begin with an infinitive verb (e.g., validate, store, generate)\n"
        "- Must not contain any reference to humans or roles (e.g., user, teacher, patient)\n"
        "- Must not include modal verbs (must, shall, should, may)\n"
        "- Must be a single sentence, maximum 15 words\n"
        "- Must not include any extra text like: 'Here is the normalized sentence' or similar\n\n"
        "FORMAT:\n"
        "{\n"
        '  "valid": true or false,\n'
        '  "violations": ["list of failed rules"],\n'
        '  "reasoning": "short explanation of what was wrong (if any)"\n'
        "}\n\n"
        f"The following sentence is the normalized {entry_type} to validate:\n"
        f"\"{normalized_text}\"\n\n"
        "Return ONLY the JSON object. DO NOT include headers, explanations, or any additional text."
    )
