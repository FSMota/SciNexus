from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.database import get_db
from app.models import User
from app.schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        token_data = TokenData(
            user_id=int(payload.get("sub")),
            token_version=int(payload.get("tv")),
        )
    except (JWTError, TypeError, ValueError):
        raise credentials_error from None

    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None or not user.is_active or user.token_version != token_data.token_version:
        raise credentials_error

    return user
