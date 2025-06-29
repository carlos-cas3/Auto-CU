from app.services.pipelines import process_user_story

if __name__ == "__main__":
    with open("C:/Users/ca/OneDrive/Desktop/Auto-CU/langchain-service/analysis/historia.txt", "r", encoding="utf-8") as f:
        user_story_text = f.read()

    result = process_user_story(user_story_text)

    print("\n📋 Requisitos Funcionales Normalizados:\n")
    for idx, rf in enumerate(result["valid_rf"], 1):
        print(f"🔹 ID: {idx}")
        print(f"🧾 Original: {rf['original']}")
        print(f"✅ Normalizado:\n{rf['neutral']}\n")

    print("\n📋 Casos de Uso Normalizados:\n")
    for idx, cu in enumerate(result["valid_cu"], 1):
        print(f"🔸 ID: {idx}")
        print(f"🧾 Original: {cu['original']}")
        print(f"✅ Normalizado:\n{cu['neutral']}\n")

    print("\n📊 Embeddings agrupados por cluster:\n")
    for item in result["embedded"]:
        print(f"[{item['type']}] Cluster {item['cluster']} ({item['cluster_prob']:.2f}) → {item['neutral']}")

    print("\n📦 Agrupados por cluster (originales):\n")
    for cluster_id, items in result["grouped_clusters"].items():
        print(f"\n🔸 Cluster {cluster_id}:")
        for item in items:
            print(f"[{item['type']}] ({item['cluster_prob']:.2f}) → {item['original']}")


    print("\n📋 Casos de Prueba Generados por IA:\n")
    for idx, case in enumerate(result["test_cases"], 1):
        print(f"\n📦 Cluster {case['cluster']} — Similaridad: {case['similarity']:.3f}")
        print(f"🧾 CU: {case['cu']}")
        print(f"🛠️ RF: {case['rf']}")
        print("\n✅ Test Case Generado:\n")
        print(case["test_case"])
        print("\n" + "="*80 + "\n")

