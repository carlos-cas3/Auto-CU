from sentence_transformers import SentenceTransformer

# Modelo preentrenado
model = SentenceTransformer("all-MiniLM-L6-v2")

# Tus textos a vectorizar (requisitos, casos de uso, etc.)
texts = [
    "poder registrarme en el sistema",
    "guardar mi información de pago",
    "consultar mi historial de pedidos",
    "recibir notificaciones de promociones"
]

# Obtener embeddings (devuelve lista de vectores)
embeddings = model.encode(texts)

# Puedes imprimir el vector de la primera frase
print(embeddings[0])
