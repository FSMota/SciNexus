import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Submission
from app.schemas import SubmissionRead
from app.security import get_usuario_logado_id
# from app.dependencias import get_usuario_logado (Sua função que valida o JWT)

router = APIRouter(prefix="/eventos", tags=["Submissões"])

# Diretório base para salvar os PDFs dentro do container
UPLOAD_DIR = "uploads/pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/{evento_id}/submissoes", response_model=SubmissionRead, status_code=201)
async def criar_submissao(
    evento_id: int,
    titulo: str = Form(...),
    resumo: str = Form(...),
    palavras_chave: str = Form(..., description="Palavras separadas por vírgula"),
    arquivo_pdf: UploadFile = File(...),
    db: Session = Depends(get_db),
    
    # A MÁGICA ACONTECE AQUI:
    autor_id: int = Depends(get_usuario_logado_id) 
):
    if not arquivo_pdf.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são permitidos.")
    
    # Agora usamos o ID real e seguro que veio de dentro do token do usuário
    file_path = os.path.join(UPLOAD_DIR, f"evento_{evento_id}_autor_{autor_id}_{arquivo_pdf.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(arquivo_pdf.file, buffer)

    lista_palavras = [p.strip() for p in palavras_chave.split(",") if p.strip()]

    nova_submissao = Submission(
        evento_id=evento_id,
        autor_principal_id=autor_id, # Variável populada pelo token
        titulo=titulo,
        resumo=resumo,
        palavras_chave=lista_palavras,
        arquivo_pdf_path=file_path
    )

    db.add(nova_submissao)
    db.commit()
    db.refresh(nova_submissao)

    return nova_submissao


@router.get("/{evento_id}/submissoes", response_model=List[SubmissionRead])
def listar_submissoes_do_evento(
    evento_id: int, 
    db: Session = Depends(get_db)
    # Aqui, idealmente, você validaria se o usuário logado é ORGANIZADOR deste evento
):
    """Rota para o Organizador ver todos os artigos submetidos no evento dele"""
    submissoes = db.query(Submission).filter(Submission.evento_id == evento_id).all()
    return submissoes


@router.get("/minhas-submissoes", response_model=List[SubmissionRead])
def listar_minhas_submissoes(
    db: Session = Depends(get_db),
    # usuario = Depends(get_usuario_logado)
):
    """Rota para o Autor ver o status dos artigos que ele mesmo enviou"""
    autor_id: int = Depends(get_usuario_logado_id)
    
    submissoes = db.query(Submission).filter(Submission.autor_principal_id == autor_id).all()
    return submissoes