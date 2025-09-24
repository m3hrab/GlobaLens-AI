"""
Report-related Pydantic schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class ReportBase(BaseModel):
    """Base report schema"""
    report_type: str = Field(..., description="Type of report: risk_analysis or action_plan")
    json_report: Dict[str, Any] = Field(..., description="Complete JSON report from agents")


class ReportResponse(ReportBase):
    """Schema for report response"""
    id: int
    query_id: int
    confidence_score: Optional[float] = None
    processing_time: Optional[float] = None
    agent_version: Optional[str] = None
    generated_at: datetime
    
    class Config:
        from_attributes = True


class RiskAnalysisResponse(BaseModel):
    """Schema for formatted risk analysis response"""
    query_id: int
    report_id: int
    summary: Dict[str, Any]
    risks: List[Dict[str, Any]]
    recommended_actions: List[Dict[str, Any]]
    top_sources: List[Dict[str, Any]]
    confidence_score: Optional[float] = None
    generated_at: datetime


class ActionPlanResponse(BaseModel):
    """Schema for formatted action plan response"""
    query_id: int
    report_id: int
    summary: Dict[str, Any]
    prioritized_actions: List[Dict[str, Any]]
    confidence_score: Optional[float] = None
    generated_at: datetime
