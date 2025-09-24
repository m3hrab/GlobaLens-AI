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
    <div className="min-h-full relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-700/10 via-transparent to-slate-600/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Futuristic Design */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
            <div className="h-2 w-2 bg-slate-500 rounded-full"></div>
            <div className="h-2 w-2 bg-slate-600 rounded-full"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <span className="inline-flex items-center">
              <span className="mr-2">📊</span>
              AI-Powered Global Supply Chain Intelligence
              <span className="ml-2">🔍</span>
            </span>
          </p>
          <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-slate-400 to-slate-600 rounded-full"></div>
        </div>

        {/* AI-Powered Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Queries Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-slate-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-slate-500 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Total Queries</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
                {queryHistory?.total_count || 0}
              </p>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Completed Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-slate-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-2xl shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-slate-500 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Completed</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
                {queryHistory?.queries.filter((q: Query) => q.status === 'completed').length || 0}
              </p>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Processing Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-slate-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-2xl shadow-lg">
                  <Clock className="h-8 w-8 text-white animate-spin" style={{animationDuration: '3s'}} />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-slate-500 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Processing</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
                {queryHistory?.queries.filter((q: Query) => q.status === 'processing').length || 0}
              </p>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Query Form - Modern AI Design */}
        <div className="relative group mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
          <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 backdrop-blur-2xl border border-slate-600/30 rounded-3xl p-8 hover:bg-gradient-to-br hover:from-slate-900/90 hover:via-slate-800/80 hover:to-slate-900/90 transition-all duration-500 shadow-2xl">
            
            {/* Modern AI Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent mb-2">
                AI Risk Analyzer
              </h2>
              <p className="text-slate-300 text-lg font-medium">Powered by Advanced Machine Learning</p>
              <div className="flex items-center justify-center mt-3 space-x-2">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                <div className="h-1 w-8 bg-gradient-to-r from-transparent to-purple-500 rounded-full"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="question" className="block text-sm font-semibold text-white/90 mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  Describe your supply chain scenario
                  <span className="ml-2">✨</span>
                </label>
                <div className="relative">
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 resize-none"
                    placeholder="✨ E.g., Analyze risks for shipping electronics from Shanghai to Los Angeles during monsoon season, considering current geopolitical tensions and port congestion..."
                    required
                  />
                  <div className="absolute bottom-3 right-3 flex space-x-1">
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-ping"></div>
                    <div className="h-2 w-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                  </div>
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

            {showResults && createQueryMutation.isSuccess && (
              <div className="mt-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-6">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-emerald-400 to-green-400 p-3 rounded-full mr-4 animate-pulse">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        ✅ AI Analysis Launched Successfully!
                      </h3>
                      <div className="mt-2 text-emerald-200">
                        <p>🤖 Our advanced AI agents are now processing your query...</p>
                        <p className="mt-1">📊 Check real-time results in your dashboard below ⬇️</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent AI Analysis - Futuristic Design */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
          <div className="relative bg-white/10 dark:bg-gray-800/50 backdrop-blur-2xl border border-white/30 rounded-3xl p-8">
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-2xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Recent AI Analysis
                  </h2>
                  <p className="text-white/70 text-sm">Real-time intelligent insights</p>
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
