from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import GenerateRoadmapRequest, Roadmap
from app.services.groq_client import generate_roadmap_via_llm 
from app.middleware.rate_limiter import limiter

router = APIRouter()

# REMOVED /api prefix because it's handled in main.py
@router.post("/generate-roadmap", response_model=Roadmap)
@limiter.limit("5/day")
async def generate_roadmap(request: Request, body: GenerateRoadmapRequest):
    """
    Endpoint to generate a structured learning roadmap.
    """
    try:
        # Pass the entire body object (it's already a validated Pydantic model)
        generated_roadmap = generate_roadmap_via_llm(body)
        return generated_roadmap
        
    except ValueError as e:
        # This will catch the parsing errors from groq_client.py
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # This catches unexpected server crashes
        print(f"CRITICAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")