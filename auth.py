from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from database import session
from database_model import User
from models import UserCreate, UserLogin
from passlib.context import CryptContext
from jose import jwt, JWTError
import asyncio
import os

IS_PRODUCTION = os.getenv("ENV") == "production"

router = APIRouter()

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


#Creating a password context
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated = "auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_pass: str , hashed_pass: str) ->bool:
    return pwd_context.verify(plain_pass, hashed_pass)

@router.post("/register")
async def register_new_user(user: UserCreate, response: Response, db : Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException( status_code=400, detail= "Email already registered")
    
    new_user = User(
        name = user.name,
        email = user.email,
        hased_password = hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    db_user = db.query(User).filter(User.email == user.email).first()
    token = create_access_token({"sub": str(db_user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="strict",
    )
    
    return {"message": "User registered successfully"}


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    # expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # to_encode.update({ "exp" : expire })
    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token

@router.post("/login")
async def login_user(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException( status_code=401, detail="User not found")
    
    if not verify_password(user.password, db_user.hased_password):
        raise HTTPException( status_code=401, detail="Wrong Password")
    
    token = create_access_token({"sub": str(db_user.id)})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="strict"
    )

    return {"message" : "Login Successful"}


def get_current_user(request: Request, db : Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try: 
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id: str = payload.get("sub")
        
    except JWTError :
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid Payload")
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    await asyncio.sleep(2)
    return {
        "id" : current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

@router.post("/logout")
async def logout(response: Response):
    await asyncio.sleep(2)
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}