from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class SubmissionStatus(str, Enum):
    submetido = "SUBMETIDO"
    em_revisao = "EM_REVISAO"
    aprovado = "APROVADO"
    rejeitado = "REJEITADO"


class SubmissionBase(BaseModel):
    evento_id: int
    autor_principal_id: int
    titulo: str
    resumo: str
    palavras_chave: list[str] = Field(default_factory=list)
    arquivo_pdf_path: str


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionUpdate(BaseModel):
    titulo: str | None = None
    resumo: str | None = None
    palavras_chave: list[str] | None = None
    arquivo_pdf_path: str | None = None
    status: SubmissionStatus | None = None


class SubmissionRead(SubmissionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: SubmissionStatus
    feedback: str | None = None
    created_at: datetime
    updated_at: datetime
