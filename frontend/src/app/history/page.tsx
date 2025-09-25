'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useQueryHistory, useRiskAnalysis, useActionPlan } from '@/hooks/useQueries';
import type { Query } from '@/types/api';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  MapPin,
  Calendar
} from 'lucide-react';

function HistoryContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState<number | null>(null);
  const pageSize = 10;

  const { data: queryHistory, isLoading } = useQueryHistory(currentPage, pageSize);
  const { data: riskAnalysis, isLoading: riskLoading } = useRiskAnalysis(
    selectedQuery || 0, 
    !!selectedQuery
  );
  const { data: actionPlan, isLoading: actionPlanLoading } = useActionPlan(
    selectedQuery || 0,
    !!selectedQuery
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-amber-800 bg-amber-200 border-amber-400 font-semibold';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const totalPages = queryHistory ? Math.ceil(queryHistory.total_count / pageSize) : 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading your query history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Query History</h1>
        <p className="text-lg text-gray-600">
          Review your past risk analysis queries and their results.
        </p>
      </div>

      {selectedQuery && (
        <div className="mb-8 bg-white dark:gradient-card rounded-lg shadow-sm border dark:border-purple-500/30 p-6 glass-effect hover-glow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Risk Analysis Details</h2>
            <button
              onClick={() => setSelectedQuery(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to History
            </button>
          </div>

          {riskLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin h-6 w-6 text-blue-600" />
              <span className="ml-2 text-gray-600">Loading risk analysis...</span>
            </div>
          ) : riskAnalysis ? (
            <div className="space-y-6">
              {/* Route Summary */}
              {riskAnalysis.summary?.route && (
                <div className="bg-blue-50 dark:gradient-card p-4 rounded-lg glass-effect hover-glow">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Route Information
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">Origin:</span>
                      <p className="text-blue-700">
                        {riskAnalysis.summary.route.origin_ports?.join(', ') || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Transit:</span>
                      <p className="text-blue-700">
                        {riskAnalysis.summary.route.transit?.join(', ') || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Destination:</span>
                      <p className="text-blue-700">
                        {riskAnalysis.summary.route.destination_ports?.join(', ') || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Profile */}
              {riskAnalysis.summary?.overall_risk_profile && (
                <div className="bg-gray-50 dark:gradient-card p-4 rounded-lg glass-effect hover-glow">
                  <h3 className="font-semibold text-gray-900 mb-3">Overall Risk Profile</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {riskAnalysis.summary.overall_risk_profile.critical || 0}
                      </div>
                      <div className="text-sm text-gray-600">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {riskAnalysis.summary.overall_risk_profile.high || 0}
                      </div>
                      <div className="text-sm text-gray-600">High</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {riskAnalysis.summary.overall_risk_profile.medium || 0}
                      </div>
                      <div className="text-sm text-gray-600">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {riskAnalysis.summary.overall_risk_profile.low || 0}
                      </div>
                      <div className="text-sm text-gray-600">Low</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Route Information */}
              {riskAnalysis.route && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Route Information</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-400/30 rounded-lg p-4 glass-effect">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Origin</h4>
                        <div className="space-y-1">
                          {riskAnalysis.route.origin?.map((port: string, idx: number) => (
                            <div key={idx} className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {port}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Transit</h4>
                        <div className="space-y-1">
                          {riskAnalysis.route.transit?.map((area: string, idx: number) => (
                            <div key={idx} className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                              {area}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Destination</h4>
                        <div className="space-y-1">
                          {riskAnalysis.route.destination?.map((port: string, idx: number) => (
                            <div key={idx} className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {port}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Profile Summary */}
              {riskAnalysis.risk_profile && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Risk Profile Summary</h3>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-400/30 rounded-lg p-4 glass-effect">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{(riskAnalysis.risk_profile as any).critical || 0}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{(riskAnalysis.risk_profile as any).high || 0}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">High</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">{(riskAnalysis.risk_profile as any).medium || 0}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Medium</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{(riskAnalysis.risk_profile as any).low || 0}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Identified Risks */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Identified Risks</h3>
                <div className="space-y-4">
                  {riskAnalysis.risks && riskAnalysis.risks.length > 0 ? (
                    riskAnalysis.risks.map((risk: any, index: number) => (
                      <div
                        key={risk?.id || index}
                        className={`border rounded-lg p-4 glass-effect hover-glow ${getSeverityColor(risk?.severity || 'low')}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                risk.type === 'geopolitical' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                risk.type === 'weather' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                risk.type === 'security' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                              }`}>
                                {risk.type || 'Unknown'}
                              </span>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                                {risk?.severity || 'Unknown'}
                              </span>
                            </div>
                            <h4 className="font-medium text-lg mb-2">{risk?.title || 'Unknown Risk'}</h4>
                            <p className="text-sm mb-3 text-gray-700 dark:text-gray-300">{risk?.desc || risk?.description || 'No description available'}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Confidence: </span>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {Math.round((risk?.confidence || 0) * 100)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Last Update: </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {risk?.last_update ? new Date(risk.last_update).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                        </div>

                        {risk?.locations && risk.locations.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Locations: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {risk.locations.map((location: string, idx: number) => (
                                <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {risk?.sources && risk.sources.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Sources: </span>
                            <div className="mt-1">
                              {risk.sources.map((source: any, idx: number) => (
                                <a 
                                  key={idx}
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mr-2"
                                >
                                  {source.name}
                                  {idx < risk.sources.length - 1 && ', '}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No risks identified</p>
                  )}
                </div>
              </div>

              {/* Action Plan Summary */}
              {actionPlan?.summary && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Action Plan Summary</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-400/30 rounded-lg p-4 glass-effect">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {actionPlan.summary.total_risks && typeof actionPlan.summary.total_risks === 'object' ? (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{(actionPlan.summary.total_risks as any).critical || 0}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{(actionPlan.summary.total_risks as any).high || 0}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">High</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{(actionPlan.summary.total_risks as any).medium || 0}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Medium</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{(actionPlan.summary.total_risks as any).low || 0}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    {(actionPlan.summary as any).priority_focus && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority Focus: </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{(actionPlan.summary as any).priority_focus}</span>
                      </div>
                    )}
                    {(actionPlan.summary as any).top_affected_locations && Array.isArray((actionPlan.summary as any).top_affected_locations) && (actionPlan.summary as any).top_affected_locations.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Affected Locations: </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {(actionPlan.summary as any).top_affected_locations.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                <div className="space-y-3">
                  {riskAnalysis.actions && riskAnalysis.actions.length > 0 ? (
                    riskAnalysis.actions.map((action: any, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-400/30 rounded-lg p-4 glass-effect hover-glow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <h4 className="font-medium text-green-900 dark:text-green-100">
                              {action.action || 'Recommended Action'}
                            </h4>
                          </div>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          {action.details || action.description || 'No details available'}
                        </p>
                      </div>
                    ))
                  ) : actionPlanLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading action plan...</span>
                    </div>
                  ) : actionPlan?.prioritized_actions && actionPlan.prioritized_actions.length > 0 ? (
                    actionPlan.prioritized_actions.map((action: any, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-400/30 rounded-lg p-4 glass-effect hover-glow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              #{action.priority}
                            </span>
                            <h4 className="font-medium text-green-900 dark:text-green-100">
                              {action.action || 'Recommended Action'}
                            </h4>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            action.estimated_impact === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : action.estimated_impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {action.estimated_impact || 'medium'} impact
                          </span>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                          {action.description || 'No details available'}
                        </p>
                        {action.target_risks && action.target_risks.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Target Risks: </span>
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                              {action.target_risks.join(', ')}
                            </span>
                          </div>
                        )}
                        {action.sources && action.sources.length > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Sources: </span>
                            {action.sources.map((source: any, idx: number) => (
                              <a 
                                key={idx}
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                              >
                                {source.name}
                                {idx < action.sources.length - 1 && ', '}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recommended actions available</p>
                  )}
                </div>
              </div>

              {/* Top Sources */}
              {riskAnalysis.top_sources && riskAnalysis.top_sources.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Top Sources</h3>
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border border-gray-200 dark:border-gray-400/30 rounded-lg p-4 glass-effect">
                    <div className="space-y-2">
                      {riskAnalysis.top_sources.map((source: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{source.name}</span>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Source →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Risk Analysis Not Available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The risk analysis for this query is still processing or failed to generate.
              </p>
            </div>
          )}
        </div>
      )}

      {!selectedQuery && (
        <>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Risk Analysis Queries
              </h2>
            </div>

            {queryHistory?.queries.length ? (
              <>
                <div className="divide-y divide-gray-200">
                  {queryHistory.queries.map((query: Query) => (
                    <div
                      key={query.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 mb-2">
                            {query.question}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(query.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>Query #{query.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                            {getStatusIcon(query.status)}
                            <span className="capitalize">{query.status}</span>
                          </div>
                          {query.status === 'completed' && (
                            <button
                              onClick={() => setSelectedQuery(query.id)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, queryHistory.total_count)} of {queryHistory.total_count} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No queries yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start by creating your first risk analysis query from the dashboard.
                </p>
                <div className="mt-6">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}
