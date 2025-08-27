from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    companyName: str
    email: EmailStr
    password: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
