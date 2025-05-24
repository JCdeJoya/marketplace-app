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
    
    async def save_image(self, file: UploadFile) -> Tuple[str, str]:
        """Save image and create thumbnail, return (image_url, thumbnail_url)"""
        # Generate unique filename
        ext = file.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        image_path = os.path.join(self.UPLOAD_DIR, filename)
        thumb_path = os.path.join(self.UPLOAD_DIR, f"thumb_{filename}")
        
        # Save original
        async with aiofiles.open(image_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Create thumbnail
        with Image.open(image_path) as img:
            img.thumbnail(self.THUMBNAIL_SIZE)
            img.save(thumb_path)
        
        return f"/images/{filename}", f"/images/thumb_{filename}"