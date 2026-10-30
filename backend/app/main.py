"""
RESQNET — Multi-Agent Disaster Response and Coordination System
FastAPI Application Entrypoint
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI application
app = FastAPI(
    title="RESQNET API",
    description="Multi-Agent Disaster Response and Coordination System Backend",
    version="1.0.0",
)

# Parse CORS origins from environment or default to local Next.js origins
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for operational verification."""
    return {
        "status": "ok",
        "service": "resqnet-api",
    }


@app.get("/", tags=["System"])
async def root():
    """Root metadata endpoint."""
    return {
        "name": "RESQNET API",
        "description": "Multi-Agent Disaster Response and Coordination System",
        "status": "running",
        "docs_url": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
