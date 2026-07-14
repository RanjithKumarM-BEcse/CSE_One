from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import iam

app = FastAPI(
    title="CSE One API",
    description="Smart Attendance & Academic Analytics Platform API",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(iam.router, prefix="/api/v1/iam", tags=["IAM"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CSE One API"}
