from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, Enum as SQLEnum, Integer, String, Text
from sqlalchemy.types import JSON
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from app.database import Base

class SubmissionStatus(str, Enum):
    submetido = "SUBMETIDO"
    em_revisao = "EM_REVISAO"
    aprovado = "APROVADO"
    rejeitado = "REJEITADO"

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    evento_id = Column(Integer, nullable=False, index=True)
    autor_principal_id = Column(Integer, nullable=False, index=True)
    titulo = Column(String, nullable=False, index=True)
    resumo = Column(Text, nullable=False)
    
    # MUDE AQUI: Use a mesma estrutura limpa do módulo de events
    palavras_chave = Column(JSON().with_variant(SQLiteJSON, "sqlite"), nullable=False, default=list)
    
    arquivo_pdf_path = Column(String, nullable=False)
    status = Column(
        SQLEnum(
            SubmissionStatus,
            name="submission_status",
            native_enum=False,
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
        default=SubmissionStatus.submetido,
    )
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )