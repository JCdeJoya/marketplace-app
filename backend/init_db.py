from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.crud.user import create_user
from app.schemas.user import UserCreate
import app.db.models  # Import all models

def init_db() -> None:
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")

        # Create initial admin user
        db = SessionLocal()
        admin_user = UserCreate(
            email="admin@example.com",
            password="admin123",  # Change this in production
            full_name="Admin User"
        )
        
        # Check if admin already exists
        existing_admin = db.query(app.db.models.User).filter_by(email=admin_user.email).first()
        if not existing_admin:
            user = create_user(db, admin_user)
            # Set admin flag
            user.is_admin = True
            db.commit()
            print(f"✅ Admin user created: {admin_user.email}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
        raise e

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization completed!")