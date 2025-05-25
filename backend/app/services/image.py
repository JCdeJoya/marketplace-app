import os
from fastapi import UploadFile
from PIL import Image
from typing import Tuple
import aiofiles
import uuid

class ImageService:
    UPLOAD_DIR = "uploads/images"
    THUMBNAIL_SIZE = (200, 200)
    
    def __init__(self):
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)
    
    async def save_image(self, file: UploadFile, product_id: int) -> str:
        """Save image and create thumbnail, return (image_url, thumbnail_url)"""
        if not os.path.exists(self.UPLOAD_DIR):
            os.makedirs(self.UPLOAD_DIR)
            
        file_ext = os.path.splitext(file.filename)[1]
        filename = f"product_{product_id}{file_ext}"
        filepath = os.path.join(self.UPLOAD_DIR, filename)
        
        async with aiofiles.open(filepath, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
            
        return f"/images/{filename}"