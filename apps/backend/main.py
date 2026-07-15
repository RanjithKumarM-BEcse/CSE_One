from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import auth

app = FastAPI(
    title="CSE One API",
    description="Backend API for CSE One - S.A. Engineering College",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
from api.v1 import academic, timetable
app.include_router(academic.router, prefix="/api/v1/academic", tags=["academic"])
app.include_router(timetable.router, prefix="/api/v1/timetable", tags=["timetable"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "CSE One Backend is running"}
