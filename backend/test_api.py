#!/usr/bin/env python3
"""
GlobaLens AI Backend API Test Script
Tests the main endpoints and workflow
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

async def test_api():
    """Test the complete API workflow"""
    print("🧪 Testing GlobaLens AI Backend API")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Test health check
        print("1. Testing health check...")
        try:
            response = await client.get(f"{BASE_URL}/health")
            print(f"   ✅ Health check: {response.status_code}")
            if response.status_code == 200:
                health_data = response.json()
                print(f"   📊 Status: {health_data.get('status')}")
        except Exception as e:
            print(f"   ❌ Health check failed: {e}")
            return
        
        # Test user registration
        print("\n2. Testing user registration...")
        test_user = {
            "name": "Test User",
            "email": f"test_{datetime.now().timestamp()}@example.com",
            "password": "testpass123"
        }
        
        try:
            response = await client.post(f"{BASE_URL}/api/v1/auth/signup", json=test_user)
            print(f"   ✅ User registration: {response.status_code}")
            if response.status_code == 201:
                signup_data = response.json()
                token = signup_data["access_token"]
                print(f"   🔑 JWT Token received")
            else:
                print(f"   ❌ Registration failed: {response.text}")
                return
        except Exception as e:
            print(f"   ❌ Registration error: {e}")
            return
        
        # Test authentication
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\n3. Testing authentication...")
        try:
            response = await client.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
            print(f"   ✅ Auth verification: {response.status_code}")
            if response.status_code == 200:
                user_data = response.json()
                print(f"   👤 User: {user_data.get('name')} ({user_data.get('email')})")
        except Exception as e:
            print(f"   ❌ Auth verification error: {e}")
        
        # Test query creation
        print("\n4. Testing query creation...")
        test_query = {
            "question": "What are the current risks for shipping routes from Shanghai to Los Angeles ports?"
        }
        
        try:
            response = await client.post(f"{BASE_URL}/api/v1/query/", json=test_query, headers=headers)
            print(f"   ✅ Query creation: {response.status_code}")
            if response.status_code == 201:
                query_data = response.json()
                query_id = query_data["id"]
                print(f"   📝 Query ID: {query_id}")
                print(f"   📊 Status: {query_data.get('status')}")
            else:
                print(f"   ❌ Query creation failed: {response.text}")
                return
        except Exception as e:
            print(f"   ❌ Query creation error: {e}")
            return
        
        # Test query status
        print("\n5. Testing query status...")
        try:
            response = await client.get(f"{BASE_URL}/api/v1/query/{query_id}", headers=headers)
            print(f"   ✅ Query status: {response.status_code}")
            if response.status_code == 200:
                query_data = response.json()
                print(f"   📊 Status: {query_data.get('status')}")
        except Exception as e:
            print(f"   ❌ Query status error: {e}")
        
        # Test query history
        print("\n6. Testing query history...")
        try:
            response = await client.get(f"{BASE_URL}/api/v1/query/", headers=headers)
            print(f"   ✅ Query history: {response.status_code}")
            if response.status_code == 200:
                history_data = response.json()
                print(f"   📜 Total queries: {history_data.get('total_count')}")
        except Exception as e:
            print(f"   ❌ Query history error: {e}")
        
        print("\n" + "=" * 50)
        print("🎉 API Test Complete!")
        print(f"📖 View API docs at: {BASE_URL}/docs")
        print("💡 Note: Risk analysis and action plan generation happen in background")
        print("   Check query status and reports endpoints after a few moments")


if __name__ == "__main__":
    print("Starting API tests...")
    print("Make sure the backend is running at http://localhost:8000")
    print("Run with: python run.py")
    print()
    
    try:
        asyncio.run(test_api())
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
