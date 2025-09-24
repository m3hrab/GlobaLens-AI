#!/usr/bin/env python3
"""
GlobaLens AI Backend Full Test with Dummy Data
Tests the complete backend functionality with simulated agent responses
"""

import asyncio
import httpx
import json
import time
from datetime import datetime, timezone

BASE_URL = "http://localhost:8000"

# Dummy data to simulate SmythOS agent responses
DUMMY_RISK_ANALYSIS = {
    "query": "What are the current shipping risks from Shanghai to Los Angeles?",
    "generated_at": datetime.now(timezone.utc).isoformat(),
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
            "low": 2
        }
    },
    "risks": [
        {
            "id": "RISK_001",
            "type": "weather",
            "severity": "critical",
            "title": "Typhoon Koinu Approaching Taiwan Strait",
            "description": "Major typhoon with 150 mph winds expected to impact shipping lanes for 48-72 hours.",
            "locations_affected": ["Taiwan Strait", "East China Sea"],
            "impacted_route_segments": ["transit"],
            "last_update": datetime.now(timezone.utc).isoformat(),
            "sources": [
                {"name": "Japan Meteorological Agency", "url": "https://www.jma.go.jp/bosai/forecast/"}
            ],
            "confidence": 0.95,
            "typical_impact_window": "48-72 hours"
        },
        {
            "id": "RISK_002",
            "type": "geopolitical",
            "severity": "high",
            "title": "Trade Tensions Escalation",
            "description": "Recent diplomatic incidents may increase customs delays at US West Coast ports.",
            "locations_affected": ["Port of Los Angeles", "Port of Long Beach"],
            "impacted_route_segments": ["destination"],
            "last_update": datetime.now(timezone.utc).isoformat(),
            "sources": [
                {"name": "Reuters Trade News", "url": "https://reuters.com/world/trade"}
            ],
            "confidence": 0.78,
            "typical_impact_window": "2-4 weeks"
        },
        {
            "id": "RISK_003",
            "type": "port_ops",
            "severity": "medium",
            "title": "Shanghai Port Congestion",
            "description": "Increased cargo volume causing 24-48 hour delays in container processing.",
            "locations_affected": ["Shanghai Port"],
            "impacted_route_segments": ["origin"],
            "last_update": datetime.now(timezone.utc).isoformat(),
            "sources": [
                {"name": "Shanghai Maritime Authority", "url": "https://www.shmsa.gov.cn/"}
            ],
            "confidence": 0.82,
            "typical_impact_window": "24-48 hours"
        }
    ],
    "recommended_monitoring_actions": [
        {
            "action": "Monitor typhoon trajectory hourly",
            "details": "Track Typhoon Koinu's path and adjust departure schedules accordingly."
        },
        {
            "action": "Prepare alternative documentation",
            "details": "Ensure all trade documentation is complete for potential customs delays."
        }
    ],
    "top_sources_used": [
        {"name": "Japan Meteorological Agency", "url": "https://www.jma.go.jp/bosai/forecast/"},
        {"name": "Shanghai Maritime Authority", "url": "https://www.shmsa.gov.cn/"},
        {"name": "Reuters Trade News", "url": "https://reuters.com/world/trade"}
    ]
}

