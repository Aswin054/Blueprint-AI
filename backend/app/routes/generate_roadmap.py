from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import GenerateRoadmapRequest, Roadmap
from app.services.groq_client import generate_roadmap_via_llm 
from app.middleware.rate_limiter import limiter
from pydantic import ValidationError

router = APIRouter()

@router.post("/generate-roadmap", response_model=Roadmap)
@limiter.limit("5/day")
async def generate_roadmap(request: Request, body: GenerateRoadmapRequest):
    try:
        # Pass the entire validated body object directly
        return generate_roadmap_via_llm(body)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"Schema Mismatch: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")