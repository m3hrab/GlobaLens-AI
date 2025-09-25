export interface Query {
  id: number;
  user_id: number;
  question: string;
  route_data?: Record<string, unknown>;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface QueryHistory {
  queries: Query[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface RiskAnalysis {
  query_id: number;
  report_id: number;
  summary: {
    route: {
      origin_ports: string[];
      transit: string[];
      destination_ports: string[];
    };
    overall_risk_profile: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  risks: Array<{
    id: string;
    type: string;
    severity: string;
    title: string;
    description: string;
    locations_affected: string[];
    confidence: number;
  }>;
  recommended_actions: Array<{
    action: string;
    details: string;
  }>;
  top_sources: Array<{
    name: string;
    url: string;
  }>;
  generated_at: string;
}

export interface ActionPlan {
  query_id: number;
  report_id: number;
  summary: Record<string, unknown>;
  prioritized_actions: Array<Record<string, unknown>>;
  confidence_score?: number;
  generated_at: string;
}

export interface CreateQueryRequest {
  question: string;
}

export interface ApiError {
  error: boolean;
  message: string;
  status_code: number;
  details?: Record<string, unknown>;
}
