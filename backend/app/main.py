from fastapi import FastAPI
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.api.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount uploads directory
app.mount("/images", StaticFiles(directory="uploads/images"), name="images")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    # Optional test DB connection (will raise on error)
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except OperationalError:
        return {"message": "Database connection failed."}

    return {"message": "Welcome to Marketplace API"}
