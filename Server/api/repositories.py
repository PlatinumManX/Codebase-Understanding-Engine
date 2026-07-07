from fastapi import APIRouter, Body
from services.repository_service import RepositoryService

router = APIRouter(prefix="/api/repositories", tags=["Repositories"])
repository_service = RepositoryService()

@router.get("")
async def get_all_repositories():
    return repository_service.get_all_repositories()

@router.get("/{repository_id}")
async def get_repository_by_id(repository_id: str):
    return repository_service.get_repository_by_id(repository_id)

@router.patch("/{repository_id}")
async def update_repository(repository_id: str, payload: dict = Body(...)):
    return repository_service.update_repository(repository_id, payload)

@router.delete("/{repository_id}")
async def delete_repository(repository_id: str):
    return repository_service.delete_repository(repository_id)
