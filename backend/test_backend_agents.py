#!/usr/bin/env python3
"""
Test the backend API with updated SmythOS agent integration
"""

import asyncio
import httpx
import json

BACKEND_URL = "http://localhost:8000"

async def test_backend_agents():
    """Test the backend with SmythOS agents"""
    
    print("🔍 Testing Backend with SmythOS Agents...")
    print("=" * 50)
    
    # First, check health
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            print("1. Testing backend health...")
            response = await client.get(f"{BACKEND_URL}/health")
            print(f"✅ Health status: {response.status_code}")
            health_data = response.json()
            print(f"   Agents: {health_data}")
            
            # Test authentication (signup/login)
            print("\n2. Testing authentication...")
            
            # Signup
            signup_data = {
                "name": "Test User",
                "email": "test@example.com",
                "password": "testpass123"
            }
            
            signup_response = await client.post(f"{BACKEND_URL}/api/v1/auth/signup", json=signup_data)
            if signup_response.status_code in [201, 400]:  # 400 might be "user exists"
                print("✅ Signup endpoint working")
            
            # Login
            login_data = {
                "email": "test@example.com",
                "password": "testpass123"
            }
            
            login_response = await client.post(f"{BACKEND_URL}/api/v1/auth/login", json=login_data)
            if login_response.status_code == 200:
                print("✅ Login endpoint working")
                token_data = login_response.json()
                access_token = token_data["access_token"]
                
                # Test query endpoint with SmythOS agents
                print("\n3. Testing query endpoint with SmythOS agents...")
                print("   (This will call your actual SmythOS agents - costs API credits!)")
                
                headers = {"Authorization": f"Bearer {access_token}"}
                query_data = {
                    "question": "What are supply chain risks for electronics from Taiwan to Germany?"
                }
                
                query_response = await client.post(
                    f"{BACKEND_URL}/api/v1/query/",
                    json=query_data,
                    headers=headers
                )
                
                print(f"📊 Query status: {query_response.status_code}")
                if query_response.status_code == 201:
                    print("✅ Query endpoint working with SmythOS agents!")
                    result = query_response.json()
                    print(f"   Query ID: {result.get('id')}")
                    print(f"   Status: {result.get('status')}")
                    
                    # Check if we have risk analysis data
                    if result.get("risk_analysis"):
                        print("✅ Risk analysis data received from Web Risk Monitor!")
                        risk_data = result["risk_analysis"]
                        if "_metadata" in risk_data:
                            metadata = risk_data["_metadata"]
                            print(f"   Processing time: {metadata.get('processing_time', 'N/A')}s")
                            print(f"   SmythOS ID: {metadata.get('smythos_id', 'N/A')}")
                    
                    # Check if we have action plan data  
                    if result.get("action_plan"):
                        print("✅ Action plan data received from Action Plan Agent!")
                        
                else:
                    print(f"❌ Query failed: {query_response.text}")
                    
                # Test query history
                print("\n4. Testing query history...")
                history_response = await client.get(f"{BACKEND_URL}/api/v1/query/", headers=headers)
                if history_response.status_code == 200:
                    print("✅ Query history endpoint working")
                    history_data = history_response.json()
                    print(f"   Total queries: {history_data.get('total', 0)}")
                    
            else:
                print(f"❌ Login failed: {login_response.text}")
                
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")

if __name__ == "__main__":
    print("🚀 IMPORTANT: This test will call your SmythOS agents and cost API credits!")
    print("   Make sure your backend is running first.")
    print("   Press Ctrl+C to cancel if you don't want to spend credits.\n")
    
    try:
        asyncio.run(test_backend_agents())
    except KeyboardInterrupt:
        print("\n⏹️  Test cancelled by user")
    
    print("\n🎉 Backend agent testing complete!")
