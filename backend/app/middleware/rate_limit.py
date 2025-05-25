from fastapi import Request
import time
from redis import Redis

redis_client = Redis(host='redis', port=6379, db=1)

async def rate_limit_middleware(request: Request, call_next):
    # Get client IP
    client_ip = request.client.host
    
    # Check rate limit (100 requests per minute)
    current = int(time.time())
    key = f"rate_limit:{client_ip}:{current // 60}"
    
    requests = redis_client.incr(key)
    redis_client.expire(key, 59)
    
    if requests > 100:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests"}
        )
    
    return await call_next(request)