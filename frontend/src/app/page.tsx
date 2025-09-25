import Link from 'next/link';
import { ArrowRight, Shield, BarChart3, Globe, AlertTriangle, TrendingUp, Zap, Target, Star, MapPin, Cloud, Ship, Factory } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden w-full">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <iframe
            src="https://player.vimeo.com/video/1121692387?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0"
            className="absolute inset-0 w-full h-full"
            style={{ 
              position: 'absolute',
              top: '-15em',
              left: 0,
              width: '100vw',
              height: '150%',
              minWidth: '100vw',
              objectFit: 'cover',
              zIndex: -1
            }}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block">GlobaLens AI</span>
              <span className="block text-blue-200 text-xl md:text-2xl font-normal mt-4">
                Global Supply Chain Risk Monitoring
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Real-time, multi-agent AI platform for global supply chain risk monitoring and predictive insights.
              Powered by SmythOS for intelligent risk assessment and mitigation strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
          <section className="py-20 bg-white dark:gradient-purple-blue transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Intelligent Supply Chain Risk Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Leverage AI-powered agents to monitor global shipping routes, predict disruptions, 
              and receive actionable mitigation strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:gradient-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 glass-effect hover-glow">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Global Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time monitoring of shipping routes from major ports worldwide
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 dark:gradient-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 glass-effect hover-glow">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Risk Detection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI agents analyze weather, geopolitical, and operational risks in real-time
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:gradient-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 glass-effect hover-glow">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Mitigation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive prioritized action plans to minimize supply chain disruptions
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:gradient-card w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 glass-effect hover-glow">
                <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive dashboards with risk heatmaps and trend analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How GlobaLens AI Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our multi-agent AI system continuously monitors global supply chains and provides real-time insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">1</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Collection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI agents continuously gather data from weather services, port authorities, shipping companies, and geopolitical sources
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">2</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced machine learning models analyze patterns, predict disruptions, and assess risk levels across multiple dimensions
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">3</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Actionable Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive prioritized recommendations and alternative routes to minimize supply chain disruptions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Categories Section */}
      <section className="py-20 bg-white dark:bg-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Risk Monitoring
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI agents monitor multiple risk categories to provide complete supply chain visibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-2xl border border-red-200 dark:border-red-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-red-500 p-3 rounded-xl mr-4">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Weather & Climate</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor hurricanes, storms, ice conditions, and extreme weather events affecting shipping routes
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Real-time weather tracking</li>
                <li>• Storm path predictions</li>
                <li>• Port closure alerts</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 p-3 rounded-xl mr-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Geopolitical</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track political instability, trade disputes, sanctions, and regional conflicts affecting global trade
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Political risk assessment</li>
                <li>• Trade policy changes</li>
                <li>• Sanction monitoring</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 p-3 rounded-xl mr-4">
                  <Ship className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Operational</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor port congestion, vessel delays, equipment shortages, and infrastructure issues
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Port capacity tracking</li>
                <li>• Vessel delay alerts</li>
                <li>• Equipment availability</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 p-3 rounded-xl mr-4">
                  <Factory className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Supply Chain</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track supplier disruptions, manufacturing delays, and inventory levels across the supply network
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Supplier risk monitoring</li>
                <li>• Production delays</li>
                <li>• Inventory tracking</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 p-3 rounded-xl mr-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Market Dynamics</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Analyze demand fluctuations, price volatility, and market trends affecting supply chains
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Demand forecasting</li>
                <li>• Price trend analysis</li>
                <li>• Market volatility</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800/30">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-500 p-3 rounded-xl mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Security & Compliance</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor security threats, regulatory changes, and compliance requirements across regions
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Security threat assessment</li>
                <li>• Regulatory compliance</li>
                <li>• Customs delays</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Global Leaders
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of companies already using GlobaLens AI to protect their supply chains
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">99.7%</div>
              <div className="text-lg text-blue-100">Risk Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">24/7</div>
              <div className="text-lg text-blue-100">Continuous Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">50+</div>
              <div className="text-lg text-blue-100">Countries Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">10M+</div>
              <div className="text-lg text-blue-100">Data Points Analyzed Daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how GlobaLens AI is transforming supply chain management for companies worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                &ldquo;GlobaLens AI helped us avoid a major disruption when Hurricane Maria was approaching. The early warning system saved us millions in potential losses.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">JS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">John Smith</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">CTO, Global Logistics Inc.</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                &ldquo;The AI predictions are incredibly accurate. We&apos;ve reduced our supply chain risks by 85% since implementing GlobaLens AI.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Maria Rodriguez</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Supply Chain Director, TechCorp</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                &ldquo;Real-time monitoring and predictive analytics have revolutionized how we manage our global operations. Highly recommended!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">DL</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">David Lee</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Operations Manager, MegaCorp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
          <section className="bg-gray-50 dark:gradient-card py-16 transition-colors">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Supply Chain Intelligence?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join leading logistics companies using GlobaLens AI to stay ahead of global disruptions.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400 dark:text-blue-300" />
              <span className="text-xl font-bold">GlobaLens AI</span>
            </div>
            <p className="text-gray-400 dark:text-gray-300 mb-4">
              Built for HackTheAI 2025 • Powered by SmythOS • Engineered for Impact
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Team BUBT_Droptouts
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}