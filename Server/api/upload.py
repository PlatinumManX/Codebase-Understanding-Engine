from fastapi import APIRouter, UploadFile, File, Form
from services.upload_service import UploadService

router = APIRouter(prefix="/api")
upload_service = UploadService()

@router.post("/upload")
async def upload_repository(
    repository_name: str = Form(...),
    repository_file: UploadFile = File(...)
):
    return await upload_service.handle_zip_upload(repository_name, repository_file)
