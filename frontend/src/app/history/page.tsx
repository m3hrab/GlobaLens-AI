'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useQueryHistory, useRiskAnalysis } from '@/hooks/useQueries';
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
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
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

              {/* Identified Risks */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Identified Risks</h3>
                <div className="space-y-3">
                  {riskAnalysis.risks && riskAnalysis.risks.length > 0 ? (
                    riskAnalysis.risks.map((risk, index) => (
                      <div
                        key={risk?.id || index}
                        className={`border rounded-lg p-4 glass-effect hover-glow ${getSeverityColor(risk?.severity || 'low')}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{risk?.title || 'Unknown Risk'}</h4>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                            {risk?.severity || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{risk?.description || 'No description available'}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Confidence: {Math.round((risk?.confidence || 0) * 100)}%</span>
                          <span>Locations: {risk?.locations_affected?.join(', ') || 'Not specified'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No risks identified</p>
                  )}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                <div className="space-y-3">
                  {riskAnalysis.recommended_actions && riskAnalysis.recommended_actions.length > 0 ? (
                    riskAnalysis.recommended_actions.map((action, index) => (
                      <div key={index} className="bg-green-50 dark:gradient-card border border-green-200 dark:border-green-400/30 rounded-lg p-4 glass-effect hover-glow">
                        <h4 className="font-medium text-green-900 mb-1">{action?.action || 'Recommended Action'}</h4>
                        <p className="text-sm text-green-800">{action?.details || 'No details available'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recommendations available</p>
                  )}
                </div>
              </div>
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
