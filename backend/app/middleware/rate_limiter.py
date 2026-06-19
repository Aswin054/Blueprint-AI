from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

# Initialize the limiter. 
# "5/day" limits each IP to 5 requests per day.
# You can change this to "10/minute" for testing.
limiter = Limiter(key_func=get_remote_address)

def rate_limit_exceeded_handler(request: Request, exc):
    """Custom response when the rate limit is hit."""
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."}
    )