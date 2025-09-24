#!/usr/bin/env python3
"""
Check the detailed results of the completed query
"""

import asyncio
import httpx
import json

BACKEND_URL = "http://localhost:8000"

async def check_completed_query():
    """Check the detailed results of query ID 6"""
    
    print("🔍 Checking Results of Completed Query...")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=30) as client:
        
        # Login with the test user we just created
        login_data = {
            "email": "test_fixed_1758743661@example.com",  # From the previous test
            "password": "testpass123"
        }
        
        try:
            login_response = await client.post(f"{BACKEND_URL}/api/v1/auth/login", json=login_data)
            if login_response.status_code == 200:
                access_token = login_response.json()["access_token"]
                headers = {"Authorization": f"Bearer {access_token}"}
                
                # Get detailed query information
                query_id = 6
                detail_response = await client.get(f"{BACKEND_URL}/api/v1/query/{query_id}", headers=headers)
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    
                    print(f"📊 Query ID: {detail_data.get('id')}")
                    print(f"📊 Status: {detail_data.get('status')}")
                    print(f"📊 Question: {detail_data.get('question')}")
                    print(f"📊 Created: {detail_data.get('created_at')}")
                    print(f"📊 Updated: {detail_data.get('updated_at')}")
                    
                    # Check reports
                    if detail_data.get("reports"):
                        reports = detail_data["reports"]
                        print(f"\n📋 Reports Found: {len(reports)}")
                        
                        for report in reports:
                            print(f"   📄 Report Type: {report.get('report_type')}")
                            print(f"   📄 Created: {report.get('created_at')}")
                            print(f"   📄 Processing Time: {report.get('processing_time')}s")
                            
                            if report.get('json_report'):
                                json_report = report['json_report']
                                print(f"   📄 Report Content Preview:")
                                print(f"      {str(json_report)[:200]}...")
                    
                    # Check risk analysis
                    if detail_data.get("risk_analysis"):
                        print(f"\n🔍 Risk Analysis Available!")
                        risk_data = detail_data["risk_analysis"]
                        
                        if "query" in risk_data:
                            print(f"   📝 Analyzed: {risk_data['query']}")
                        
                        if "risks" in risk_data and isinstance(risk_data["risks"], list):
                            risks = risk_data["risks"]
                            print(f"   ⚠️  Found {len(risks)} risks")
                            
                            for i, risk in enumerate(risks[:3]):  # Show first 3
                                title = risk.get('title', 'N/A')
                                severity = risk.get('severity', 'N/A')
                                desc = risk.get('desc', risk.get('description', 'No description'))
                                print(f"   {i+1}. {title} ({severity})")
                                print(f"      {desc[:100]}...")
                    
                    # Check action plan
                    if detail_data.get("action_plan"):
                        print(f"\n📋 Action Plan Available!")
                        action_data = detail_data["action_plan"]
                        print(f"   📝 Content: {str(action_data)[:300]}...")
                    
                    if not detail_data.get("risk_analysis") and not detail_data.get("action_plan"):
                        print(f"\n⚠️  No analysis results in query response")
                        print(f"Raw response: {json.dumps(detail_data, indent=2, default=str)}")
                
                else:
                    print(f"❌ Could not get query details: {detail_response.status_code}")
                    print(f"Error: {detail_response.text}")
                    
            else:
                print(f"❌ Login failed: {login_response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(check_completed_query())
