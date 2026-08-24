from fastapi import FastAPI

app=FastAPI(title="LedgerAI")

@app.get("/")
def root():
    return{"message":"LedgerAI API is running successfully"}

