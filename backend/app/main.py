from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.db.database import engine, Base
from app.db import models
from app.auth.routes import router as auth_router
from app.expenses.routes import router as expense_router
from app.ai.routes import router as ai_router

app = FastAPI(title="LedgerAI")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(expense_router)
app.include_router(auth_router)
app.include_router(ai_router)


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "LedgerAI API is running successfully"}