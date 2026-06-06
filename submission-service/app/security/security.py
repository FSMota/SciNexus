from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import os

# A mesma chave secreta e algoritmo que você usou no auth-service
SECRET_KEY = os.getenv("JWT_SECRET", "sua_chave_secreta_super_segura")
ALGORITHM = "HS256"

# Isso diz ao FastAPI para procurar o cabeçalho: "Authorization: Bearer <token>"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login") 

def get_usuario_logado_id(token: str = Depends(oauth2_scheme)) -> int:
    """
    Descriptografa o JWT, valida a assinatura e retorna o ID do usuário.
    Se o token for falso ou estiver expirado, bloqueia a requisição (HTTP 401).
    """
    credenciais_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Desempacota o payload do JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Lê o ID do usuário (geralmente salvo na claim 'sub' ou 'id')
        # Atenção: Verifique como você nomeou essa chave no auth-service quando gerou o token!
        user_id: str = payload.get("sub") 
        
        if user_id is None:
            raise credenciais_exception
            
        return int(user_id)
        
    except JWTError:
        raise credenciais_exception