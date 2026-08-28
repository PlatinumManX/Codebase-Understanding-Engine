from typing import Any, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from llm.query_orchestrator import QueryOrchestrator


router = APIRouter(
    prefix="/api",
    tags=["AI Query"]
)


class QueryRequest(BaseModel):
    repository_id: str
    query: str
    conversation_id: Optional[str] = None
    selected: Optional[dict[str, Any]] = None
    highlighted: Optional[Any] = None


@router.post("/query")
async def process_query(request: QueryRequest):

    orchestrator = QueryOrchestrator(
        request.repository_id
    )

    result = orchestrator.process_query(
        query=request.query,
        selected=request.selected,
        highlighted=request.highlighted,
        conversation_id=request.conversation_id
    )

    return result