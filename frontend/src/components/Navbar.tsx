'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, BarChart3, History, Home } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                GlobaLens AI
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (only for authenticated users) */}
          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/history"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
            </div>
          )}

          {/* Right: Theme Toggle, Login/Signup (for non-authenticated) or User Info + Logout (for authenticated) */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </div>
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
