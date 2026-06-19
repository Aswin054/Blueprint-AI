from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import EditRoadmapRequest, Roadmap
from app.services.groq_client import edit_roadmap_via_llm
from app.middleware.rate_limiter import limiter
from pydantic import ValidationError

router = APIRouter()

@router.post("/edit-roadmap", response_model=Roadmap)
@limiter.limit("5/day")
async def edit_roadmap(request: Request, body: EditRoadmapRequest):
    """
    Endpoint to receive current roadmap and user edits, returning the updated roadmap.
    """
    try:
        # Utilize the service function to process edits via Groq
        updated_roadmap = edit_roadmap_via_llm(body.current_roadmap, body.user_instruction)
        return updated_roadmap
    except ValidationError as e:
        # Return a 400 error if the AI output fails validation or parsing
        raise HTTPException(status_code=400, detail=f"Schema Mismatch: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Return a 500 error for unexpected server-side issues
        print(f"CRITICAL ERROR: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while editing the roadmap.")