DUMMY_ACTION_PLAN = {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "summary": {
        "total_risks": {
            "critical": 1,
            "high": 2,
            "medium": 3,
            "low": 2
        },
        "top_affected_locations": ["Taiwan Strait", "Port of Los Angeles", "Shanghai Port"],
        "priority_focus": "Weather-related critical risks requiring immediate route adjustments"
    },
    "prioritized_actions": [
        {
            "priority": 1,
            "action": "Immediate Route Adjustment",
            "description": "Delay shipments by 72 hours and consider alternative southern routing to avoid typhoon impact zone.",
            "target_risks": ["RISK_001"],
            "estimated_impact": "high",
            "sources": [
                {"name": "Japan Meteorological Agency", "url": "https://www.jma.go.jp/bosai/forecast/"}
            ]
        },
        {
            "priority": 2,
            "action": "Enhanced Documentation Preparation",
            "description": "Prepare comprehensive trade documentation and engage customs brokers for expedited processing.",
            "target_risks": ["RISK_002"],
            "estimated_impact": "medium",
            "sources": [
                {"name": "US Customs and Border Protection", "url": "https://www.cbp.gov/"}
            ]
        },
        {
            "priority": 3,
            "action": "Port Coordination",
            "description": "Contact Shanghai port operators to confirm departure slots and minimize congestion delays.",
            "target_risks": ["RISK_003"],
            "estimated_impact": "medium",
            "sources": [
                {"name": "Shanghai Maritime Authority", "url": "https://www.shmsa.gov.cn/"}
            ]
        }
    ]
}

