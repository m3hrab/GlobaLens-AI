"""
Service for integrating with SmythOS agents
"""

import asyncio
import time
from typing import Dict, Any, Optional
import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.agent import (
    WebRiskMonitorRequest, 
    WebRiskMonitorResponse,
    ActionPlanRequest,
    ActionPlanResponse
)


class AgentService:
    """Service for communicating with SmythOS agents"""
    
    def __init__(self):
        self.web_risk_monitor_url = settings.web_risk_monitor_url
        self.action_plan_agent_url = settings.action_plan_agent_url
        self.timeout = settings.agent_timeout
        self.retries = settings.agent_retries
    
    async def _make_request(
        self, 
        url: str, 
        data: Dict[str, Any],
        operation_name: str
    ) -> Dict[str, Any]:
        """
        Make HTTP request to agent with retry logic
        
        Args:
            url: Agent endpoint URL
            data: Request payload
            operation_name: Operation name for error messages
            
        Returns:
            Dict[str, Any]: Agent response
            
        Raises:
            HTTPException: If request fails after retries
        """
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        last_exception = None
        
        for attempt in range(self.retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(url, json=data, headers=headers)
                    response.raise_for_status()
                    return response.json()
                    
            except httpx.TimeoutException as e:
                last_exception = e
                if attempt < self.retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff
                    await asyncio.sleep(wait_time)
                    continue
                    
            except httpx.HTTPStatusError as e:
                if e.response.status_code >= 500 and attempt < self.retries - 1:
                    # Retry on server errors
                    last_exception = e
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    # Don't retry on client errors (4xx)
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"{operation_name} failed: {e.response.status_code} - {e.response.text}"
                    )
                    
            except Exception as e:
                last_exception = e
                if attempt < self.retries - 1:
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)
                    continue
        
        # All retries failed
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"{operation_name} failed after {self.retries} attempts: {str(last_exception)}"
        )
    
    async def analyze_route_risks(self, question: str) -> Dict[str, Any]:
        """
        Call Web Risk Monitor Agent to analyze route risks
        
        Args:
            question: Supply chain risk question
            
        Returns:
            Dict[str, Any]: Risk analysis response
        """
        request_data = WebRiskMonitorRequest(question=question).dict()
        
        start_time = time.time()
        
        try:
            response_data = await self._make_request(
                self.web_risk_monitor_url,
                request_data,
                "Web Risk Monitor"
            )
            
            processing_time = time.time() - start_time
            
            # Validate response structure
            validated_response = WebRiskMonitorResponse(**response_data)
            
            # Add processing metadata
            result = validated_response.dict()
            result["_metadata"] = {
                "processing_time": processing_time,
                "agent_version": "web-risk-monitor-v1",
                "request_timestamp": start_time
            }
            
            return result
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Failed to process risk analysis: {str(e)}"
                )
    
    async def generate_action_plan(self, route_risks: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call Action Plan Agent to generate action plan
        
        Args:
            route_risks: Risk analysis data from Web Risk Monitor
            
        Returns:
            Dict[str, Any]: Action plan response
        """
        request_data = ActionPlanRequest(route_risks=route_risks).dict()
        
        start_time = time.time()
        
        try:
            response_data = await self._make_request(
                self.action_plan_agent_url,
                request_data,
                "Action Plan Agent"
            )
            
            processing_time = time.time() - start_time
            
            # Validate response structure
            validated_response = ActionPlanResponse(**response_data)
            
            # Add processing metadata
            result = validated_response.dict()
            result["_metadata"] = {
                "processing_time": processing_time,
                "agent_version": "action-plan-v1",
                "request_timestamp": start_time
            }
            
            return result
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Failed to generate action plan: {str(e)}"
                )
    
    async def health_check(self) -> Dict[str, str]:
        """
        Check health status of both agents
        
        Returns:
            Dict[str, str]: Health status of agents
        """
        health_status = {
            "web_risk_monitor": "unknown",
            "action_plan_agent": "unknown"
        }
        
        # Simple health check - try to connect with minimal timeout
        timeout = 5  # seconds
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                # Try a HEAD request or minimal GET
                response = await client.get(self.web_risk_monitor_url.replace("/api/analyze_route_risks", ""))
                health_status["web_risk_monitor"] = "healthy" if response.status_code < 500 else "unhealthy"
        except:
            health_status["web_risk_monitor"] = "unreachable"
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.get(self.action_plan_agent_url.replace("/api/generate_action_plan", ""))
                health_status["action_plan_agent"] = "healthy" if response.status_code < 500 else "unhealthy"
        except:
            health_status["action_plan_agent"] = "unreachable"
        
        return health_status
