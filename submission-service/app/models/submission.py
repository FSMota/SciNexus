from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, Enum as SQLEnum, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.types import JSON, TypeDecorator

from app.database import Base


class StringArray(TypeDecorator):
	impl = JSON
	cache_ok = True

	def load_dialect_impl(self, dialect):
		if dialect.name == "postgresql":
			return dialect.type_descriptor(ARRAY(String))
		return dialect.type_descriptor(SQLiteJSON())


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
	palavras_chave = Column(StringArray, nullable=False, default=list)
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
