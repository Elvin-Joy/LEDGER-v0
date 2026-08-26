from fastapi import FastAPI

from app.db.database import engine, Base
from app.db import models

app = FastAPI(title="LedgerAI")


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "LedgerAI API is running successfully"}