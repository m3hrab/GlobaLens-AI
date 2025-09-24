"""
Service for managing user queries and their lifecycle
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.user import User
from app.models.query import Query
from app.models.report import Report
from app.schemas.query import QueryCreate, QueryResponse, QueryHistory


class QueryService:
    """Service for managing queries"""
    
    @staticmethod
    def create_query(db: Session, user: User, query_data: QueryCreate) -> Query:
        """
        Create a new query for a user
        
        Args:
            db: Database session
            user: User creating the query
            query_data: Query creation data
            
        Returns:
            Query: Created query
        """
        db_query = Query(
            user_id=user.id,
            question=query_data.question,
            status="pending"
        )
        
        db.add(db_query)
        db.commit()
        db.refresh(db_query)
        
        return db_query
    
    @staticmethod
    def get_query(db: Session, query_id: int, user_id: Optional[int] = None) -> Optional[Query]:
        """
        Get a query by ID, optionally filtered by user
        
        Args:
            db: Database session
            query_id: Query ID
            user_id: Optional user ID filter
            
        Returns:
            Query: Found query or None
        """
        query = db.query(Query).filter(Query.id == query_id)
        
        if user_id is not None:
            query = query.filter(Query.user_id == user_id)
        
        return query.first()
    
    @staticmethod
    def update_query_status(
        db: Session, 
        query_id: int, 
        status: str, 
        route_data: Optional[Dict[str, Any]] = None
    ) -> Optional[Query]:
        """
        Update query status and route data
        
        Args:
            db: Database session
            query_id: Query ID
            status: New status
            route_data: Optional route data
            
        Returns:
            Query: Updated query or None
        """
        db_query = db.query(Query).filter(Query.id == query_id).first()
        
        if db_query:
            db_query.status = status
            if route_data is not None:
                db_query.route_data = route_data
            
            db.commit()
            db.refresh(db_query)
        
        return db_query
    
    @staticmethod
    def get_user_queries(
        db: Session, 
        user_id: int, 
        page: int = 1, 
        page_size: int = 20
    ) -> QueryHistory:
        """
        Get user's query history with pagination
        
        Args:
            db: Database session
            user_id: User ID
            page: Page number (1-based)
            page_size: Number of queries per page
            
        Returns:
            QueryHistory: Paginated query history
        """
        offset = (page - 1) * page_size
        
        # Get queries with reports
        queries = (
            db.query(Query)
            .filter(Query.user_id == user_id)
            .order_by(desc(Query.created_at))
            .offset(offset)
            .limit(page_size)
            .all()
        )
        
        # Get total count
        total_count = db.query(Query).filter(Query.user_id == user_id).count()
        
        return QueryHistory(
            queries=[QueryResponse.from_orm(q) for q in queries],
            total_count=total_count,
            page=page,
            page_size=page_size
        )
    
    @staticmethod
    def get_query_with_reports(db: Session, query_id: int, user_id: int) -> Optional[Query]:
        """
        Get query with all associated reports
        
        Args:
            db: Database session
            query_id: Query ID
            user_id: User ID
            
        Returns:
            Query: Query with reports or None
        """
        return (
            db.query(Query)
            .filter(Query.id == query_id, Query.user_id == user_id)
            .first()
        )
