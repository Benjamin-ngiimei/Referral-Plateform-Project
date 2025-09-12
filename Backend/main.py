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

class ApplicationStatusUpdate(BaseModel):
    status: str

class UserOpportunities(BaseModel):
    opportunity_ids: list[int]

class DeleteOpportunity(BaseModel):
    opportunity_id: int

@app.post("/api/register")
def register_user(user: User, db: redis.Redis = Depends(get_redis_connection)):
    try:
        if not db.exists("referral_key_counter"):
            db.set("referral_key_counter", 731000)

        referral_key = db.incr("referral_key_counter")
        admin = False

        hashed_password = pwd_context.hash(user.password)
        user_data = {
            "name": user.name,
            "email": user.email,
            "password": hashed_password,
            "referral_key": referral_key,
            "admin": admin
        }
        user_key = f"user:{referral_key}"
        db.set(user_key, json.dumps(user_data))
        return {"message": "User registered successfully"}
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.post("/api/login")
def login_user(login: Login, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_data = None
        for key in db.keys("user:*"):
            user_data_raw = db.get(key)
            if user_data_raw:
                user = json.loads(user_data_raw)
                if user["email"] == login.email:
                    user_data = user
                    break

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        if pwd_context.verify(login.password, user_data["password"]):
            return {"message": "Login successful", "name": user_data["name"], "referral_key": user_data["referral_key"], "admin": user_data.get("admin", False)}
        else:
            raise HTTPException(status_code=401, detail="Incorrect password")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.post("/api/opportunities")
def post_opportunity(opportunity: Opportunity, db: redis.Redis = Depends(get_redis_connection)):
    try:
        # Ensure opportunity_id_counter is a valid integer string
        # Check if the key exists and its type. If not a string or doesn't exist, initialize it.
        if not db.exists("opportunity_id_counter") or db.type("opportunity_id_counter").decode('utf-8') != 'string':
            db.set("opportunity_id_counter", 0) # Initialize to 0 if not a string or doesn't exist

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
                opportunity_data = json.loads(opportunity_data_raw)
                opportunity_id = int(key.decode("utf-8").split(":")[1])
                opportunity_data["id"] = opportunity_id
                opportunities.append(opportunity_data)
        return opportunities
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.delete("/api/opportunities/{opportunity_id}")
def delete_opportunity(opportunity_id: int, db: redis.Redis = Depends(get_redis_connection)):
    try:
        opportunity_key = f"opportunity:{opportunity_id}"
        if db.exists(opportunity_key):
            db.delete(opportunity_key)
            return {"message": "Opportunity deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Opportunity not found")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.get("/api/opportunities/{opportunity_id}")
def get_opportunity(opportunity_id: int, db: redis.Redis = Depends(get_redis_connection)):
    try:
        opportunity_key = f"opportunity:{opportunity_id}"
        opportunity_data_raw = db.get(opportunity_key)
        if opportunity_data_raw:
            opportunity_data = json.loads(opportunity_data_raw)
            opportunity_data["id"] = opportunity_id
            return opportunity_data
        else:
            raise HTTPException(status_code=404, detail="Opportunity not found")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.put("/api/opportunities/{opportunity_id}")
def update_opportunity(opportunity_id: int, opportunity: Opportunity, db: redis.Redis = Depends(get_redis_connection)):
    try:
        opportunity_key = f"opportunity:{opportunity_id}"
        if db.exists(opportunity_key):
            db.set(opportunity_key, json.dumps(opportunity.dict()))
            return {"message": "Opportunity updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Opportunity not found")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.get("/api/opportunities/{opportunity_id}/applicants")
def get_opportunity_applicants(opportunity_id: int, db: redis.Redis = Depends(get_redis_connection)):
    try:
        applicants = []
        for key in db.keys("user:*"):
            user_data_raw = db.get(key)
            if user_data_raw:
                user_data = json.loads(user_data_raw)
                if "applications" in user_data:
                    for application in user_data["applications"]:
                        if application["opportunity_id"] == opportunity_id:
                            applicants.append({"name": user_data["name"], "email": user_data["email"], "referral_key": user_data["referral_key"], "status": application["status"]})
                            break # Found the application for this opportunity, move to next user
        return applicants
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.get("/api/users/all")
def get_all_users(db: redis.Redis = Depends(get_redis_connection)):
    try:
        users = []
        for key in db.keys("user:*"):
            user_data_raw = db.get(key)
            if user_data_raw:
                users.append(json.loads(user_data_raw))
        return users
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.put("/api/opportunities/{opportunity_id}/applicants/{referral_key}/status")
def update_application_status(opportunity_id: int, referral_key: int, status_update: ApplicationStatusUpdate, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_key = f"user:{referral_key}"
        user_data_raw = db.get(user_key)
        if not user_data_raw:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = json.loads(user_data_raw)

        if "applications" not in user_data:
            raise HTTPException(status_code=404, detail="No applications found for this user.")

        found_application = False
        for application in user_data["applications"]:
            if application["opportunity_id"] == opportunity_id:
                application["status"] = status_update.status
                found_application = True
                break

        if not found_application:
            raise HTTPException(status_code=404, detail="Application for this opportunity not found for this user.")

        db.set(user_key, json.dumps(user_data))
        return {"message": "Application status updated successfully"}
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.post("/api/user/{referral_key}/opportunities")
def add_user_opportunities(referral_key: int, opportunities: UserOpportunities, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_key = f"user:{referral_key}"
        user_data_raw = db.get(user_key)
        if not user_data_raw:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = json.loads(user_data_raw)

        if "applications" not in user_data:
            user_data["applications"] = []

        for opp_id in opportunities.opportunity_ids:
            # Check if already applied to avoid duplicates
            if not any(app["opportunity_id"] == opp_id for app in user_data["applications"]):
                user_data["applications"].append({
                    "opportunity_id": opp_id,
                    "status": "Pending" # Default status
                })

        db.set(user_key, json.dumps(user_data))

        return {"message": "Opportunities added to user successfully"}
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.get("/api/user/{referral_key}/opportunities")
def get_user_opportunities(referral_key: int, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_key = f"user:{referral_key}"
        user_data_raw = db.get(user_key)
        if not user_data_raw:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = json.loads(user_data_raw)

        if "applications" not in user_data:
            return []

        applied_opportunities = []
        for application in user_data["applications"]:
            opportunity_id = application["opportunity_id"]
            opportunity_key = f"opportunity:{opportunity_id}"
            opportunity_data_raw = db.get(opportunity_key)
            if opportunity_data_raw:
                opportunity_data = json.loads(opportunity_data_raw)
                opportunity_data["id"] = opportunity_id # Ensure ID is present
                opportunity_data["status"] = application["status"] # Add status
                applied_opportunities.append(opportunity_data)

        return applied_opportunities
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.get("/api/user/{referral_key}/data")
def get_user_data(referral_key: int, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_key = f"user:{referral_key}"
        user_data_raw = db.get(user_key)
        if not user_data_raw:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = json.loads(user_data_raw)
        
        if "opportunity_ids" in user_data:
            opportunities = []
            for opportunity_id in user_data["opportunity_ids"]:
                opportunity_key = f"opportunity:{opportunity_id}"
                opportunity_data_raw = db.get(opportunity_key)
                if opportunity_data_raw:
                    opportunities.append(json.loads(opportunity_data_raw))
            user_data["opportunities"] = opportunities
        
        return user_data
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

@app.put("/api/user/{referral_key}/opportunities/delete")
def delete_user_opportunity(referral_key: int, opportunity: DeleteOpportunity, db: redis.Redis = Depends(get_redis_connection)):
    try:
        user_key = f"user:{referral_key}"
        user_data_raw = db.get(user_key)
        if not user_data_raw:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = json.loads(user_data_raw)
        
        if "opportunity_ids" in user_data and opportunity.opportunity_id in user_data["opportunity_ids"]:
            user_data["opportunity_ids"].remove(opportunity.opportunity_id)
            db.set(user_key, json.dumps(user_data))
            return {"message": "Opportunity deleted from user successfully"}
        else:
            raise HTTPException(status_code=404, detail="Opportunity not found in user data")
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
