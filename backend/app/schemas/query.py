"""
Query-related Pydantic schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class QueryBase(BaseModel):
    """Base query schema"""
    question: str = Field(..., min_length=10, max_length=1000, description="Supply chain risk question")


class QueryCreate(QueryBase):
    """Schema for creating a new query"""
    pass


class QueryResponse(QueryBase):
    """Schema for query response"""
    id: int
    user_id: int
    route_data: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class QueryHistory(BaseModel):
    """Schema for user query history"""
    queries: List[QueryResponse]
    total_count: int
    page: int
    page_size: int
    
    class Config:
        from_attributes = True


class QueryUpdate(BaseModel):
    """Schema for updating query status"""
    status: Optional[str] = Field(None, description="Query status")
    route_data: Optional[Dict[str, Any]] = Field(None, description="Parsed route data")
