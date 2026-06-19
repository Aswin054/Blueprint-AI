from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import EditRoadmapRequest, Roadmap
from app.services.groq_client import edit_roadmap_via_llm
from app.middleware.rate_limiter import limiter

router = APIRouter()

# REMOVED /api prefix because it's handled in main.py
@router.post("/edit-roadmap", response_model=Roadmap)
@limiter.limit("5/day")
async def edit_roadmap(request: Request, body: EditRoadmapRequest):
    try:
        updated_roadmap = edit_roadmap_via_llm(body.current_roadmap, body.user_instruction)
        return updated_roadmap
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")