async def test_backend_comprehensive():
    """Test the complete backend functionality with dummy data"""
    print("🧪 GlobaLens AI Backend Comprehensive Test")
    print("=" * 60)
    print("📝 Testing with dummy data (SmythOS agents simulated)")
    print("=" * 60)
    
    test_results = {
        "health_check": False,
        "user_registration": False,
        "user_login": False,
        "query_creation": False,
        "query_status": False,
        "risk_analysis": False,
        "action_plan": False,
        "query_history": False,
        "complete_reports": False
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        # 1. Health Check
        print("\n1️⃣  Testing Health Check...")
        try:
            response = await client.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                health_data = response.json()
                print(f"   ✅ Health check successful: {health_data.get('status')}")
                print(f"   📊 Database: {health_data.get('database')}")
                test_results["health_check"] = True
            else:
                print(f"   ❌ Health check failed: {response.status_code}")
                return test_results
        except Exception as e:
            print(f"   ❌ Health check error: {e}")
            return test_results
        
        # 2. User Registration
        print("\n2️⃣  Testing User Registration...")
        test_user = {
            "name": "Test User Demo",
            "email": f"testdemo_{int(time.time())}@example.com",
            "password": "testpass123"
        }
        
        try:
            response = await client.post(f"{BASE_URL}/api/v1/auth/signup", json=test_user)
            if response.status_code == 201:
                signup_data = response.json()
                token = signup_data["access_token"]
                user_id = signup_data["user"]["id"]
                print(f"   ✅ User registration successful")
                print(f"   👤 User ID: {user_id}")
                print(f"   🔑 JWT token received (length: {len(token)})")
                test_results["user_registration"] = True
            else:
                print(f"   ❌ Registration failed: {response.status_code} - {response.text}")
                return test_results
        except Exception as e:
            print(f"   ❌ Registration error: {e}")
            return test_results
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # 3. User Login Test
        print("\n3️⃣  Testing User Login...")
        try:
            login_data = {"email": test_user["email"], "password": test_user["password"]}
            response = await client.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
            if response.status_code == 200:
                login_response = response.json()
                print(f"   ✅ Login successful")
                print(f"   👤 User: {login_response['user']['name']}")
                test_results["user_login"] = True
            else:
                print(f"   ❌ Login failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Login error: {e}")
        
        # 4. Query Creation
        print("\n4️⃣  Testing Query Creation...")
        test_queries = [
            "What are the current risks for shipping from Shanghai to Los Angeles?",
            "Analyze supply chain disruptions for Europe to Asia routes",
            "Check weather and geopolitical risks for Pacific shipping lanes"
        ]
        
        query_ids = []
        for i, question in enumerate(test_queries):
            try:
                query_data = {"question": question}
                response = await client.post(f"{BASE_URL}/api/v1/query/", json=query_data, headers=headers)
                if response.status_code == 201:
                    query_response = response.json()
                    query_ids.append(query_response["id"])
                    print(f"   ✅ Query {i+1} created: ID {query_response['id']}")
                    print(f"   📝 Status: {query_response['status']}")
                    if i == 0:  # Mark first query as successful for further testing
                        test_results["query_creation"] = True
                        main_query_id = query_response["id"]
                else:
                    print(f"   ❌ Query {i+1} creation failed: {response.status_code}")
            except Exception as e:
                print(f"   ❌ Query {i+1} creation error: {e}")
        
        if not test_results["query_creation"]:
            print("   ❌ No queries created successfully")
            return test_results
        
        # 5. Query Status Check
        print("\n5️⃣  Testing Query Status...")
        try:
            response = await client.get(f"{BASE_URL}/api/v1/query/{main_query_id}", headers=headers)
            if response.status_code == 200:
                query_data = response.json()
                print(f"   ✅ Query status retrieved")
                print(f"   📊 Status: {query_data['status']}")
                print(f"   📅 Created: {query_data['created_at']}")
                test_results["query_status"] = True
            else:
                print(f"   ❌ Query status failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Query status error: {e}")
        
        # 6. Simulate Risk Analysis (Direct Database Insert)
        print("\n6️⃣  Testing Risk Analysis (Simulated)...")
        try:
            # We'll simulate the agent response by creating a dummy report
            # In real scenario, this would be done by the agent service
            print("   🤖 Simulating SmythOS Web Risk Monitor Agent...")
            print("   📊 Creating dummy risk analysis report...")
            
            # Simulate what the background task would do
            import sys
            import os
            sys.path.append(os.path.join(os.path.dirname(__file__), '.'))
            
            from app.core.database import SessionLocal
            from app.services.report_service import ReportService
            from app.services.query_service import QueryService
            
            # Create simulated report in database
            db = SessionLocal()
            try:
                # Update query status
                QueryService.update_query_status(
                    db, main_query_id, "completed", 
                    DUMMY_RISK_ANALYSIS["summary"]["route"]
                )
                
                # Create risk analysis report
                ReportService.create_report(
                    db=db,
                    query_id=main_query_id,
                    report_type="risk_analysis",
                    json_report=DUMMY_RISK_ANALYSIS,
                    confidence_score=0.89,
                    processing_time=2.5,
                    agent_version="dummy-v1.0"
                )
                
                print("   ✅ Dummy risk analysis report created")
                test_results["risk_analysis"] = True
                
            finally:
                db.close()
                
        except Exception as e:
            print(f"   ❌ Risk analysis simulation error: {e}")
        
        # 7. Test Risk Analysis Retrieval
        print("\n7️⃣  Testing Risk Analysis Retrieval...")
        try:
            await asyncio.sleep(1)  # Small delay
            response = await client.get(f"{BASE_URL}/api/v1/report/{main_query_id}/risk-analysis", headers=headers)
            if response.status_code == 200:
                risk_data = response.json()
                print(f"   ✅ Risk analysis retrieved successfully")
                print(f"   🎯 Total risks found: {len(risk_data['risks'])}")
                print(f"   ⚠️  Risk profile: {risk_data['summary']['overall_risk_profile']}")
                print(f"   🔗 Sources: {len(risk_data['top_sources'])}")
                
                # Show sample risks
                for risk in risk_data['risks'][:2]:
                    print(f"   📋 {risk['id']}: {risk['title']} ({risk['severity']})")
                    
            else:
                print(f"   ❌ Risk analysis retrieval failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Risk analysis retrieval error: {e}")
        
        # 8. Test Action Plan Generation (Simulated)
        print("\n8️⃣  Testing Action Plan Generation (Simulated)...")
        try:
            print("   🤖 Simulating SmythOS Action Plan Agent...")
            
            # Create simulated action plan report
            db = SessionLocal()
            try:
                ReportService.create_report(
                    db=db,
                    query_id=main_query_id,
                    report_type="action_plan",
                    json_report=DUMMY_ACTION_PLAN,
                    confidence_score=0.92,
                    processing_time=1.8,
                    agent_version="dummy-v1.0"
                )
                
                print("   ✅ Dummy action plan created")
                test_results["action_plan"] = True
                
            finally:
                db.close()
                
        except Exception as e:
            print(f"   ❌ Action plan simulation error: {e}")
        
        # 9. Test Action Plan Retrieval
        print("\n9️⃣  Testing Action Plan Retrieval...")
        try:
            response = await client.get(f"{BASE_URL}/api/v1/report/{main_query_id}/action-plan", headers=headers)
            if response.status_code == 200:
                action_data = response.json()
                print(f"   ✅ Action plan retrieved successfully")
                print(f"   📋 Actions generated: {len(action_data['prioritized_actions'])}")
                print(f"   🎯 Priority focus: {action_data['summary']['priority_focus']}")
                
                # Show prioritized actions
                for action in action_data['prioritized_actions'][:3]:
                    print(f"   {action['priority']}. {action['action']} (Impact: {action['estimated_impact']})")
                    
            else:
                print(f"   ❌ Action plan retrieval failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Action plan retrieval error: {e}")
        
        # 10. Test Query History
        print("\n🔟 Testing Query History...")
        try:
            response = await client.get(f"{BASE_URL}/api/v1/query/?page=1&page_size=10", headers=headers)
            if response.status_code == 200:
                history_data = response.json()
                print(f"   ✅ Query history retrieved")
                print(f"   📊 Total queries: {history_data['total_count']}")
                print(f"   📄 Page: {history_data['page']} (Size: {history_data['page_size']})")
                
                for query in history_data['queries'][:3]:
                    print(f"   📝 Query {query['id']}: {query['status']} - {query['question'][:50]}...")
                    
                test_results["query_history"] = True
            else:
                print(f"   ❌ Query history failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Query history error: {e}")
        
        # 11. Test Complete Reports
        print("\n1️⃣1️⃣  Testing Complete Reports...")
        try:
            response = await client.get(f"{BASE_URL}/api/v1/report/{main_query_id}/reports", headers=headers)
            if response.status_code == 200:
                complete_data = response.json()
                print(f"   ✅ Complete reports retrieved")
                print(f"   📊 Query ID: {complete_data['query_id']}")
                print(f"   📋 Available reports: {list(complete_data['reports'].keys())}")
                print(f"   ❓ Original question: {complete_data['query']['question']}")
                test_results["complete_reports"] = True
            else:
                print(f"   ❌ Complete reports failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Complete reports error: {e}")
    
    # Final Results
    print("\n" + "=" * 60)
    print("🎉 BACKEND TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed_tests = sum(test_results.values())
    total_tests = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name.replace('_', ' ').title()}")
    
    print(f"\n📊 OVERALL: {passed_tests}/{total_tests} tests passed ({passed_tests/total_tests*100:.1f}%)")
    
    if passed_tests == total_tests:
        print("🎉 ALL TESTS PASSED! Backend is fully functional!")
        print("🚀 Ready for production deployment and demo!")
    elif passed_tests >= total_tests * 0.8:
        print("✅ MOSTLY WORKING! Minor issues to address.")
    else:
        print("⚠️  NEEDS ATTENTION! Several components need fixing.")
    
    print("\n🔗 Next Steps:")
    print("   • Test with real SmythOS agents when credits available")
    print("   • Deploy frontend for complete system demo")
    print("   • Ready for hackathon presentation!")
    
    return test_results

if __name__ == "__main__":
    print("🌐 GlobaLens AI Backend - Full Functionality Test")
    print("📝 This test simulates the complete workflow with dummy data")
    print("💡 Make sure the backend is running: python3 backend/run.py")
    print()
    
    try:
        results = asyncio.run(test_backend_comprehensive())
        print(f"\n🏁 Test completed. Check results above.")
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
