from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
import redis
import json
from passlib.context import CryptContext
from .database import get_redis_connection

app = FastAPI()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User model for registration and login
class User(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

@app.post("/api/register")
def register_user(user: User, db: redis.Redis = Depends(get_redis_connection)):
    try:
        hashed_password = pwd_context.hash(user.password)
        user_data = {
            "name": user.name,
            "password": hashed_password
        }
        db.set(user.email, json.dumps(user_data))
        return {"message": "User registered successfully"}
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.post("/api/login")
def login_user(login: Login, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_data_raw = db.get(login.email)
        if not user_data_raw:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = json.loads(user_data_raw)
        
        if pwd_context.verify(login.password, user_data["password"]):
            return {"message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Incorrect password")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")
