"""
Report management routes for risk analysis and action plans
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.report import RiskAnalysisResponse, ActionPlanResponse, ReportResponse
from app.services.query_service import QueryService
from app.services.report_service import ReportService
from app.services.agent_service import AgentService

router = APIRouter()


async def process_action_plan_background(
    query_id: int, 
    risk_analysis_data: Dict[str, Any], 
    db: Session
):
    """
    Background task to process action plan generation
    
    Args:
        query_id: Query ID
        risk_analysis_data: Risk analysis data from Web Risk Monitor
        db: Database session
    """
    agent_service = AgentService()
    
    try:
        # Call Action Plan Agent
        action_plan = await agent_service.generate_action_plan(risk_analysis_data)
        
        # Extract metadata
        metadata = action_plan.pop("_metadata", {})
        
        # Save report
        ReportService.create_report(
            db=db,
            query_id=query_id,
            report_type="action_plan",
            json_report=action_plan,
            processing_time=metadata.get("processing_time"),
            agent_version=metadata.get("agent_version")
        )
        
    except Exception as e:
        # In production, you might want to log this error
        print(f"Action plan generation failed for query {query_id}: {str(e)}")


@router.get("/{query_id}/risk-analysis", response_model=RiskAnalysisResponse)
async def get_risk_analysis(
    query_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get risk analysis report for a query
    
    Args:
        query_id: Query ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        RiskAnalysisResponse: Risk analysis report
        
    Raises:
        HTTPException: If query or report not found
    """
    # Verify user owns the query
    db_query = QueryService.get_query(db, query_id, current_user.id)
    if not db_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    # Get risk analysis report
    report = ReportService.get_risk_analysis_report(db, query_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Risk analysis report not found"
        )
    
    return ReportService.format_risk_analysis_response(report)


@router.post("/{query_id}/action-plan", response_model=ActionPlanResponse)
async def generate_action_plan(
    query_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate action plan based on risk analysis
    
    Args:
        query_id: Query ID
        background_tasks: FastAPI background tasks
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        ActionPlanResponse: Action plan response or existing plan
        
    Raises:
        HTTPException: If query or risk analysis not found
    """
    # Verify user owns the query
    db_query = QueryService.get_query(db, query_id, current_user.id)
    if not db_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    # Check if action plan already exists
    existing_action_plan = ReportService.get_action_plan_report(db, query_id)
    if existing_action_plan:
        return ReportService.format_action_plan_response(existing_action_plan)
    
    # Get risk analysis report
    risk_analysis_report = ReportService.get_risk_analysis_report(db, query_id)
    if not risk_analysis_report:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Risk analysis must be completed before generating action plan"
        )
    
    # Add background task to generate action plan
    background_tasks.add_task(
        process_action_plan_background,
        query_id,
        risk_analysis_report.json_report,
        db
    )
    
    # Return a placeholder response indicating processing
    return ActionPlanResponse(
        query_id=query_id,
        report_id=0,  # Will be updated when processing completes
        summary={"status": "processing"},
        prioritized_actions=[],
        generated_at=risk_analysis_report.generated_at
    )


@router.get("/{query_id}/action-plan", response_model=ActionPlanResponse)
async def get_action_plan(
    query_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get action plan report for a query
    
    Args:
        query_id: Query ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        ActionPlanResponse: Action plan report
        
    Raises:
        HTTPException: If query or report not found
    """
    # Verify user owns the query
    db_query = QueryService.get_query(db, query_id, current_user.id)
    if not db_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    # Get action plan report
    report = ReportService.get_action_plan_report(db, query_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Action plan report not found"
        )
    
    return ReportService.format_action_plan_response(report)


@router.get("/{query_id}/reports")
async def get_all_reports(
    query_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reports for a query
    
    Args:
        query_id: Query ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Dict: All reports for the query
        
    Raises:
        HTTPException: If query not found
    """
    # Verify user owns the query
    db_query = QueryService.get_query(db, query_id, current_user.id)
    if not db_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    # Get all reports
    reports = ReportService.get_query_reports(db, query_id)
    
    result = {
        "query_id": query_id,
        "query": {
            "id": db_query.id,
            "question": db_query.question,
            "status": db_query.status,
            "created_at": db_query.created_at
        },
        "reports": {}
    }
    
    for report in reports:
        if report.report_type == "risk_analysis":
            result["reports"]["risk_analysis"] = ReportService.format_risk_analysis_response(report)
        elif report.report_type == "action_plan":
            result["reports"]["action_plan"] = ReportService.format_action_plan_response(report)
    
    return result
