# app/services/database.py
from app.config import SUPABASE_URL, SUPABASE_KEY

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

async def count_items(client, table, story_id):
    response = await client.get(
        f"{SUPABASE_URL}/rest/v1/{table}?story_id=eq.{story_id}&select=id",
        headers={**HEADERS, "Prefer": "count=exact"}
    )
    return int(response.headers.get("content-range", "0-0").split("/")[1])


async def insert_functional_requirement(client, story_id, requirement):
    count = await count_items(client, "functional_requirements", story_id)
    ref = f"RF{str(count + 1).zfill(2)}"

    payload = {
        "story_id": story_id,
        "requirement": requirement,
        "ref": ref,
        "title": "Título generado",
        "description": "Descripción generada"
    }

    response = await client.post(
        f"{SUPABASE_URL}/rest/v1/functional_requirements",
        json=payload,
        headers=HEADERS
    )
    return response


async def insert_use_case(client, story_id, use_case):
    count = await count_items(client, "use_cases", story_id)
    ref = f"CU{str(count + 1).zfill(2)}"

    payload = {
        "story_id": story_id,
        "use_case": use_case,
        "ref": ref,
        "actor": "Actor generado",
        "goal": "Objetivo generado",
        "description": "Descripción generada"
    }

    response = await client.post(
        f"{SUPABASE_URL}/rest/v1/use_cases",
        json=payload,
        headers=HEADERS
    )
    return response


async def insert_embedding(client, payload):
    response = await client.post(
        f"{SUPABASE_URL}/rest/v1/embeddings",
        json=payload,
        headers=HEADERS
    )
    return response
