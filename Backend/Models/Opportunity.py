from pydantic import BaseModel

class Opportunity(BaseModel):
    title: str
    company: str
    type: str
    description: str
    email: str