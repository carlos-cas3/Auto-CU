# Base con Python 3.12.7
FROM python:3.12.7-slim

# Evita interacción durante instalación
ENV DEBIAN_FRONTEND=noninteractive

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY . /app

# Instalar dependencias de sistema para compilar hdbscan y otros
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    libatlas-base-dev \
    libffi-dev \
    libssl-dev \
    libstdc++6 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Actualizar pip y setuptools
RUN pip install --upgrade pip setuptools wheel

# Instalar dependencias del proyecto
RUN pip install -r requirements.txt

# Descargar modelo de spaCy
RUN python -m spacy download en_core_web_sm

# Exponer el puerto
EXPOSE 8000

# Comando para lanzar FastAPI con uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
