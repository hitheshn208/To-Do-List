from pydantic import BaseModel, EmailStr

class ToDoBase(BaseModel):
    task: str
    completed: bool

class ToDoResponse(ToDoBase):
    task_id: int
    
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True