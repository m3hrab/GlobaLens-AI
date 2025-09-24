#!/usr/bin/env python3
"""
Check the status of the query we just created
"""

import asyncio
import httpx
import json

BACKEND_URL = "http://localhost:8000"

async def check_latest_query():
    """Check the status of the latest query"""
    
    print("🔍 Checking latest query status...")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Login to get token
            login_data = {
                "email": "test@example.com",
                "password": "testpass123"
            }
            
            login_response = await client.post(f"{BACKEND_URL}/api/v1/auth/login", json=login_data)
            if login_response.status_code == 200:
                token_data = login_response.json()
                access_token = token_data["access_token"]
                headers = {"Authorization": f"Bearer {access_token}"}
                
                # Get query history to find the latest query
                history_response = await client.get(f"{BACKEND_URL}/api/v1/query/", headers=headers)
                if history_response.status_code == 200:
                    history_data = history_response.json()
                    
                    if history_data.get("items"):
                        latest_query = history_data["items"][0]
                        query_id = latest_query["id"]
                        
                        print(f"📊 Latest Query ID: {query_id}")
                        print(f"📊 Status: {latest_query.get('status', 'unknown')}")
                        print(f"📊 Question: {latest_query.get('question', 'N/A')}")
                        print(f"📊 Created: {latest_query.get('created_at', 'N/A')}")
                        
                        # Get detailed query info
                        detail_response = await client.get(f"{BACKEND_URL}/api/v1/query/{query_id}", headers=headers)
                        if detail_response.status_code == 200:
                            detail_data = detail_response.json()
                            
                            if detail_data.get("risk_analysis"):
                                print("\n✅ Risk Analysis Data Found!")
                                risk_data = detail_data["risk_analysis"]
                                
                                # Show key information
                                if "query" in risk_data:
                                    print(f"   Query: {risk_data['query']}")
                                
                                if "risk_profile" in risk_data:
                                    risk_profile = risk_data["risk_profile"]
                                    print(f"   Risk Profile: Critical={risk_profile.get('critical', 0)}, High={risk_profile.get('high', 0)}, Medium={risk_profile.get('medium', 0)}, Low={risk_profile.get('low', 0)}")
                                
                                if "risks" in risk_data and isinstance(risk_data["risks"], list):
                                    print(f"   Total Risks Found: {len(risk_data['risks'])}")
                                    if risk_data["risks"]:
                                        first_risk = risk_data["risks"][0]
                                        print(f"   First Risk: {first_risk.get('title', 'N/A')} ({first_risk.get('severity', 'N/A')})")
                                
                                if "_metadata" in risk_data:
                                    metadata = risk_data["_metadata"]
                                    print(f"   Processing Time: {metadata.get('processing_time', 'N/A')}s")
                                    print(f"   SmythOS ID: {metadata.get('smythos_id', 'N/A')}")
                            
                            if detail_data.get("action_plan"):
                                print("\n✅ Action Plan Data Found!")
                                action_data = detail_data["action_plan"]
                                
                                if "_metadata" in action_data:
                                    metadata = action_data["_metadata"]
                                    print(f"   Processing Time: {metadata.get('processing_time', 'N/A')}s")
                                    print(f"   SmythOS ID: {metadata.get('smythos_id', 'N/A')}")
                                    
                                # Check if there's actual action plan content
                                if "action_plan" in action_data:
                                    print(f"   Action Plan Content: {str(action_data['action_plan'])[:200]}...")
                        
                        else:
                            print(f"❌ Could not get query details: {detail_response.status_code}")
                    else:
                        print("❌ No queries found in history")
                else:
                    print(f"❌ Could not get query history: {history_response.status_code}")
            else:
                print(f"❌ Login failed: {login_response.status_code}")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(check_latest_query())
