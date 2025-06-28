# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Carga el .env desde la raíz del proyecto

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ SUPABASE_URL o SUPABASE_KEY no están definidas en el archivo .env")
