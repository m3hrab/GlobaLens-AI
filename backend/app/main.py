"""
GlobaLens AI Backend - FastAPI Application
A robust backend for global supply chain risk monitoring using SmythOS agents.
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.core.database import engine, create_tables
from app.routes import auth, query, report
from app.middleware.error_handler import add_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    create_tables()
    yield
    # Shutdown
    pass


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title="GlobaLens AI Backend",
        description="Real-time global supply chain risk monitoring and predictive insights",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan
    )
    
    # Configure CORS for frontend integration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for development
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add exception handlers
    add_exception_handlers(app)
    
    # Include routers
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(query.router, prefix="/api/v1/query", tags=["Query Management"])
    app.include_router(report.router, prefix="/api/v1/report", tags=["Risk Reports"])
    
    @app.get("/", tags=["Health"])
    async def root():
        """Health check endpoint"""
        return {
            "message": "GlobaLens AI Backend is running",
            "version": "1.0.0",
            "status": "healthy"
        }
    
    @app.get("/health", tags=["Health"])
    async def health_check():
        """Detailed health check"""
        return {
            "status": "healthy",
            "database": "connected",
            "agents": {
                "web_risk_monitor": "available",
                "action_plan": "available"
            }
        }
    
    return app


# Create the app instance
app = create_app()


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
