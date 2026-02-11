from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
from sqlalchemy.pool import NullPool

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
supaBase_URL = f"{DATABASE_URL}"
engine = create_engine(supaBase_URL,
                        poolclass=NullPool,
                        connect_args={"sslmode": "require"})

session = sessionmaker(autoflush=False, autocommit=False, bind=engine)