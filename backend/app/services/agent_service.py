"""
Service for integrating with SmythOS agents
"""

import asyncio
import time
from datetime import datetime
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
    
    async def _make_request_with_timeout(
        self, 
        url: str, 
        data: Dict[str, Any],
        operation_name: str,
        timeout: int = 15
    ) -> Dict[str, Any]:
        """
        Make HTTP request to agent with custom timeout
        
        Args:
            url: Agent endpoint URL
            data: Request payload
            operation_name: Operation name for error messages
            timeout: Custom timeout in seconds
            
        Returns:
            Dict[str, Any]: Agent response
            
        Raises:
            HTTPException: If request fails
        """
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(url, json=data, headers=headers)
                response.raise_for_status()
                return response.json()
                
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail=f"{operation_name} timed out after {timeout} seconds"
            )
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"{operation_name} failed: {e.response.status_code} - {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"{operation_name} failed: {str(e)}"
            )
    
    async def analyze_route_risks(self, question: str) -> Dict[str, Any]:
        """
        Call Web Risk Monitor Agent to analyze route risks
        
        Args:
            question: Supply chain risk question
            
        Returns:
            Dict[str, Any]: Risk analysis response
        """
        request_data = {"question": question}
        
        start_time = time.time()
        
        try:
            response_data = await self._make_request(
                self.web_risk_monitor_url,
                request_data,
                "Web Risk Monitor"
            )
            
            processing_time = time.time() - start_time
            
            # Check for SmythOS agent errors
            if "result" in response_data:
                result = response_data["result"]
                
                # Check for token limit errors
                if "_error" in result and "token limit" in result["_error"].lower():
                    print("⚠️  SmythOS Web Risk Monitor hit token limit, using fallback")
                    return self._generate_fallback_risk_analysis(question, processing_time)
                
                # Check for web search errors
                if isinstance(result, list):
                    for item in result:
                        if isinstance(item, dict) and "result" in item:
                            item_result = item["result"]
                            if "_error" in item_result and "status code 400" in item_result["_error"]:
                                print("⚠️  SmythOS Web Risk Monitor web search failed, using fallback")
                                return self._generate_fallback_risk_analysis(question, processing_time)
            
            # SmythOS returns data in a specific format: {"id": ..., "name": ..., "result": {"Output": "..."}}
            # Extract the actual output from the nested structure
            if "result" in response_data and "Output" in response_data["result"]:
                import json
                try:
                    actual_output = json.loads(response_data["result"]["Output"])
                    
                    # Add processing metadata
                    actual_output["_metadata"] = {
                        "processing_time": processing_time,
                        "agent_version": "web-risk-monitor-v1",
                        "request_timestamp": start_time,
                        "smythos_id": response_data.get("id"),
                        "smythos_name": response_data.get("name")
                    }
                    
                    return actual_output
                except (json.JSONDecodeError, TypeError):
                    # If JSON parsing fails, use fallback
                    print("⚠️  SmythOS Web Risk Monitor returned invalid JSON, using fallback")
                    return self._generate_fallback_risk_analysis(question, processing_time)
            else:
                # Fallback: return raw response with metadata
                response_data["_metadata"] = {
                    "processing_time": processing_time,
                    "agent_version": "web-risk-monitor-v1",
                    "request_timestamp": start_time
                }
                return response_data
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            else:
                print(f"⚠️  SmythOS Web Risk Monitor failed: {str(e)}, using fallback")
                return self._generate_fallback_risk_analysis(question, time.time() - start_time)
    
    def _generate_fallback_risk_analysis(self, question: str, processing_time: float) -> Dict[str, Any]:
        """
        Generate a fallback risk analysis when the SmythOS agent fails
        
        Args:
            question: Original question
            processing_time: Time taken for processing
            
        Returns:
            Dict[str, Any]: Fallback risk analysis
        """
        # Extract key terms from the question for intelligent fallback
        question_lower = question.lower()
        
        # Determine route based on question content
        if "suez" in question_lower:
            route = {
                "origin": ["Shanghai, China", "Singapore", "South Korea"],
                "transit": ["Suez Canal", "Red Sea", "Mediterranean Sea"],
                "destination": ["Rotterdam, Netherlands", "Hamburg, Germany", "Antwerp, Belgium"]
            }
            risks = [
                {
                    "id": "RISK_001",
                    "type": "geopolitical",
                    "severity": "high",
                    "title": "Suez Canal Transit Delays",
                    "description": "Increased transit times and potential delays through the Suez Canal affecting global trade routes.",
                    "locations_affected": ["Suez Canal", "Red Sea"],
                    "impacted_route_segments": ["transit"],
                    "last_update": datetime.now().isoformat(),
                    "sources": [{"name": "Maritime Intelligence", "url": "https://example.com"}],
                    "confidence": 0.85,
                    "typical_impact_window": "24-48 hours"
                },
                {
                    "id": "RISK_002",
                    "type": "operational",
                    "severity": "medium",
                    "title": "Increased Shipping Costs",
                    "description": "Higher insurance premiums and fuel costs due to route disruptions and longer transit times.",
                    "locations_affected": ["Global shipping lanes"],
                    "impacted_route_segments": ["origin", "transit", "destination"],
                    "last_update": datetime.now().isoformat(),
                    "sources": [{"name": "Shipping Industry Report", "url": "https://example.com"}],
                    "confidence": 0.75,
                    "typical_impact_window": "1-2 weeks"
                }
            ]
        elif "china" in question_lower and "usa" in question_lower:
            route = {
                "origin": ["Shanghai, China", "Shenzhen, China"],
                "transit": ["Pacific Ocean"],
                "destination": ["Los Angeles, USA", "Long Beach, USA"]
            }
            risks = [
                {
                    "id": "RISK_001",
                    "type": "geopolitical",
                    "severity": "high",
                    "title": "Trade Tensions Impact",
                    "description": "Ongoing trade tensions affecting shipping routes and customs processing times.",
                    "locations_affected": ["China", "USA"],
                    "impacted_route_segments": ["origin", "destination"],
                    "last_update": datetime.now().isoformat(),
                    "sources": [{"name": "Trade Intelligence", "url": "https://example.com"}],
                    "confidence": 0.80,
                    "typical_impact_window": "2-4 weeks"
                }
            ]
        else:
            # Generic fallback
            route = {
                "origin": ["Global shipping hubs"],
                "transit": ["Major shipping lanes"],
                "destination": ["Global destinations"]
            }
            risks = [
                {
                    "id": "RISK_001",
                    "type": "operational",
                    "severity": "medium",
                    "title": "General Supply Chain Risks",
                    "description": "Standard supply chain risks including weather, port congestion, and operational delays.",
                    "locations_affected": ["Global shipping routes"],
                    "impacted_route_segments": ["transit"],
                    "last_update": datetime.now().isoformat(),
                    "sources": [{"name": "Supply Chain Intelligence", "url": "https://example.com"}],
                    "confidence": 0.70,
                    "typical_impact_window": "24-72 hours"
                }
            ]
        
        return {
            "query": question,
            "generated_at": datetime.now().isoformat(),
            "route": route,
            "risk_profile": {
                "critical": len([r for r in risks if r["severity"] == "critical"]),
                "high": len([r for r in risks if r["severity"] == "high"]),
                "medium": len([r for r in risks if r["severity"] == "medium"]),
                "low": len([r for r in risks if r["severity"] == "low"])
            },
            "risks": risks,
            "_metadata": {
                "processing_time": processing_time,
                "agent_version": "fallback-risk-analysis-v1",
                "request_timestamp": time.time() - processing_time,
                "fallback_reason": "SmythOS Web Risk Monitor unavailable or hit limits",
                "format_used": "fallback"
            }
        }
    
    async def generate_action_plan(self, route_risks: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call Action Plan Agent to generate action plan
        
        Args:
            route_risks: Risk analysis data from Web Risk Monitor
            
        Returns:
            Dict[str, Any]: Action plan response
        """
        start_time = time.time()
        
        # Quick fallback: If we know the SmythOS agent is problematic, use fallback immediately
        # This prevents slow logins and background processing delays
        try:
            # Try one quick test to see if the agent is working
            test_data = {"question": "test"}
            async with httpx.AsyncClient(timeout=5) as client:
                response = await client.post(
                    self.action_plan_agent_url,
                    json=test_data,
                    headers={"Content-Type": "application/json"}
                )
                if response.status_code == 200:
                    result = response.json()
                    if "result" in result and "_error" in result["result"]:
                        # Agent is returning errors, use fallback immediately
                        print("🚀 Using immediate fallback - SmythOS Action Plan Agent known to be problematic")
                        return self._generate_fallback_action_plan(route_risks, time.time() - start_time)
        except:
            # If test fails, use fallback immediately
            print("🚀 Using immediate fallback - SmythOS Action Plan Agent unreachable")
            return self._generate_fallback_action_plan(route_risks, time.time() - start_time)
        
        # If test passed, try the full workflow
        # Try different data formats to find what works
        # Start with the most likely to work format first
        request_formats = [
            {"question": f"Generate action plan for: {route_risks.get('query', 'supply chain risks')}"},  # Question format (most likely to work)
            {"route_risks": route_risks},  # Original format
            {"risks": route_risks.get("risks", [])},  # Just risks array
        ]
        
        for i, request_data in enumerate(request_formats):
            try:
                # Use shorter timeout for Action Plan Agent to prevent hanging
                response_data = await self._make_request_with_timeout(
                    self.action_plan_agent_url,
                    request_data,
                    f"Action Plan Agent (format {i+1})",
                    timeout=15  # 15 seconds timeout
                )
                
                processing_time = time.time() - start_time
                
                # Check if we got an error response
                if "result" in response_data and "_error" in response_data["result"]:
                    print(f"⚠️  Action Plan Agent returned error with format {i+1}: {response_data['result']['_error']}")
                    if i < len(request_formats) - 1:
                        continue  # Try next format
                    else:
                        # All formats failed, generate fallback action plan immediately
                        return self._generate_fallback_action_plan(route_risks, processing_time)
                
                # SmythOS returns data in a specific format: {"id": ..., "name": ..., "result": {"Output": "..."}}
                # Extract the actual output from the nested structure
                if "result" in response_data and "Output" in response_data["result"]:
                    import json
                    try:
                        actual_output = json.loads(response_data["result"]["Output"])
                    except (json.JSONDecodeError, TypeError):
                        # If parsing fails, use the raw output
                        actual_output = response_data["result"]["Output"]
                    
                    # Add processing metadata
                    if isinstance(actual_output, dict):
                        actual_output["_metadata"] = {
                            "processing_time": processing_time,
                            "agent_version": "action-plan-v1",
                            "request_timestamp": start_time,
                            "smythos_id": response_data.get("id"),
                            "smythos_name": response_data.get("name"),
                            "format_used": f"format_{i+1}"
                        }
                        return actual_output
                    else:
                        # If not a dict, wrap it
                        return {
                            "action_plan": actual_output,
                            "_metadata": {
                                "processing_time": processing_time,
                                "agent_version": "action-plan-v1",
                                "request_timestamp": start_time,
                                "smythos_id": response_data.get("id"),
                                "smythos_name": response_data.get("name"),
                                "format_used": f"format_{i+1}"
                            }
                        }
                else:
                    # Fallback: return raw response with metadata
                    response_data["_metadata"] = {
                        "processing_time": processing_time,
                        "agent_version": "action-plan-v1",
                        "request_timestamp": start_time,
                        "format_used": f"format_{i+1}"
                    }
                    return response_data
                    
            except Exception as e:
                print(f"⚠️  Action Plan Agent failed with format {i+1}: {str(e)}")
                if i < len(request_formats) - 1:
                    continue  # Try next format
                else:
                    # All formats failed, generate fallback action plan
                    return self._generate_fallback_action_plan(route_risks, time.time() - start_time)
        
        # This should not be reached, but just in case
        return self._generate_fallback_action_plan(route_risks, time.time() - start_time)
    
    def _generate_fallback_action_plan(self, route_risks: Dict[str, Any], processing_time: float) -> Dict[str, Any]:
        """
        Generate a fallback action plan when the SmythOS agent fails
        
        Args:
            route_risks: Risk analysis data
            processing_time: Time taken for processing
            
        Returns:
            Dict[str, Any]: Fallback action plan
        """
        # Safely extract risk data with proper error handling
        try:
            risks = route_risks.get("risks", [])
            if not isinstance(risks, list):
                risks = []
        except (TypeError, AttributeError):
            risks = []
        
        try:
            risk_profile = route_risks.get("summary", {}).get("overall_risk_profile", {})
            if not isinstance(risk_profile, dict):
                risk_profile = {}
        except (TypeError, AttributeError):
            risk_profile = {}
        
        # Generate basic action plan based on risk data
        actions = []
        
        if risk_profile.get("critical", 0) > 0:
            actions.append({
                "id": "ACTION_001",
                "priority": "critical",
                "action": "Immediate Route Adjustment",
                "description": "Redirect shipments to alternative routes due to critical risks",
                "estimated_impact": "high",
                "implementation_time": "immediate"
            })
        
        if risk_profile.get("high", 0) > 0:
            actions.append({
                "id": "ACTION_002", 
                "priority": "high",
                "action": "Enhanced Monitoring",
                "description": "Increase monitoring frequency and implement real-time tracking",
                "estimated_impact": "medium",
                "implementation_time": "24 hours"
            })
        
        if risk_profile.get("medium", 0) > 0:
            actions.append({
                "id": "ACTION_003",
                "priority": "medium", 
                "action": "Documentation Preparation",
                "description": "Prepare contingency documentation and alternative supplier contacts",
                "estimated_impact": "medium",
                "implementation_time": "48 hours"
            })
        
        # Default action if no specific risks
        if not actions:
            actions.append({
                "id": "ACTION_001",
                "priority": "medium",
                "action": "Standard Monitoring",
                "description": "Continue standard supply chain monitoring procedures",
                "estimated_impact": "low",
                "implementation_time": "immediate"
            })
        
        return {
            "action_plan": {
                "query": route_risks.get("query", "Supply chain risk mitigation"),
                "generated_at": datetime.now().isoformat(),
                "summary": {
                    "total_actions": len(actions),
                    "priority_focus": f"Risk mitigation for {len(risks)} identified risks",
                    "estimated_implementation_time": "24-48 hours"
                },
                "recommended_actions": actions
            },
            "_metadata": {
                "processing_time": processing_time,
                "agent_version": "fallback-action-plan-v1",
                "request_timestamp": time.time() - processing_time,
                "fallback_reason": "SmythOS Action Plan Agent unavailable",
                "format_used": "fallback"
            }
        }
    
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
                # Try base URL for health check
                base_url = self.web_risk_monitor_url.replace("/api/analyze_route_risks", "")
                response = await client.get(base_url)
                health_status["web_risk_monitor"] = "available" if response.status_code < 500 else "unavailable"
        except:
            health_status["web_risk_monitor"] = "unavailable"
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                # Try base URL for health check
                base_url = self.action_plan_agent_url.replace("/api/generate_action_plan", "")
                response = await client.get(base_url)
                health_status["action_plan_agent"] = "available" if response.status_code < 500 else "unavailable"
        except:
            health_status["action_plan_agent"] = "unavailable"
        
        return health_status
