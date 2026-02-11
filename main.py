from fastapi import Depends, FastAPI, HTTPException, Request
from models import ToDoBase, ToDoResponse
from fastapi.middleware.cors import CORSMiddleware
from database import session, engine
from sqlalchemy.orm import Session
import database_model
import asyncio
from auth import get_current_user, router as auth_router

app = FastAPI()
app.include_router(auth_router, prefix="/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://127.0.0.1:5500", "https://to-do-list-lyart-eight-83.vercel.app/"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    allow_credentials = True
)

database_model.Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db = session()
        yield db
    finally:
        db.close()


@app.get("/tasks")
async def get_all_tasks( current_user: database_model.User = Depends(get_current_user), db : Session = Depends(get_db)):
    db_tasks = db.query(database_model.ToDos).filter(database_model.ToDos.user_id == current_user.id).all()
    return db_tasks

@app.post("/task")
async def add_task(new_task : ToDoBase, current_user: database_model.User = Depends(get_current_user), db : Session = Depends(get_db)):
    try :
        new_db_task = database_model.ToDos(
            task = new_task.task,
            completed = new_task.completed,
            user_id = current_user.id
        )
        db.add(new_db_task)
        db.commit()
        db.refresh(new_db_task)

        get_task_id = db.query(database_model.ToDos).filter(database_model.ToDos.id == new_db_task.id).first()
        return get_task_id
    except:
        return "Task was not Added"
    

@app.put("/task/{task_id}")
def update_task(task_id: int, updated_task: ToDoBase, request: Request, db : Session = Depends(get_db)):
    db_task = db.query(database_model.ToDos).filter(database_model.ToDos.id == task_id).first()
    if db_task:
        db_task.task = updated_task.task    
        db_task.completed = updated_task.completed
        db.commit()
        return "Task Updated"
    return "Task Not found"


@app.delete("/task/{task_id}")
def delete_task(task_id: int, request: Request, db : Session = Depends(get_db)):
    db_task = db.query(database_model.ToDos).filter(database_model.ToDos.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()    
        return "Task Deleted"
    return "Task Not found"

@app.patch("/task/completed/{task_id}")
async def toggle_task_status(task_id: int, status: bool, request: Request, db : Session = Depends(get_db)):
    db_task = db.query(database_model.ToDos).filter(database_model.ToDos.id == task_id).first()
    if db_task:
        db_task.completed = status
        db.commit()
        return "Status Changed"
    return "Task Not found"

@app.get("/ping")
@app.head("/ping")
def ping():
    """Endpoint for UptimeRobot to keep Render awake"""
    return {"status": "Alive"}

@app.get("/")
def greet():
    return{"message": "Hello from backend"}