from fastapi import APIRouter, Body
from services.repository_service import RepositoryService

router = APIRouter(prefix="/api/repositories", tags=["Repositories"])
repository_service = RepositoryService()

@router.get("")
async def get_all_repositories():
    return repository_service.get_all_repositories()

@router.get("/active")
async def get_active_repository():
    return repository_service.get_active_repository()

@router.get("/{repository_id}")
async def get_repository_by_id(repository_id: str):
    return repository_service.get_repository_by_id(repository_id)

@router.patch("/{repository_id}")
async def update_repository(repository_id: str, payload: dict = Body(...)):
    return repository_service.update_repository(repository_id, payload)

@router.delete("/{repository_id}")
async def delete_repository(repository_id: str):
    return repository_service.delete_repository(repository_id)

@router.get("/{repository_id}/graph")
async def get_repository_graph(repository_id: str):
    return repository_service.load_repository_graph(repository_id)

@router.get("/{repository_id}/graph/statistics")
async def get_graph_statistics(repository_id: str):
    return repository_service.get_graph_statistics(repository_id)

@router.get("/{repository_id}/graph/module/{module:path}")
async def get_module_subgraph(repository_id: str, module: str):
    return repository_service.get_module_subgraph(repository_id, module)

@router.get("/{repository_id}/graph/function/{function:path}")
async def get_function_subgraph(repository_id: str, function: str):
    return repository_service.get_function_subgraph(repository_id, function)

@router.get("/{repository_id}/graph/route/{route:path}")
async def get_route_subgraph(repository_id: str, route: str):
    return repository_service.get_route_subgraph(repository_id, route)
