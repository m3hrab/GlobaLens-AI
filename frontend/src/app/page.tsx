import Link from 'next/link';
import { ArrowRight, Shield, BarChart3, Globe, AlertTriangle } from 'lucide-react';

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