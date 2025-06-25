import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


def generate_test_case_pairs(df_combined: pd.DataFrame) -> pd.DataFrame:
    casos_prueba = []

    for cluster_id, grupo in df_combined.groupby("cluster"):
        if cluster_id == -1:
            continue  # ignorar ruido

        rf = grupo[grupo["Type"] == "RF"]
        cu = grupo[grupo["Type"] == "CU"]

        for _, cu_row in cu.iterrows():
            cu_embedding = cu_row["embedding"]
            for _, rf_row in rf.iterrows():
                rf_embedding = rf_row["embedding"]
                sim = cosine_similarity([cu_embedding], [rf_embedding])[0][0]

                casos_prueba.append({
                    "cluster": cluster_id,
                    "CU_ID": cu_row["ID"],
                    "RF_ID": rf_row["ID"],
                    "similitud": round(sim, 3),
                    "CU_text": cu_row["neutral"],
                    "RF_text": rf_row["neutral"]
                })

    df_casos_prueba = pd.DataFrame(casos_prueba)
    df_casos_prueba = df_casos_prueba.sort_values(by=["cluster", "similitud"], ascending=[True, False])
    return df_casos_prueba
