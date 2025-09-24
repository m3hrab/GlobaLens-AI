# GlobaLens AI API Examples

Complete examples for testing and integrating with the GlobaLens AI backend.

## 🚀 Quick Start

1. **Start the backend server**
   ```bash
   cd backend/
   ./start.sh
   # Or with Docker:
   # docker-compose up --build
   ```

2. **Access API documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## 🔐 Authentication Examples

### User Registration
```bash
curl -X POST "http://localhost:8000/api/v1/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john.doe@example.com",
       "password": "securepass123"
     }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "is_active": true,
    "created_at": "2025-09-24T10:30:00.000Z"
  }
}
```

### User Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john.doe@example.com",
       "password": "securepass123"
     }'
```

### Get Current User
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Query Management Examples

### Create Risk Analysis Query
```bash
curl -X POST "http://localhost:8000/api/v1/query/" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "question": "What are the current risks for shipping routes from Shanghai to Los Angeles ports due to weather and geopolitical tensions?"
     }'
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "question": "What are the current risks for shipping routes from Shanghai to Los Angeles ports due to weather and geopolitical tensions?",
  "route_data": null,
  "status": "pending",
  "created_at": "2025-09-24T10:35:00.000Z",
  "updated_at": null
}
```

### Check Query Status
```bash
curl -X GET "http://localhost:8000/api/v1/query/1" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (after processing):**
```json
{
  "id": 1,
  "user_id": 1,
  "question": "What are the current risks for shipping routes from Shanghai to Los Angeles ports due to weather and geopolitical tensions?",
  "route_data": {
    "origin_ports": ["Shanghai Port", "Ningbo-Zhoushan"],
    "transit": ["Taiwan Strait", "Pacific Ocean"],
    "destination_ports": ["Port of Los Angeles", "Port of Long Beach"]
  },
  "status": "completed",
  "created_at": "2025-09-24T10:35:00.000Z",
  "updated_at": "2025-09-24T10:36:15.000Z"
}
```

### Get Query History
```bash
curl -X GET "http://localhost:8000/api/v1/query/?page=1&page_size=10" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📈 Report Management Examples

### Get Risk Analysis Report
```bash
curl -X GET "http://localhost:8000/api/v1/report/1/risk-analysis" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Sample Response:**
```json
{
  "query_id": 1,
  "report_id": 1,
  "summary": {
    "route": {
      "origin_ports": ["Shanghai Port", "Ningbo-Zhoushan"],
      "transit": ["Taiwan Strait", "Pacific Ocean"],
      "destination_ports": ["Port of Los Angeles", "Port of Long Beach"]
    },
    "overall_risk_profile": {
      "critical": 1,
      "high": 2,
      "medium": 3,
      "low": 1
    }
  },
  "risks": [
    {
      "id": "RISK_001",
      "type": "weather",
      "severity": "critical",
      "title": "Typhoon Approaching Taiwan Strait",
      "description": "Typhoon Koinu is tracking toward the Taiwan Strait with sustained winds of 150 mph, expected to impact shipping lanes for 48-72 hours.",
      "locations_affected": ["Taiwan Strait", "East China Sea"],
      "impacted_route_segments": ["transit"],
      "last_update": "2025-09-24T09:00:00.000Z",
      "sources": [
        {
          "name": "Japan Meteorological Agency",
          "url": "https://www.jma.go.jp/bosai/forecast/"
        }
      ],
      "confidence": 0.95,
      "typical_impact_window": "48-72 hours"
    },
    {
      "id": "RISK_002",
      "type": "geopolitical",
      "severity": "high",
      "title": "US-China Trade Tensions Escalating",
      "description": "Recent diplomatic incidents may lead to increased customs inspections and potential shipping delays at US West Coast ports.",
      "locations_affected": ["Port of Los Angeles", "Port of Long Beach"],
      "impacted_route_segments": ["destination"],
      "last_update": "2025-09-24T08:30:00.000Z",
      "sources": [
        {
          "name": "Reuters",
          "url": "https://reuters.com/world/trade-tensions-update"
        }
      ],
      "confidence": 0.78,
      "typical_impact_window": "2-4 weeks"
    }
  ],
  "recommended_actions": [
    {
      "action": "Monitor typhoon trajectory hourly",
      "details": "Track Typhoon Koinu's path and adjust departure schedules accordingly. Consider delaying shipments by 48-72 hours."
    },
    {
      "action": "Prepare alternative documentation",
      "details": "Ensure all trade documentation is complete and consider expedited customs processing to mitigate potential delays."
    }
  ],
  "top_sources": [
    {
      "name": "Japan Meteorological Agency",
      "url": "https://www.jma.go.jp/bosai/forecast/"
    },
    {
      "name": "Shanghai Maritime Safety Administration",
      "url": "https://www.msa.gov.cn/"
    }
  ],
  "confidence_score": 0.89,
  "generated_at": "2025-09-24T10:36:15.000Z"
}
```

