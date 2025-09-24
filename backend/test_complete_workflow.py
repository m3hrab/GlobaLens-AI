#!/usr/bin/env python3
"""
Test the complete query workflow with real SmythOS agents
This will cost API credits, so we'll be very careful!
"""

import asyncio
import httpx
import json
import time

BACKEND_URL = "http://localhost:8000"

async def test_complete_workflow():
    """Test the complete workflow from signup to getting SmythOS results"""
    
    print("🚀 Testing Complete Query Workflow with SmythOS Agents")
    print("⚠️  WARNING: This will consume SmythOS API credits!")
    print("=" * 60)
    
    async with httpx.AsyncClient(timeout=120) as client:  # Extended timeout for AI processing
        
        # Step 1: Test backend health
        print("\n1️⃣ Testing Backend Health...")
        try:
            health_response = await client.get(f"{BACKEND_URL}/health")
            if health_response.status_code == 200:
                health_data = health_response.json()
                print(f"✅ Backend Status: {health_data['status']}")
                print(f"✅ Database: {health_data['database']}")
                print(f"✅ Web Risk Monitor: {health_data['agents']['web_risk_monitor']}")
                print(f"✅ Action Plan Agent: {health_data['agents']['action_plan']}")
            else:
                print(f"❌ Backend health check failed: {health_response.status_code}")
                return
        except Exception as e:
            print(f"❌ Backend health check error: {str(e)}")
            return

        # Step 2: Create user account
        print("\n2️⃣ Creating User Account...")
        user_email = f"test_user_{int(time.time())}@example.com"
        signup_data = {
            "name": "Test User",
            "email": user_email,
            "password": "testpass123"
        }
        
        try:
            signup_response = await client.post(f"{BACKEND_URL}/api/v1/auth/signup", json=signup_data)
            if signup_response.status_code == 201:
                print(f"✅ User created: {user_email}")
            else:
                print(f"❌ Signup failed: {signup_response.status_code} - {signup_response.text}")
                return
        except Exception as e:
            print(f"❌ Signup error: {str(e)}")
            return

        # Step 3: Login to get access token
        print("\n3️⃣ Logging In...")
        login_data = {
            "email": user_email,
            "password": "testpass123"
        }
        
        try:
            login_response = await client.post(f"{BACKEND_URL}/api/v1/auth/login", json=login_data)
            if login_response.status_code == 200:
                token_data = login_response.json()
                access_token = token_data["access_token"]
                headers = {"Authorization": f"Bearer {access_token}"}
                print("✅ Login successful, got access token")
            else:
                print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")
                return
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            return

        # Step 4: Submit a query that will call SmythOS agents
        print("\n4️⃣ Submitting Query to SmythOS Agents...")
        print("💰 This step will cost API credits!")
        
        query_data = {
            "question": "What are the current supply chain risks for shipping electronics from Shenzhen, China to Hamburg, Germany via the Suez Canal?"
        }
        
        try:
            print(f"📤 Sending query: {query_data['question']}")
            query_response = await client.post(
                f"{BACKEND_URL}/api/v1/query/",
                json=query_data,
                headers=headers
            )
            
            print(f"📊 Query Response Status: {query_response.status_code}")
            
            if query_response.status_code == 201:
                query_result = query_response.json()
                query_id = query_result["id"]
                print(f"✅ Query created with ID: {query_id}")
                print(f"📊 Initial Status: {query_result.get('status', 'unknown')}")
                
                # Check if we have immediate results
                if query_result.get("risk_analysis"):
                    print("🎯 Risk analysis data received immediately!")
                if query_result.get("action_plan"):
                    print("🎯 Action plan data received immediately!")
                
            else:
                print(f"❌ Query failed: {query_response.status_code}")
                print(f"Error details: {query_response.text}")
                return
                
        except Exception as e:
            print(f"❌ Query submission error: {str(e)}")
            return

        # Step 5: Wait a moment and check query details
        print("\n5️⃣ Checking Query Results...")
        try:
            # Get detailed query information
            detail_response = await client.get(f"{BACKEND_URL}/api/v1/query/{query_id}", headers=headers)
            
            if detail_response.status_code == 200:
                detail_data = detail_response.json()
                print(f"✅ Query Details Retrieved")
                print(f"📊 Final Status: {detail_data.get('status', 'unknown')}")
                print(f"📊 Question: {detail_data.get('question', 'N/A')}")
                print(f"📊 Created: {detail_data.get('created_at', 'N/A')}")
                
                # Analyze Risk Analysis Results
                if detail_data.get("risk_analysis"):
                    print("\n🔍 RISK ANALYSIS RESULTS:")
                    print("-" * 40)
                    risk_data = detail_data["risk_analysis"]
                    
                    # Show key risk information
                    if "query" in risk_data:
                        print(f"   🎯 Analyzed Query: {risk_data['query']}")
                    
                    if "route" in risk_data:
                        route = risk_data["route"]
                        print(f"   🛣️  Route Origin: {route.get('origin', 'N/A')}")
                        print(f"   🛣️  Route Transit: {route.get('transit', 'N/A')}")
                        print(f"   🛣️  Route Destination: {route.get('destination', 'N/A')}")
                    
                    if "risk_profile" in risk_data:
                        profile = risk_data["risk_profile"]
                        total_risks = profile.get('critical', 0) + profile.get('high', 0) + profile.get('medium', 0) + profile.get('low', 0)
                        print(f"   ⚠️  Total Risks Found: {total_risks}")
                        print(f"      🔴 Critical: {profile.get('critical', 0)}")
                        print(f"      🟠 High: {profile.get('high', 0)}")
                        print(f"      🟡 Medium: {profile.get('medium', 0)}")
                        print(f"      🟢 Low: {profile.get('low', 0)}")
                    
                    if "risks" in risk_data and isinstance(risk_data["risks"], list):
                        risks = risk_data["risks"]
                        print(f"   📋 Risk Details ({len(risks)} risks):")
                        for i, risk in enumerate(risks[:3]):  # Show first 3 risks
                            print(f"      {i+1}. {risk.get('title', 'N/A')} ({risk.get('severity', 'N/A')})")
                            print(f"         {risk.get('desc', risk.get('description', 'No description'))[:100]}...")
                    
                    # Show metadata
                    if "_metadata" in risk_data:
                        meta = risk_data["_metadata"]
                        print(f"   ⏱️  Processing Time: {meta.get('processing_time', 'N/A')} seconds")
                        print(f"   🆔 SmythOS ID: {meta.get('smythos_id', 'N/A')}")
                
                # Analyze Action Plan Results
                if detail_data.get("action_plan"):
                    print("\n📋 ACTION PLAN RESULTS:")
                    print("-" * 40)
                    action_data = detail_data["action_plan"]
                    
                    # Show action plan content
                    if "action_plan" in action_data:
                        plan_content = action_data["action_plan"]
                        print(f"   📝 Plan: {str(plan_content)[:300]}...")
                    
                    # Show metadata
                    if "_metadata" in action_data:
                        meta = action_data["_metadata"]
                        print(f"   ⏱️  Processing Time: {meta.get('processing_time', 'N/A')} seconds")
                        print(f"   🆔 SmythOS ID: {meta.get('smythos_id', 'N/A')}")
                
                if not detail_data.get("risk_analysis") and not detail_data.get("action_plan"):
                    print("⚠️  No analysis results found - query might still be processing")
                
            else:
                print(f"❌ Could not get query details: {detail_response.status_code}")
                
        except Exception as e:
            print(f"❌ Error checking query details: {str(e)}")

        # Step 6: Check query history
        print("\n6️⃣ Checking Query History...")
        try:
            history_response = await client.get(f"{BACKEND_URL}/api/v1/query/", headers=headers)
            if history_response.status_code == 200:
                history_data = history_response.json()
                total_queries = history_data.get("total", 0)
                items = history_data.get("items", [])
                print(f"✅ Query History Retrieved")
                print(f"📊 Total User Queries: {total_queries}")
                print(f"📊 Queries in Response: {len(items)}")
                
                if items:
                    latest = items[0]
                    print(f"📊 Latest Query Status: {latest.get('status', 'unknown')}")
            else:
                print(f"❌ Could not get query history: {history_response.status_code}")
                
        except Exception as e:
            print(f"❌ Error checking history: {str(e)}")

        print("\n🎉 Complete Workflow Test Finished!")
        print("=" * 60)

if __name__ == "__main__":
    print("🚨 IMPORTANT: This test will call your real SmythOS agents!")
    print("🚨 It will consume API credits from your SmythOS account!")
    print("🚨 Press Ctrl+C within 5 seconds to cancel...\n")
    
    try:
        # Give user a chance to cancel
        for i in range(5, 0, -1):
            print(f"Starting in {i}...")
            time.sleep(1)
        
        print("\n🚀 Starting test...\n")
        asyncio.run(test_complete_workflow())
        
    except KeyboardInterrupt:
        print("\n⏹️  Test cancelled by user - no API credits spent!")
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
    
    print("\n✅ Test completed!")
