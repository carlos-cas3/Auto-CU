from app.services.embeddings import (
    generate_embeddings, apply_clustering,
    evaluate_cluster_similarity, filter_valid_clusters, visualize_clusters
)

# Paso 1: Embeddings
texts = df_combined["neutral"].tolist()
vectors = generate_embeddings(texts)

# Paso 2: Clustering
labels, probs, embedding_2d = apply_clustering(vectors)

# Paso 3: Guardar resultados en el dataframe
df_combined["cluster"] = labels
df_combined["cluster_prob"] = probs

# Paso 4: Evaluación de calidad
evaluate_cluster_similarity(df_combined, texts, model)

# Paso 5: Filtrar clusters válidos
df_combined = filter_valid_clusters(df_combined)

# Paso 6: Visualización
visualize_clusters(df_combined, embedding_2d)
