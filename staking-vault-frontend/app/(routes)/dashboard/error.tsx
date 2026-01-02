"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/50">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">Something went wrong!</h2>
          <p className="text-xl text-gray-300">
            An error occurred while loading the dashboard. This could be due to network issues or contract interaction problems.
          </p>
          {error.message && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
              <p className="text-sm text-red-300 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <button
            onClick={reset}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-pink-500/50 text-lg"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 text-lg inline-block"
          >
            Go Home
          </a>
        </div>

        {/* Helpful Tips */}
        <div className="bg-white/5 rounded-xl p-6 mt-8 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Troubleshooting Tips:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">•</span>
              <span>Make sure you're connected to the Sepolia test network</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">•</span>
              <span>Check that your wallet is properly connected</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">•</span>
              <span>Try refreshing your browser or reconnecting your wallet</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">•</span>
              <span>Ensure you have enough ETH for gas fees</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
