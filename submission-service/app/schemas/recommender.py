from pydantic import BaseModel, Field

class RevisorMatchRequest(BaseModel):
    tags_revisor: list[str] = Field(..., description="Tags de expertise do revisor orquestradas pelo frontend")