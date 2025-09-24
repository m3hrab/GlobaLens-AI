# GlobaLens AI – Agents Details

## 1. Web-Risk-Monitor Agent
**Purpose:**  
- Analyze shipping route risks in real-time.  
- Collect and aggregate data from multiple sources (web scraping: news, port, logistics, labor).  
- Return a JSON risk report for the frontend.

endpoint:
POST https://cmfwyngz91sn8o3wt46vmu9sp.agent.a.smyth.ai/api/analyze_route_risks

**Input Schema (JSON):**
```json
{
  "question": "string"
}

Output Schema (JSON):
{
  "query": "string (normalized question or route summary)",
  "generated_at": "ISO8601 timestamp",
  "summary": {
    "route": {
      "origin_ports": ["string"],
      "transit": ["string"],
      "destination_ports": ["string"]
    },
    "overall_risk_profile": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    }
  },
  "risks": [
    {
      "id": "string (unique risk ID, e.g., RISK_001)",
      "type": "weather | labor | port_ops | geopolitical | security | infra | commercial",
      "severity": "critical | high | medium | low",
      "title": "string",
      "description": "string (1-3 sentences)",
      "locations_affected": ["string"],
      "impacted_route_segments": ["origin | transit | destination"],
      "last_update": "ISO8601 timestamp",
      "sources": [
        {"name": "string", "url": "string"}
      ],
      "confidence": 0.0,
      "typical_impact_window": "string (e.g., '48 hours')"
    }
  ],
  "recommended_monitoring_actions": [
    {
      "action": "string (short description of action)",
      "details": "string (1-3 sentences)"
    }
  ],
  "top_sources_used": [
    {
      "name": "string",
      "url": "string"
    }
  ]
}

## 2. Web-Risk-Monitor Agent


Purpose:

Consume JSON output from Web-Risk-Monitor.

Prioritize risks by severity and confidence.

Generate 3–5 actionable mitigation steps.

Include references to sources and link each action to specific risks.

End point:

POST https://cmfxk1sby3663o3wtnuunk659.agent.a.smyth.ai/api/generate_action_plan 
Input Schema (JSON):
{
  "route_risks": { ...same as Web-Risk-Monitor output... }
}


Output Schema (JSON):
{
  "generated_at": "ISO8601 timestamp",
  "summary": {
    "total_risks": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "top_affected_locations": ["string", "string", "string"],
    "priority_focus": "string (brief description of main risk focus area)"
  },
  "prioritized_actions": [
    {
      "priority": 1,
      "action": "string (clear action title)",
      "description": "string (concise 1-3 sentences)",
      "target_risks": ["string (risk_id1)", "string (risk_id2)"],
      "estimated_impact": "high | medium | low",
      "sources": [
        {"name": "string", "url": "string"}
      ]
    }
  ]
}
