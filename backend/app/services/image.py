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
        unique_id = uuid.uuid4().hex
        base_filename = f"product_{product_id}_{unique_id}"
        
        image_filename = f"{base_filename}{file_ext}"
        thumb_filename = f"{base_filename}_thumb{file_ext}"
        
        image_path = os.path.join(self.UPLOAD_DIR, image_filename)
        thumb_path = os.path.join(self.UPLOAD_DIR, thumb_filename)

        # Save original image
        content = await file.read()
        async with aiofiles.open(image_path, 'wb') as out_file:
            await out_file.write(content)

        # Create and save thumbnail
        image = Image.open(image_path)
        image.thumbnail(self.THUMBNAIL_SIZE)
        image.save(thumb_path)

        image_url = f"/images/{image_filename}"
        thumb_url = f"/images/{thumb_filename}"
        
        return image_url, thumb_url