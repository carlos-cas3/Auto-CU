from app.services.pipelines import process_user_story


if __name__ == "__main__":
    # Procesa el texto original
    result = process_user_story("TU HISTORIA DE USUARIO AQUÍ...")

    print("\n📋 Requisitos Funcionales Normalizados:\n")
    for rf in result["parsed_rf"]:
        print(f"🔹 ID: {rf['id']}")
        print(f"🧾 Original: {rf['text']}")
        print(f"✅ Normalizado:\n{rf['neutral']}\n")

    print("\n📋 Casos de Uso Normalizados:\n")
    for cu in result["parsed_cu"]:
        print(f"🔸 ID: {cu['id']}")
        print(f"🧾 Original: {cu['text']}")
        print(f"✅ Normalizado:\n{cu['neutral']}\n")
