from app.services.pipelines import process_user_story


if __name__ == "__main__":
    result = process_user_story("TU HISTORIA DE USUARIO AQUÍ...")

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
        print(f"[{item['type']}] ({item['prob']:.2f}) → {item['original']}")

