def clean_user_story(raw_text: str) -> str:
    lines = raw_text.strip().split("\n")
    cleaned = []

    for line in lines:
        line = line.strip()
        if not line or any(p in line.lower() for p in [
            "historia de usuario", "historias de usuario", "🛒", "🧑", "📦", "💳", "⭐"
        ]):
            continue

        line = line.strip("0123456789.-•* ")
        if line:
            cleaned.append(line)

    return " ".join(cleaned)
