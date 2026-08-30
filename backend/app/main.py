from fastapi import FastAPI

from app.db.database import engine, Base
from app.db import models
from app.auth.routes import router as auth_router
from app.expenses.routes import router as expense_router

app = FastAPI(title="LedgerAI")
app.include_router(expense_router)
app.include_router(auth_router)


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "LedgerAI API is running successfully"}