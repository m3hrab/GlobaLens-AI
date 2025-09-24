'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateQuery, useQueryHistory } from '@/hooks/useQueries';
import { Search, FileText, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import type { Query } from '@/types/api';

function DashboardContent() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const createQueryMutation = useCreateQuery();
  const { data: queryHistory, isLoading: historyLoading, refetch: refetchHistory } = useQueryHistory(1, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      await createQueryMutation.mutateAsync({ question });
      setQuestion('');
      setShowResults(true);
      // Refetch history to show the new query
      refetchHistory();
    } catch (error) {
      console.error('Error creating query:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Monitor global supply chain risks and get AI-powered insights for your shipping routes.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-700/25 transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Queries</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {queryHistory?.total_count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-700/25 transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {queryHistory?.queries.filter((q: Query) => q.status === 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-700/25 transition-shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {queryHistory?.queries.filter((q: Query) => q.status === 'processing').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Query Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Analyze Supply Chain Risks
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe your shipping route or supply chain concern
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              placeholder="e.g., What are the current risks for shipping from Shanghai to Los Angeles ports due to weather and geopolitical tensions?"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createQueryMutation.isPending || !question.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createQueryMutation.isPending ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Risks
              </>
            )}
          </button>
        </form>

        {showResults && createQueryMutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Query Submitted Successfully
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>Your risk analysis request has been submitted. AI agents are now processing your query.</p>
                  <p className="mt-1">You can check the status in your history below or visit the History page.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Queries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Risk Reports</h2>
          <a
            href="/history"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View All →
          </a>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your reports...</span>
          </div>
        ) : queryHistory?.queries.length ? (
          <div className="space-y-4">
            {queryHistory.queries.slice(0, 5).map((query: Query) => (
              <div
                key={query.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                      {query.question}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Query #{query.id}</span>
                      <span>{new Date(query.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                    {getStatusIcon(query.status)}
                    <span className="capitalize">{query.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Submit your first risk analysis query above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
