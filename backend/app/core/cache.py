from redis import Redis
from fastapi import Depends
import json
from functools import wraps

redis_client = Redis(host='redis', port=6379, db=0)

def cache_response(expire_time=300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{str(kwargs)}"
            cached_data = redis_client.get(cache_key)
            
            if cached_data:
                return json.loads(cached_data)
                
            response = await func(*args, **kwargs)
            redis_client.setex(
                cache_key,
                expire_time,
                json.dumps(response)
            )
            return response
        return wrapper
    return decorator