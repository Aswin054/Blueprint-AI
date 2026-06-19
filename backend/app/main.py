import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from app.middleware.rate_limiter import limiter, rate_limit_exceeded_handler
from app.routes import generate_roadmap, edit_roadmap

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Roadmap Generator API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Include the roadmap routers with explicit prefixes to ensure they match /api/...
app.include_router(generate_roadmap.router, prefix="/api")
app.include_router(edit_roadmap.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}