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
    autor_id: int = Depends(get_usuario_logado_id) 
):
    if not arquivo_pdf.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são permitidos.")

    # 1. Quebra a string do formulário em uma lista real de strings: ['Métodos numéricos', 'numeros', 'matrizes']
    lista_palavras = [p.strip() for p in palavras_chave.split(",") if p.strip()]
    
    # 2. Salva o arquivo fisicamente no container
    file_path = os.path.join(UPLOAD_DIR, f"evento_{evento_id}_autor_{autor_id}_{arquivo_pdf.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(arquivo_pdf.file, buffer)

    # 3. Alimenta o modelo diretamente com a LISTA de strings
    nova_submissao = Submission(
        evento_id=evento_id,
        autor_principal_id=autor_id, 
        titulo=titulo,
        resumo=resumo,
        palavras_chave=lista_palavras, # <-- Passando a lista limpa diretamente aqui
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
    autor_id: int = Depends(get_usuario_logado_id)
):
    """Rota para o Autor ver o status dos artigos que ele mesmo enviou"""
    submissoes = db.query(Submission).filter(Submission.autor_principal_id == autor_id).all()
    return submissoes


@router.get("/submissoes/{submissao_id}", response_model=SubmissionRead)
def obter_submissao(
    submissao_id: int, 
    db: Session = Depends(get_db),
    autor_id: int = Depends(get_usuario_logado_id)
):
    """Rota para o Autor abrir os detalhes de um artigo específico que ele enviou"""
    submissao = db.query(Submission).filter(
        Submission.id == submissao_id,
        Submission.autor_principal_id == autor_id # Trava de segurança!
    ).first()

    if not submissao:
        raise HTTPException(status_code=404, detail="Submissão não encontrada ou acesso negado.")
        
    return submissao