### Generate Action Plan
```bash
curl -X POST "http://localhost:8000/api/v1/report/1/action-plan" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Initial Response (processing):**
```json
{
  "query_id": 1,
  "report_id": 0,
  "summary": {
    "status": "processing"
  },
  "prioritized_actions": [],
  "generated_at": "2025-09-24T10:36:15.000Z"
}
```

### Get Action Plan Report
```bash
curl -X GET "http://localhost:8000/api/v1/report/1/action-plan" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Sample Response:**
```json
{
  "query_id": 1,
  "report_id": 2,
  "summary": {
    "total_risks": {
      "critical": 1,
      "high": 2,
      "medium": 3,
      "low": 1
    },
    "top_affected_locations": ["Taiwan Strait", "Port of Los Angeles", "Shanghai Port"],
    "priority_focus": "Weather-related critical risks requiring immediate attention and route adjustments"
  },
  "prioritized_actions": [
    {
      "priority": 1,
      "action": "Immediate Route Adjustment",
      "description": "Delay shipments by 72 hours and consider alternative routing through southern shipping lanes to avoid typhoon impact zone.",
      "target_risks": ["RISK_001"],
      "estimated_impact": "high",
      "sources": [
        {
          "name": "Japan Meteorological Agency",
          "url": "https://www.jma.go.jp/bosai/forecast/"
        }
      ]
    },
    {
      "priority": 2,
      "action": "Enhanced Documentation Preparation",
      "description": "Prepare comprehensive trade documentation and engage customs brokers for expedited processing to mitigate potential inspection delays.",
      "target_risks": ["RISK_002"],
      "estimated_impact": "medium",
      "sources": [
        {
          "name": "US Customs and Border Protection",
          "url": "https://www.cbp.gov/"
        }
      ]
    },
    {
      "priority": 3,
      "action": "Continuous Weather Monitoring",
      "description": "Establish 6-hour monitoring schedule for weather updates and maintain direct communication with vessel operators.",
      "target_risks": ["RISK_001"],
      "estimated_impact": "high",
      "sources": [
        {
          "name": "National Weather Service",
          "url": "https://www.weather.gov/"
        }
      ]
    }
  ],
  "confidence_score": 0.92,
  "generated_at": "2025-09-24T10:38:30.000Z"
}
```

