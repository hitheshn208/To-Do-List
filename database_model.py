from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean

Base = declarative_base()

class ToDos(Base):
    __tablename__ = "TODO"
    id = Column(Integer, primary_key=True, index=True)
    task = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)

class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, index=True, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hased_password = Column(String, nullable=False)