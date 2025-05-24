from pydantic import BaseModel, ConfigDict, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)
