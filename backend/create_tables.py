from app.db.base import Base
import app.db.models  # Import all models to register with Base

from app.db.session import engine

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")
