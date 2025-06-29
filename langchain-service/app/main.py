from fastapi import FastAPI
from pydantic import BaseModel
from app.services.pipelines import process_user_story
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserStoryRequest(BaseModel):
    text: str

@app.post("/analyze/")
async def analyze_user_story(request: UserStoryRequest):
    result = process_user_story(request.text)

    return {
        "test_cases": result["test_cases"]
    }
