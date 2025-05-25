from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from redis.exceptions import RedisError

async def error_handler_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except HTTPException as exc:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
    except SQLAlchemyError as exc:
        return JSONResponse(
            status_code=500,
            content={"detail": "Database error occurred"}
        )
    except RedisError as exc:
        return JSONResponse(
            status_code=500,
            content={"detail": "Cache service unavailable"}
        )
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )