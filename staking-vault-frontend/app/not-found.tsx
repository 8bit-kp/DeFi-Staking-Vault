"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/50">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-white">404</h1>
          <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-pink-500/50 text-lg"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 text-lg"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
