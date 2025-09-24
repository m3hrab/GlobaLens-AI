'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryHistory } from '@/hooks/useQueries';
import { TrendingUp, Calendar, BarChart3, PieChart, LineChart, Activity } from 'lucide-react';
import type { Query } from '@/types/api';

function AnalyticsContent() {
  const { user } = useAuth();
  const { data: queryHistory, isLoading: historyLoading } = useQueryHistory(1, 100);

  // Process data for charts
  const processAnalyticsData = () => {
    if (!queryHistory?.queries) return null;

    const queries = queryHistory.queries;
    
    // Status distribution
    const statusCounts = queries.reduce((acc: Record<string, number>, query: Query) => {
      acc[query.status] = (acc[query.status] || 0) + 1;
      return acc;
    }, {});

    // Daily analysis count
    const dailyCounts = queries.reduce((acc: Record<string, number>, query: Query) => {
      const date = new Date(query.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Monthly trends
    const monthlyCounts = queries.reduce((acc: Record<string, number>, query: Query) => {
      const month = new Date(query.created_at).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return {
      totalQueries: queries.length,
      statusCounts,
      dailyCounts,
      monthlyCounts,
      recentQueries: queries.slice(0, 10)
    };
  };

  const analyticsData = processAnalyticsData();

  if (historyLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-full relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      <div className="absolute inset-0 dark:bg-gradient-to-tr dark:from-slate-700/10 dark:via-transparent dark:to-slate-600/10"></div>
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.1),transparent_50%)]"></div>
      
      <div className="dashboard-main-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
            <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text text-slate-800 dark:bg-gradient-to-r dark:from-blue-200 dark:via-indigo-300 dark:to-purple-400 dark:bg-clip-text dark:text-transparent">
              Analysis Analytics
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <span className="inline-flex items-center">
              <span className="mr-2">📊</span>
              Comprehensive insights and trends from your AI risk analysis
              <span className="ml-2">📈</span>
            </span>
          </p>
          <div className="mt-6 h-1 w-32 mx-auto bg-blue-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-600 rounded-full"></div>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Analyses */}
          <div className="group relative">
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-600/10 dark:to-indigo-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="stats-card relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white/90 mb-2">Total Analyses</h3>
              <p className="text-3xl font-bold text-blue-600 dark:bg-gradient-to-r dark:from-blue-300 dark:to-indigo-400 dark:bg-clip-text dark:text-transparent">
                {analyticsData?.totalQueries || 0}
              </p>
            </div>
          </div>

          {/* Completed */}
          <div className="group relative">
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-green-600/10 dark:to-emerald-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="stats-card relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white/90 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600 dark:bg-gradient-to-r dark:from-green-300 dark:to-emerald-400 dark:bg-clip-text dark:text-transparent">
                {analyticsData?.statusCounts?.completed || 0}
              </p>
            </div>
          </div>

          {/* Processing */}
          <div className="group relative">
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-amber-600/10 dark:to-orange-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="stats-card relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white/90 mb-2">Processing</h3>
              <p className="text-3xl font-bold text-amber-600 dark:bg-gradient-to-r dark:from-amber-300 dark:to-orange-400 dark:bg-clip-text dark:text-transparent">
                {analyticsData?.statusCounts?.processing || 0}
              </p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="group relative">
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-purple-600/10 dark:to-pink-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="stats-card relative bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white/90 mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-purple-600 dark:bg-gradient-to-r dark:from-purple-300 dark:to-pink-400 dark:bg-clip-text dark:text-transparent">
                {analyticsData?.totalQueries ? 
                  Math.round(((analyticsData.statusCounts?.completed || 0) / analyticsData.totalQueries) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Status Distribution Bar Chart */}
          <div className="recent-analysis-section relative group">
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-2xl border border-slate-200 dark:border-white/30 rounded-3xl p-8 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 mr-3 text-blue-400" />
                Analysis Status Chart
              </h3>
              
              {/* Simple Bar Chart */}
              <div className="space-y-6">
                {Object.entries(analyticsData?.statusCounts || {}).map(([status, count]) => {
                  const maxCount = Math.max(...Object.values(analyticsData?.statusCounts || {}));
                  const percentage = maxCount > 0 ? (count as number / maxCount) * 100 : 0;
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-3 ${
                            status === 'completed' ? 'bg-green-400' :
                            status === 'processing' ? 'bg-amber-400' :
                            status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-white capitalize font-medium">{status}</span>
                        </div>
                        <span className="text-white font-bold">{count as number}</span>
                      </div>
                      
                      {/* Bar */}
                      <div className="relative">
                        <div className="h-8 bg-gray-700/50 rounded-lg overflow-hidden">
                          <div 
                            className={`h-full rounded-lg transition-all duration-1000 ease-out ${
                              status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                              status === 'processing' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                              status === 'failed' ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                              'bg-gradient-to-r from-gray-500 to-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-white/80">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily Analysis Trends */}
          <div className="recent-analysis-section relative group">
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-2xl border border-slate-200 dark:border-white/30 rounded-3xl p-8 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                <LineChart className="h-6 w-6 mr-3 text-indigo-400" />
                Daily Analysis Trends
              </h3>
              
              {/* Simple Daily Bar Chart */}
              <div className="space-y-4">
                {Object.entries(analyticsData?.dailyCounts || {})
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .slice(-7) // Show last 7 days
                  .map(([date, count]) => {
                    const maxCount = Math.max(...Object.values(analyticsData?.dailyCounts || {}));
                    const percentage = maxCount > 0 ? (count as number / maxCount) * 100 : 0;
                    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                    
                    return (
                      <div key={date} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-white text-sm font-medium w-12">{dayName}</span>
                            <span className="text-gray-400 text-xs ml-2">
                              {new Date(date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-white font-bold">{count as number}</span>
                        </div>
                        
                        {/* Bar */}
                        <div className="relative">
                          <div className="h-6 bg-gray-700/50 rounded-lg overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-1000 ease-out"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-semibold text-white/80">
                              {count as number}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {Object.keys(analyticsData?.dailyCounts || {}).length === 0 && (
                <div className="text-center py-8">
                  <div className="h-16 w-16 mx-auto bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-white/60" />
                  </div>
                  <p className="text-gray-400">No daily data available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="recent-analysis-section relative group">
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-slate-500/20 dark:via-slate-600/20 dark:to-slate-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
          <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-2xl border border-slate-200 dark:border-white/30 rounded-3xl p-8 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-500">
            <div className="text-center">
              <div className="mb-6">
                <div className="h-16 w-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
                  We're working on advanced charting capabilities including interactive graphs, 
                  trend analysis, and detailed reporting features. Stay tuned for more powerful analytics!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500 dark:text-gray-400">
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 bg-blue-400 rounded-full mr-2"></div>
                  Interactive Charts
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 bg-indigo-400 rounded-full mr-2"></div>
                  Trend Analysis
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-2 w-2 bg-purple-400 rounded-full mr-2"></div>
                  Export Reports
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
