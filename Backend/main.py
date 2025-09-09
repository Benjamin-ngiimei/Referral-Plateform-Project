from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis
import json
from passlib.context import CryptContext
from database import get_redis_connection
from Models.Opportunity import Opportunity
from config import PORT

app = FastAPI()

# CORS middleware
origins = [
    "http://localhost:3000",  # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
            return {"message": "Login successful", "name": user_data["name"]}
        else:
            raise HTTPException(status_code=401, detail="Incorrect password")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.post("/api/opportunities")
def post_opportunity(opportunity: Opportunity, db: redis.Redis = Depends(get_redis_connection)):
    try:
        # Generate a unique ID for the opportunity
        opportunity_id = db.incr("opportunity_id_counter")
        opportunity_key = f"opportunity:{opportunity_id}"
        
        # Store the opportunity data in Redis
        db.set(opportunity_key, json.dumps(opportunity.dict()))
        
        return {"message": "Opportunity posted successfully", "opportunity_id": opportunity_id}
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.get("/api/opportunities/all")
def get_all_opportunities(db: redis.Redis = Depends(get_redis_connection)):
    try:
        opportunities = []
        for key in db.keys("opportunity:*"):
            opportunity_data_raw = db.get(key)
            if opportunity_data_raw:
                opportunities.append(json.loads(opportunity_data_raw))
        return opportunities
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
