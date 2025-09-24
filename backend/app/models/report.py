"""
Report model for storing agent-generated risk reports and action plans
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Report(Base):
    """Report model for storing risk analysis and action plan reports"""
    
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id"), nullable=False)
    report_type = Column(String(50), nullable=False)  # "risk_analysis" or "action_plan"
    json_report = Column(JSON, nullable=False)  # Complete JSON response from agents
    confidence_score = Column(Float, nullable=True)  # Overall confidence if available
    processing_time = Column(Float, nullable=True)  # Time taken to generate report (seconds)
    agent_version = Column(String(50), nullable=True)  # Track agent version for debugging
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    query = relationship("Query", back_populates="reports")
    
    def __repr__(self):
        return f"<Report(id={self.id}, query_id={self.query_id}, type='{self.report_type}')>"
