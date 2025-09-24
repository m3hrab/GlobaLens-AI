#!/usr/bin/env python3
"""
Test the fixed workflow with proper background processing
"""

import asyncio
import httpx
import json
import time

BACKEND_URL = "http://localhost:8000"

async def test_fixed_workflow():
    """Test the complete workflow with fixed background processing"""
    
    print("🚀 Testing FIXED Query Workflow with SmythOS Agents")
    print("💰 This will cost API credits - testing with minimal queries")
    print("=" * 60)
    
    async with httpx.AsyncClient(timeout=120) as client:
        
        # Step 1: Create user and login
        print("\n1️⃣ Setting up user account...")
        user_email = f"test_fixed_{int(time.time())}@example.com"
        
        # Signup
        signup_data = {"name": "Test User", "email": user_email, "password": "testpass123"}
        signup_response = await client.post(f"{BACKEND_URL}/api/v1/auth/signup", json=signup_data)
        
        if signup_response.status_code != 201:
            print(f"❌ Signup failed: {signup_response.status_code}")
            return
        
        # Login
        login_data = {"email": user_email, "password": "testpass123"}
        login_response = await client.post(f"{BACKEND_URL}/api/v1/auth/login", json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return
        
        access_token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}
        print("✅ User setup complete")

        # Step 2: Submit a simple test query
        print("\n2️⃣ Submitting test query...")
        query_data = {
            "question": "What are supply chain risks for shipping from Shanghai to New York?"
        }
        
        query_response = await client.post(f"{BACKEND_URL}/api/v1/query/", json=query_data, headers=headers)
        
        if query_response.status_code != 201:
            print(f"❌ Query submission failed: {query_response.status_code}")
            print(f"Error: {query_response.text}")
            return
        
        query_result = query_response.json()
        query_id = query_result["id"]
        print(f"✅ Query submitted with ID: {query_id}")
        print(f"📊 Initial Status: {query_result.get('status')}")

        # Step 3: Wait for processing and check results
        print("\n3️⃣ Waiting for SmythOS agents to process...")
        max_wait = 60  # Maximum wait time in seconds
        wait_interval = 5  # Check every 5 seconds
        
        for i in range(0, max_wait, wait_interval):
            print(f"⏳ Checking status... ({i}s elapsed)")
            
            detail_response = await client.get(f"{BACKEND_URL}/api/v1/query/{query_id}", headers=headers)
            
            if detail_response.status_code == 200:
                detail_data = detail_response.json()
                status = detail_data.get('status', 'unknown')
                print(f"   Status: {status}")
                
                if status == "completed":
                    print("🎉 Processing completed!")
                    
                    # Show risk analysis results
                    if detail_data.get("risk_analysis"):
                        print("\n🔍 RISK ANALYSIS RESULTS:")
                        risk_data = detail_data["risk_analysis"]
                        
                        if "query" in risk_data:
                            print(f"   📝 Query: {risk_data['query']}")
                        
                        if "risk_profile" in risk_data:
                            profile = risk_data["risk_profile"]
                            total = sum(profile.values()) if isinstance(profile, dict) else 0
                            print(f"   ⚠️  Total Risks: {total}")
                            if isinstance(profile, dict):
                                print(f"      🔴 Critical: {profile.get('critical', 0)}")
                                print(f"      🟠 High: {profile.get('high', 0)}")
                                print(f"      🟡 Medium: {profile.get('medium', 0)}")
                                print(f"      🟢 Low: {profile.get('low', 0)}")
                        
                        if "risks" in risk_data and isinstance(risk_data["risks"], list):
                            print(f"   📋 Risk Details: {len(risk_data['risks'])} risks found")
                            for i, risk in enumerate(risk_data["risks"][:2]):  # Show first 2
                                title = risk.get('title', 'N/A')
                                severity = risk.get('severity', 'N/A')
                                print(f"      {i+1}. {title} ({severity})")
                    
                    # Show action plan results
                    if detail_data.get("action_plan"):
                        print("\n📋 ACTION PLAN RESULTS:")
                        action_data = detail_data["action_plan"]
                        
                        if "action_plan" in action_data:
                            plan = str(action_data["action_plan"])
                            print(f"   📝 Plan: {plan[:200]}{'...' if len(plan) > 200 else ''}")
                    
                    break
                    
                elif status == "failed":
                    print("❌ Processing failed!")
                    break
                    
                elif status in ["pending", "processing"]:
                    # Continue waiting
                    await asyncio.sleep(wait_interval)
                    continue
                    
            else:
                print(f"❌ Could not check status: {detail_response.status_code}")
                break
        else:
            print("⏰ Timeout reached - processing may still be ongoing")

        # Step 4: Check query history
        print("\n4️⃣ Checking query history...")
        history_response = await client.get(f"{BACKEND_URL}/api/v1/query/", headers=headers)
        
        if history_response.status_code == 200:
            history_data = history_response.json()
            print(f"✅ Query history retrieved")
            print(f"📊 Total queries: {history_data.get('total', 0)}")
            print(f"📊 Items in response: {len(history_data.get('items', []))}")
            
            if history_data.get('items'):
                latest = history_data['items'][0]
                print(f"📊 Latest query status: {latest.get('status')}")
        else:
            print(f"❌ Could not get history: {history_response.status_code}")

        print("\n🎉 Fixed workflow test completed!")

if __name__ == "__main__":
    print("🚨 This will call your SmythOS agents and cost API credits!")
    print("Press Ctrl+C within 3 seconds to cancel...\n")
    
    try:
        for i in range(3, 0, -1):
            print(f"Starting in {i}...")
            time.sleep(1)
        
        asyncio.run(test_fixed_workflow())
        
    except KeyboardInterrupt:
        print("\n⏹️  Test cancelled!")
    except Exception as e:
        print(f"\n❌ Test error: {str(e)}")
