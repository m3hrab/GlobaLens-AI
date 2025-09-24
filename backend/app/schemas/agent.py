"""
Agent integration schemas based on SmythOS API specifications
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Any, Optional, Literal
from datetime import datetime


# Web Risk Monitor Agent Schemas
class WebRiskMonitorRequest(BaseModel):
    """Request schema for Web Risk Monitor Agent"""
    question: str = Field(..., description="Supply chain risk question to analyze")


class RouteInfo(BaseModel):
    """Route information schema"""
    origin_ports: List[str]
    transit: List[str]
    destination_ports: List[str]


class RiskProfile(BaseModel):
    """Overall risk profile schema"""
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0


class RiskSummary(BaseModel):
    """Risk summary schema"""
    route: RouteInfo
    overall_risk_profile: RiskProfile


class SourceInfo(BaseModel):
    """Source information schema"""
    name: str
    url: str


class RiskItem(BaseModel):
    """Individual risk item schema"""
    id: str = Field(..., description="Unique risk ID (e.g., RISK_001)")
    type: Literal["weather", "labor", "port_ops", "geopolitical", "security", "infra", "commercial"]
    severity: Literal["critical", "high", "medium", "low"]
    title: str
    description: str = Field(..., description="1-3 sentence description")
    locations_affected: List[str]
    impacted_route_segments: List[Literal["origin", "transit", "destination"]]
    last_update: datetime
    sources: List[SourceInfo]
    confidence: float = Field(..., ge=0.0, le=1.0)
    typical_impact_window: str = Field(..., description="e.g., '48 hours'")


class MonitoringAction(BaseModel):
    """Monitoring action schema"""
    action: str = Field(..., description="Short description of action")
    details: str = Field(..., description="1-3 sentence details")


class WebRiskMonitorResponse(BaseModel):
    """Response schema for Web Risk Monitor Agent"""
    query: str = Field(..., description="Normalized question or route summary")
    generated_at: datetime
    summary: RiskSummary
    risks: List[RiskItem]
    recommended_monitoring_actions: List[MonitoringAction]
    top_sources_used: List[SourceInfo]


# Action Plan Agent Schemas
class ActionPlanRequest(BaseModel):
    """Request schema for Action Plan Agent"""
    route_risks: Dict[str, Any] = Field(..., description="Web-Risk-Monitor output JSON")


class ActionPlanSummary(BaseModel):
    """Action plan summary schema"""
    total_risks: RiskProfile
    top_affected_locations: List[str] = Field(..., max_items=3)
    priority_focus: str = Field(..., description="Brief description of main risk focus area")


class PrioritizedAction(BaseModel):
    """Prioritized action schema"""
    priority: int = Field(..., ge=1, description="Action priority (1 is highest)")
    action: str = Field(..., description="Clear action title")
    description: str = Field(..., description="Concise 1-3 sentence description")
    target_risks: List[str] = Field(..., description="List of risk IDs this action addresses")
    estimated_impact: Literal["high", "medium", "low"]
    sources: List[SourceInfo]


class ActionPlanResponse(BaseModel):
    """Response schema for Action Plan Agent"""
    generated_at: datetime
    summary: ActionPlanSummary
    prioritized_actions: List[PrioritizedAction]
