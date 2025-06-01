from pydantic import BaseModel

class ShippingDetails(BaseModel):
    full_name: str
    address: str
    city: str
    postal_code: str
    phone: str
