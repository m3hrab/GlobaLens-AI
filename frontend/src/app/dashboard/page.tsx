'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useCreateQuery, useQueryHistory } from '@/hooks/useQueries';
import { Search, FileText, Clock, CheckCircle, AlertCircle, Loader, TrendingUp } from 'lucide-react';
import type { Query } from '@/types/api';

function DashboardContent() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [question, setQuestion] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const createQueryMutation = useCreateQuery();
  const { data: queryHistory, isLoading: historyLoading, refetch: refetchHistory } = useQueryHistory(1, 5);

  // Monitor query status changes and add notifications
  useEffect(() => {
    if (queryHistory?.queries) {
      const completedQueries = queryHistory.queries.filter((q: Query) => q.status === 'completed');
      const processingQueries = queryHistory.queries.filter((q: Query) => q.status === 'processing');
      
      // Check for newly completed queries (this is a simple implementation)
      // In a real app, you'd want to track which queries were previously processing
      if (completedQueries.length > 0) {
        const latestCompleted = completedQueries[0];
        if (latestCompleted) {
          addNotification({
            type: 'success',
            title: 'Analysis Completed! 🎉',
            message: `Your supply chain risk analysis for "${latestCompleted.question.substring(0, 50)}..." has been completed successfully.`,
          });
        }
      }
    }
  }, [queryHistory, addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      await createQueryMutation.mutateAsync({ question });
      setQuestion('');
      setShowResults(true);
      
      // Add notification for analysis started
      addNotification({
        type: 'info',
        title: 'AI Analysis Started',
        message: 'Your supply chain risk analysis has been initiated and is being processed by our AI agents.',
      });
      
      // Refetch history to show the new query
      refetchHistory();
    } catch (error) {
      console.error('Error creating query:', error);
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Analysis Failed',
        message: 'There was an error starting your analysis. Please try again.',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30';
      case 'processing':
        return 'text-amber-300 bg-amber-500/20 border-amber-400/30';
      case 'failed':
        return 'text-red-300 bg-red-500/20 border-red-400/30';
      default:
        return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
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
    <div className="dashboard-page min-h-full relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      <div className="absolute inset-0 dark:bg-gradient-to-tr dark:from-slate-700/10 dark:via-transparent dark:to-slate-600/10"></div>
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.1),transparent_50%)]"></div>
      
      <div className="dashboard-main-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* AI Query Form - Modern AI Design - MOVED TO TOP */}
            <div className="ai-analyzer-section relative group mb-12 rounded-3xl">
              <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
              <div className="relative bg-white dark:bg-gradient-to-br dark:from-slate-800/80 dark:via-slate-700/60 dark:to-slate-800/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-600/30 rounded-3xl p-8 hover:bg-slate-50 dark:hover:bg-gradient-to-br dark:hover:from-slate-900/90 dark:hover:via-slate-800/80 dark:hover:to-slate-900/90 transition-all duration-500 shadow-2xl">
            
            {/* Modern AI Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
                  <h2 className="gradient-text text-4xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent mb-2">
                    AI Risk Analyzer
                  </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">Intelligent Risk Assessment & Predictive Analytics</p>
              <div className="flex items-center justify-center mt-3 space-x-2">
                <div className="h-1 w-8 bg-blue-500 dark:bg-gradient-to-r dark:from-blue-500 dark:to-transparent rounded-full"></div>
                <div className="h-1 w-12 bg-indigo-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 rounded-full"></div>
                <div className="h-1 w-8 bg-purple-500 dark:bg-gradient-to-r dark:from-transparent dark:to-purple-500 rounded-full"></div>
      </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="question" className="block text-sm font-semibold text-slate-700 dark:text-white/90 mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  Ask about your supply chain risks
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What are the risks for shipping from Shanghai to Los Angeles in December?"
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                  rows={3}
                />
              </div>

              {/* Suggested Questions */}
              <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-white/90 flex items-center">
                  <span className="mr-2">💡</span>
                  Quick Questions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "What are the current risks for shipping from China to USA?",
                    "How is the weather affecting shipping routes in the Pacific?",
                    "What are the geopolitical risks in the Middle East?",
                    "How is the Suez Canal situation impacting global trade?"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setQuestion(suggestion)}
                          className="text-left p-3 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-lg text-sm text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={createQueryMutation.isPending || !question.trim()}
                  className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    {createQueryMutation.isPending ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 text-white" />
                        <span className="text-white">
                          AI Analyzing...
                        </span>
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 text-white" />
                        <span className="text-white">Launch AI Analysis</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>


        {/* AI-Powered Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Total Queries Card */}
              <div className="group relative">
                <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-600/10 dark:to-indigo-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="stats-card relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-white/90 mb-2">Total Queries</h3>
                  <p className="text-3xl font-bold text-blue-600 dark:bg-gradient-to-r dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text dark:text-transparent">
                {queryHistory?.total_count || 0}
              </p>
            </div>
          </div>

              {/* Completed Card */}
              <div className="group relative">
                <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-green-600/10 dark:to-emerald-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="stats-card relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
        </div>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-white/90 mb-2">Completed</h3>
                  <p className="text-3xl font-bold text-green-600 dark:bg-gradient-to-r dark:from-green-300 dark:to-emerald-400 dark:bg-clip-text dark:text-transparent">
                {queryHistory?.queries.filter((q: Query) => q.status === 'completed').length || 0}
              </p>
            </div>
          </div>

              {/* Processing Card */}
              <div className="group relative">
                <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-amber-600/10 dark:to-orange-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="stats-card relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
        </div>
                <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-white/90 mb-2">Processing</h3>
                  <p className="text-3xl font-bold text-amber-600 dark:bg-gradient-to-r dark:from-amber-300 dark:to-orange-400 dark:bg-clip-text dark:text-transparent">
                {queryHistory?.queries.filter((q: Query) => q.status === 'processing').length || 0}
              </p>
            </div>
          </div>
        </div>


            {/* Recent AI Analysis - Futuristic Design */}
            <div className="recent-analysis-section relative group">
              <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
              <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-2xl border border-slate-200 dark:border-white/30 rounded-3xl p-8">
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-2xl">
                  <FileText className="h-6 w-6 text-white" />
      </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:bg-gradient-to-r dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent">
                    Recent AI Analysis
        </h2>
                  <p className="text-slate-600 dark:text-white/70 text-sm">Real-time intelligent insights</p>
                </div>
              </div>
          <a
            href="/history"
                className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105"
          >
                <span>View All</span>
                <div className="ml-2 transform group-hover:translate-x-1 transition-transform">→</div>
          </a>
        </div>

        {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="h-16 w-16 border-4 border-purple-500/30 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 h-16 w-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                </div>
                <div className="mt-6 flex items-center space-x-2 text-white/80">
                  <span>🤖 AI Loading Analysis...</span>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
          </div>
        ) : queryHistory?.queries.length ? (
          <div className="space-y-4">
                {queryHistory.queries.slice(0, 5).map((query: Query) => (
              <div
                key={query.id}
                    className="group relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                        <p className="text-white/90 mb-3 font-medium leading-relaxed">
                      {query.question}
                    </p>
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <span className="flex items-center">
                            <span className="mr-1">🔍</span>
                            Query #{query.id}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">📅</span>
                            {new Date(query.created_at).toLocaleDateString()}
                          </span>
                    </div>
                  </div>
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-xl border ${getStatusColor(query.status)}`}>
                    {getStatusIcon(query.status)}
                    <span className="capitalize">{query.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="h-24 w-24 mx-auto bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30">
                    <FileText className="h-12 w-12 text-white/60" />
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-24 w-24 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No AI Analysis Yet</h3>
                <p className="text-white/70 max-w-md mx-auto">
                  🚀 Submit your first supply chain query above to unlock powerful AI insights!
            </p>
          </div>
        )}
          </div>
        </div>
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
