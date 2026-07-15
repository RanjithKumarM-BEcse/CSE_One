from fastapi import FastAPI

app = FastAPI(
    title="CSE One API",
    description="Backend API for CSE One - S.A. Engineering College",
    version="1.0.0"
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "CSE One Backend is running"}
