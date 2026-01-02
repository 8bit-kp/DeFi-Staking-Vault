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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 border border-red-200 dark:border-red-900 rounded-2xl flex items-center justify-center">
            <svg className="w-16 h-16 text-red-500 dark:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-4">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">Something went wrong!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            An error occurred while loading the dashboard. This could be due to network issues or contract interaction problems.
          </p>
          {error.message && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 mt-4">
              <p className="text-sm text-red-700 dark:text-red-400 font-mono break-words text-left">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-block"
          >
            Go Home
          </a>
        </div>

        {/* Helpful Tips */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-8 text-left">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Troubleshooting Tips:</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 dark:text-gray-600 mt-1">•</span>
              <span>Make sure you're connected to the Sepolia test network</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 dark:text-gray-600 mt-1">•</span>
              <span>Check that your wallet is properly connected</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 dark:text-gray-600 mt-1">•</span>
              <span>Try refreshing your browser or reconnecting your wallet</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 dark:text-gray-600 mt-1">•</span>
              <span>Ensure you have enough ETH for gas fees</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
