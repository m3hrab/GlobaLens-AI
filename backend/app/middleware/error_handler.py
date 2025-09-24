"""
Global error handling middleware
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging
import traceback

logger = logging.getLogger(__name__)


def add_exception_handlers(app: FastAPI):
    """Add global exception handlers to FastAPI app"""
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Handle HTTP exceptions"""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "message": exc.detail,
                "status_code": exc.status_code
            }
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handle request validation errors"""
        return JSONResponse(
            status_code=422,
            content={
                "error": True,
                "message": "Validation error",
                "details": exc.errors(),
                "status_code": 422
            }
        )
    
    @app.exception_handler(SQLAlchemyError)
    async def database_exception_handler(request: Request, exc: SQLAlchemyError):
        """Handle database errors"""
        logger.error(f"Database error: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": "Database error occurred",
                "status_code": 500
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle all other exceptions"""
        logger.error(f"Unexpected error: {str(exc)}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": "Internal server error",
                "status_code": 500
            }
        )
