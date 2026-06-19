from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import generate_roadmap, edit_roadmap
from app.middleware.rate_limiter import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI()

# 1. CORS Setup (Crucial for frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Add Exception Handlers
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Logs the exact validation error to Render logs."""
    print(f"VALIDATION ERROR: {exc.errors()}")
    return JSONResponse(
        status_code=400,
        content={"detail": exc.errors()},
    )

# 3. Include Routers
app.include_router(generate_roadmap.router, prefix="/api")
app.include_router(edit_roadmap.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Roadmap Generator API. Access the API documentation at /docs"}