### Get All Reports for a Query
```bash
curl -X GET "http://localhost:8000/api/v1/report/1/reports" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏥 Health Check Examples

### Basic Health Check
```bash
curl -X GET "http://localhost:8000/health"
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "agents": {
    "web_risk_monitor": "available",
    "action_plan": "available"
  }
}
```

### Simple Status Check
```bash
curl -X GET "http://localhost:8000/"
```

**Response:**
```json
{
  "message": "GlobaLens AI Backend is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

## 🐍 Python Client Example

```python
import asyncio
import httpx

class GlobaLensClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.token = None
    
    async def signup(self, name: str, email: str, password: str):
        """Register a new user"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/signup",
                json={"name": name, "email": email, "password": password}
            )
            if response.status_code == 201:
                data = response.json()
                self.token = data["access_token"]
                return data
            response.raise_for_status()
    
    async def login(self, email: str, password: str):
        """Login existing user"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/auth/login",
                json={"email": email, "password": password}
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data["access_token"]
                return data
            response.raise_for_status()
    
    async def create_query(self, question: str):
        """Create a risk analysis query"""
        headers = {"Authorization": f"Bearer {self.token}"}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/query/",
                json={"question": question},
                headers=headers
            )
            if response.status_code == 201:
                return response.json()
            response.raise_for_status()
    
    async def get_risk_analysis(self, query_id: int):
        """Get risk analysis report"""
        headers = {"Authorization": f"Bearer {self.token}"}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v1/report/{query_id}/risk-analysis",
                headers=headers
            )
            if response.status_code == 200:
                return response.json()
            response.raise_for_status()

# Usage example
async def main():
    client = GlobaLensClient()
    
    # Register or login
    await client.signup("Test User", "test@example.com", "password123")
    
    # Create a query
    query = await client.create_query(
        "What are the risks for shipping from Shanghai to Los Angeles?"
    )
    print(f"Created query: {query['id']}")
    
    # Wait a moment for processing, then get results
    await asyncio.sleep(10)
    
    try:
        risk_analysis = await client.get_risk_analysis(query['id'])
        print(f"Found {len(risk_analysis['risks'])} risks")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            print("Risk analysis still processing...")

if __name__ == "__main__":
    asyncio.run(main())
```

## 🧪 Testing Script

Save this as `test_full_workflow.py`:

```python
#!/usr/bin/env python3
import asyncio
import httpx
import json
from datetime import datetime

async def test_complete_workflow():
    """Test the complete GlobaLens AI workflow"""
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        print("🌐 Testing GlobaLens AI Complete Workflow")
        print("=" * 50)
        
        # 1. User Registration
        user_data = {
            "name": "Test User",
            "email": f"test_{int(datetime.now().timestamp())}@example.com",
            "password": "testpass123"
        }
        
        response = await client.post(f"{base_url}/api/v1/auth/signup", json=user_data)
        assert response.status_code == 201
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ User registration successful")
        
        # 2. Create Query
        query_data = {
            "question": "What are the current shipping risks from Shanghai to Los Angeles due to weather, port congestion, and geopolitical factors?"
        }
        
        response = await client.post(f"{base_url}/api/v1/query/", json=query_data, headers=headers)
        assert response.status_code == 201
        query_id = response.json()["id"]
        print(f"✅ Query created with ID: {query_id}")
        
        # 3. Wait and check query status
        print("⏳ Waiting for risk analysis to complete...")
        for _ in range(30):  # Wait up to 30 seconds
            await asyncio.sleep(1)
            response = await client.get(f"{base_url}/api/v1/query/{query_id}", headers=headers)
            status = response.json()["status"]
            if status == "completed":
                print("✅ Risk analysis completed")
                break
            elif status == "failed":
                print("❌ Risk analysis failed")
                return
        
        # 4. Get Risk Analysis
        try:
            response = await client.get(f"{base_url}/api/v1/report/{query_id}/risk-analysis", headers=headers)
            if response.status_code == 200:
                risk_data = response.json()
                print(f"✅ Risk analysis retrieved: {len(risk_data['risks'])} risks found")
                print(f"   Overall risk profile: {risk_data['summary']['overall_risk_profile']}")
            else:
                print("⏳ Risk analysis still processing...")
        except Exception as e:
            print(f"⚠️  Risk analysis not ready: {e}")
        
        # 5. Generate Action Plan
        try:
            response = await client.post(f"{base_url}/api/v1/report/{query_id}/action-plan", headers=headers)
            print("✅ Action plan generation started")
            
            # Wait for action plan
            print("⏳ Waiting for action plan to complete...")
            for _ in range(20):
                await asyncio.sleep(1)
                try:
                    response = await client.get(f"{base_url}/api/v1/report/{query_id}/action-plan", headers=headers)
                    if response.status_code == 200:
                        action_data = response.json()
                        if action_data.get("prioritized_actions"):
                            print(f"✅ Action plan completed: {len(action_data['prioritized_actions'])} actions")
                            break
                except:
                    continue
        except Exception as e:
            print(f"⚠️  Action plan generation: {e}")
        
        # 6. Get Complete Report
        try:
            response = await client.get(f"{base_url}/api/v1/report/{query_id}/reports", headers=headers)
            if response.status_code == 200:
                complete_data = response.json()
                print("✅ Complete report retrieved")
                print(f"   Available reports: {list(complete_data['reports'].keys())}")
        except Exception as e:
            print(f"⚠️  Complete report: {e}")
        
        print("\n🎉 Workflow test completed successfully!")
        print("🔗 View full API documentation at: http://localhost:8000/docs")

if __name__ == "__main__":
    try:
        asyncio.run(test_complete_workflow())
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
```

Run with: `python3 test_full_workflow.py`

## 🌐 Frontend Integration

For Next.js frontend integration:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface User {
  id: number
  name: string
  email: string
  is_active: boolean
  created_at: string
}

export interface RiskAnalysis {
  query_id: number
  report_id: number
  summary: {
    route: {
      origin_ports: string[]
      transit: string[]
      destination_ports: string[]
    }
    overall_risk_profile: {
      critical: number
      high: number
      medium: number
      low: number
    }
  }
  risks: Array<{
    id: string
    type: string
    severity: string
    title: string
    description: string
    locations_affected: string[]
    confidence: number
  }>
}

class GlobaLensAPI {
  private token: string | null = null

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) throw new Error('Login failed')
    
    const data = await response.json()
    this.token = data.access_token
    return { user: data.user, token: data.access_token }
  }

  async createQuery(question: string): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ question })
    })
    
    if (!response.ok) throw new Error('Query creation failed')
    return response.json()
  }

  async getRiskAnalysis(queryId: number): Promise<RiskAnalysis> {
    const response = await fetch(`${API_BASE_URL}/api/v1/report/${queryId}/risk-analysis`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    })
    
    if (!response.ok) throw new Error('Risk analysis not available')
    return response.json()
  }
}

export const api = new GlobaLensAPI()
```

This comprehensive API documentation provides everything needed to integrate with and test the GlobaLens AI backend system!
