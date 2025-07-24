from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from bson import ObjectId
import jwt
import os
from database import users_col
from dotenv import load_dotenv

load_dotenv()  # Make sure .env is loaded

# Load env variables
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGO   = os.getenv("JWT_ALGORITHM")
JWT_EXP_HOURS = int(os.getenv("JWT_EXPIRE_HOURS", 24))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 🔐 Get the current user from the JWT
def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    print("[DEBUG] Token received:", token)
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        print("[DEBUG] Decoded payload:", payload)

        user_id = payload.get("sub")
        if not user_id:
            print("[DEBUG] No 'sub' in token payload")
            raise HTTPException(status_code=401, detail="Invalid token")

        user = users_col.find_one({"_id": ObjectId(user_id)})
        if not user:
            print(f"[DEBUG] User not found for ID: {user_id}")
            raise HTTPException(status_code=401, detail="User not found")

        return str(user["_id"])

    except jwt.ExpiredSignatureError:
        print("[DEBUG] Token has expired")
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        print(f"[DEBUG] Invalid token error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")


# 🔐 Create access token with user ID
def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_EXP_HOURS)
    payload = {
        "sub": user_id,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)
    return token


# 🔐 Register a new user
def register_user(username: str, email: str, password: str) -> str:
    if users_col.find_one({"username": username}):
        raise HTTPException(status_code=409, detail="Username already exists")

    hashed_pw = bcrypt.hash(password)
    user = {
        "username": username,
        "email": email,
        "password": hashed_pw,
        "created_at": datetime.utcnow()
    }
    result = users_col.insert_one(user)
    return str(result.inserted_id)


# 🔐 Authenticate user (login)
def authenticate_user(username: str, password: str) -> str:
    user = users_col.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return str(user["_id"])
