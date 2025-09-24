"""
Query management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.query import QueryCreate, QueryResponse, QueryHistory
from app.services.query_service import QueryService
from app.services.report_service import ReportService
from app.services.agent_service import AgentService

router = APIRouter()


async def process_risk_analysis_background(
    query_id: int, 
    question: str
):
    """
    Background task to process risk analysis
    
    Args:
        query_id: Query ID
        question: User question
    """
    from app.core.database import SessionLocal
    
    # Create a new database session for this background task
    db = SessionLocal()
    agent_service = AgentService()
    
    try:
        # Update query status to processing
        QueryService.update_query_status(db, query_id, "processing")
        
        # Call Web Risk Monitor Agent
        print(f"🔍 Processing risk analysis for query {query_id}...")
        risk_analysis = await agent_service.analyze_route_risks(question)
        
        # Extract metadata
        metadata = risk_analysis.pop("_metadata", {})
        
        # Save risk analysis report
        ReportService.create_report(
            db=db,
            query_id=query_id,
            report_type="risk_analysis",
            json_report=risk_analysis,
            processing_time=metadata.get("processing_time"),
            agent_version=metadata.get("agent_version")
        )
        
        # Now call Action Plan Agent with the risk analysis results
        print(f"🎯 Generating action plan for query {query_id}...")
        action_plan = await agent_service.generate_action_plan(risk_analysis)
        
        # Extract action plan metadata
        action_metadata = action_plan.pop("_metadata", {})
        
        # Save action plan report
        ReportService.create_report(
            db=db,
            query_id=query_id,
            report_type="action_plan",
            json_report=action_plan,
            processing_time=action_metadata.get("processing_time"),
            agent_version=action_metadata.get("agent_version")
        )
        
        # Update query status and route data
        route_data = None
        if "route" in risk_analysis:
            route_data = risk_analysis["route"]
        elif "summary" in risk_analysis and "route" in risk_analysis["summary"]:
            route_data = risk_analysis["summary"]["route"]
        
        QueryService.update_query_status(db, query_id, "completed", route_data)
        print(f"✅ Query {query_id} processing completed successfully!")
        
    except Exception as e:
        # Update query status to failed
        QueryService.update_query_status(db, query_id, "failed")
        print(f"❌ Risk analysis failed for query {query_id}: {str(e)}")
        
    finally:
        # Always close the database session
        db.close()


@router.post("/", response_model=QueryResponse, status_code=status.HTTP_201_CREATED)
async def create_query(
    query_data: QueryCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new supply chain risk query
    
    Args:
        query_data: Query creation data
        background_tasks: FastAPI background tasks
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        QueryResponse: Created query
    """
    # Create query
    db_query = QueryService.create_query(db, current_user, query_data)
    
    # Add background task to process risk analysis
    background_tasks.add_task(
        process_risk_analysis_background,
        db_query.id,
        query_data.question
    )
    
    return QueryResponse.from_orm(db_query)


@router.get("/{query_id}", response_model=QueryResponse)
async def get_query(
    query_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific query
    
    Args:
        query_id: Query ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        QueryResponse: Query details
        
    Raises:
        HTTPException: If query not found
    """
    db_query = QueryService.get_query(db, query_id, current_user.id)
    
    if not db_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    return QueryResponse.from_orm(db_query)


@router.get("/", response_model=QueryHistory)
async def get_user_queries(
    page: int = 1,
    page_size: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's query history with pagination
    
    Args:
        page: Page number (1-based)
        page_size: Number of queries per page
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        QueryHistory: Paginated query history
    """
    if page < 1:
        page = 1
    if page_size < 1 or page_size > 100:
        page_size = 20
    
    return QueryService.get_user_queries(db, current_user.id, page, page_size)
