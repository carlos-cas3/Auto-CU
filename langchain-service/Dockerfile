# Base image oficial de Python
FROM python:3.10-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia tus archivos al contenedor
COPY . /app

# Actualiza pip y setuptools
RUN pip install --upgrade pip setuptools

# Instala las dependencias
RUN pip install -r requirements.txt

# Descarga el modelo de spaCy (en inglés)
RUN python -m spacy download en_core_web_sm

# Expone el puerto que usará Uvicorn
EXPOSE 8000

# Comando para lanzar el servidor de FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
