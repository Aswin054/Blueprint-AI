from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import generate_roadmap, edit_roadmap
from app.middleware.rate_limiter import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import logging

# Configure logging to output to your terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS settings to allow local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:5173",
        "https://blueprint-ai-t7b1.onrender.com",
        "https://aswindsblueprint.vercel.app",
        ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler to log Pydantic validation errors.
    This will print the exact issue to your local terminal when a 400 error occurs.
    """
    body = await request.body()
    logger.error(f"VALIDATION ERROR: {exc.errors()}")
    logger.error(f"RAW BODY RECEIVED: {body.decode()}")
    
    return JSONResponse(
        status_code=400,
        content={"detail": exc.errors()},
    )

# Include your API routers
app.include_router(generate_roadmap.router, prefix="/api")
app.include_router(edit_roadmap.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API is online"}