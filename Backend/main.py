from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from database import get_redis_connection
from pydantic import BaseModel
import redis
import json
from passlib.context import CryptContext

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    name: str
    email: str
    password: str

@app.post("/api/register")
def register_user(user: User, db: redis.Redis = Depends(get_redis_connection)):
    try:
        hashed_password = pwd_context.hash(user.password)
        user_data = {"name": user.name, "password": hashed_password}
        db.set(user.email, json.dumps(user_data))
        return {"message": "User registered successfully"}
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

class Login(BaseModel):
    email: str
    password: str

@app.post("/api/login")
def login_user(login: Login, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_data_raw = db.get(login.email)
        if user_data_raw is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = json.loads(user_data_raw)
        
        if pwd_context.verify(login.password, user_data["password"]):
            return {"message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Incorrect password")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")