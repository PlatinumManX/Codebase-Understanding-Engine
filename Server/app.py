import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import routers
from api.upload import router as upload_router
from api.repositories import router as repositories_router

# Load env variables
load_dotenv()

app = FastAPI(
    title="CodeMap AI API Server",
    description="Backend services for parsing and mapping codebase transaction flows",
    version="1.0.0"
)

# CORS configurations
origins = [
    "http://localhost:5173",  # React Vite development server
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # standard alternative port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(upload_router)
app.include_router(repositories_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "CodeMap AI API Server",
        "version": "1.0.0"
    }
