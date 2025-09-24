#!/usr/bin/env python3
"""
Test the correct SmythOS agent endpoints with proper format
"""

import asyncio
import httpx
import json
from datetime import datetime

# Correct endpoint URLs
WEB_RISK_MONITOR_URL = "https://cmfx0m6pd1z1o23quzznwufz2.agent.pa.smyth.ai/api/analyze_route_risks"
ACTION_PLAN_AGENT_URL = "https://cmfxm82uq3jcb2py5aawkp62d.agent.pa.smyth.ai/api/generate_action_plan"

async def test_web_risk_monitor():
    """Test the Web Risk Monitor agent with a simple query"""
    
    print("🔍 Testing Web Risk Monitor Agent...")
    print("=" * 50)
    
    # Test data - simple question about supply chain risks
    test_data = {
        "question": "What are the current supply chain risks for shipping from Shanghai, China to Los Angeles, USA?"
    }
    
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            print(f"📡 Calling: {WEB_RISK_MONITOR_URL}")
            print(f"📤 Payload: {json.dumps(test_data, indent=2)}")
            
            response = await client.post(
                WEB_RISK_MONITOR_URL,
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"📊 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ SUCCESS! Web Risk Monitor is working!")
                result = response.json()
                print(f"📋 Response preview:")
                print(json.dumps(result, indent=2, default=str)[:1000] + "...")
                return result
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return None

async def test_action_plan_agent():
    """Test the Action Plan Agent with mock risk data"""
    
    print("\n🎯 Testing Action Plan Agent...")
    print("=" * 50)
    
    # Mock risk data that would come from Web Risk Monitor
    mock_risk_data = {
        "query": "Shanghai to Los Angeles shipping route",
        "generated_at": datetime.now().isoformat(),
        "summary": {
            "route": {
                "origin_ports": ["Shanghai"],
                "transit": ["Pacific Ocean"],
                "destination_ports": ["Los Angeles"]
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
                "severity": "high",
                "title": "Typhoon Season Pacific",
                "description": "Active typhoon season affecting Pacific shipping lanes.",
                "locations_affected": ["Pacific Ocean"],
                "impacted_route_segments": ["transit"],
                "last_update": datetime.now().isoformat(),
                "sources": [{"name": "Weather Agency", "url": "https://example.com"}],
                "confidence": 0.8,
                "typical_impact_window": "72 hours"
            }
        ]
    }
    
    test_data = {
        "route_risks": mock_risk_data
    }
    
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            print(f"📡 Calling: {ACTION_PLAN_AGENT_URL}")
            print(f"📤 Payload preview: {json.dumps(test_data, indent=2, default=str)[:500]}...")
            
            response = await client.post(
                ACTION_PLAN_AGENT_URL,
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"📊 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ SUCCESS! Action Plan Agent is working!")
                result = response.json()
                print(f"📋 Response preview:")
                print(json.dumps(result, indent=2, default=str)[:1000] + "...")
                return result
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return None

async def test_full_workflow():
    """Test the complete workflow: Risk Analysis -> Action Plan"""
    
    print("\n🔄 Testing Complete Workflow...")
    print("=" * 50)
    
    # Step 1: Get risk analysis
    risk_result = await test_web_risk_monitor()
    
    if risk_result:
        print("\n⏳ Waiting 2 seconds before next request...")
        await asyncio.sleep(2)
        
        # Step 2: Generate action plan from real risk data
        print(f"🎯 Using real risk data for action plan...")
        test_data = {"route_risks": risk_result}
        
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    ACTION_PLAN_AGENT_URL,
                    json=test_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    print("✅ FULL WORKFLOW SUCCESS!")
                    action_plan = response.json()
                    print(f"📋 Action Plan preview:")
                    print(json.dumps(action_plan, indent=2, default=str)[:800] + "...")
                else:
                    print(f"❌ Action Plan failed: {response.status_code}")
                    print(f"Response: {response.text}")
                    
        except Exception as e:
            print(f"❌ Full workflow exception: {str(e)}")
    else:
        print("❌ Cannot test full workflow - Risk analysis failed")

async def main():
    """Main test function"""
    print("🚀 Testing SmythOS Agents - CAREFUL WITH API COSTS!")
    print("=" * 60)
    
    # Test individual agents first
    await test_web_risk_monitor()
    
    print("\n⏳ Waiting 3 seconds between tests to be cost-conscious...")
    await asyncio.sleep(3)
    
    await test_action_plan_agent()
    
    print("\n⏳ Waiting 3 seconds before full workflow test...")
    await asyncio.sleep(3)
    
    # Test full workflow
    await test_full_workflow()
    
    print("\n🎉 Agent testing complete!")

if __name__ == "__main__":
    asyncio.run(main())
