"""
Configuration settings for GlobaLens AI Backend
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    app_name: str = "GlobaLens AI Backend"
    debug: bool = False
    
    # Security
    secret_key: str = "globallens-ai-hackathon-secret-key-2025"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Database
    database_url: str = "sqlite:///./globallens.db"
    
    # SmythOS Agent URLs - Updated with deployed agents and correct endpoints
    web_risk_monitor_url: str = "https://cmfx0m6pd1z1o23quzznwufz2.agent.pa.smyth.ai/api/analyze_route_risks"
    action_plan_agent_url: str = "https://cmfxm82uq3jcb2py5aawkp62d.agent.pa.smyth.ai/api/generate_action_plan"
    
    # HTTP Client Settings
    agent_timeout: int = 60
    agent_retries: int = 3
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
