"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staking Vault</h1>
            </div>
            <div className="flex items-center gap-3">
              {isConnected && (
                <Link 
                  href="/dashboard"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition"
                >
                  Dashboard
                </Link>
              )}
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Hero Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
              DeFi Staking Vault
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stake your tokens and earn passive rewards with our secure and transparent DeFi staking protocol
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 pt-8">
            {isConnected ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-xl transition-all duration-200 text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl text-lg">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button onClick={openConnectModal}>
                      Connect Wallet to Start
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            )}
            <a
              href="https://github.com/8bit-kp/DeFi-Staking-Vault"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-200 text-lg"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure & Audited</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built with industry-standard security practices and OpenZeppelin contracts
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Earn Rewards</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Stake your tokens and earn passive rewards with competitive APY rates
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Fast & Easy</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Simple interface for staking, withdrawing, and claiming rewards in seconds
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">24/7</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Active Staking</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">Instant</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Reward Claims</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0%</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Platform Fees</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">100%</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Transparent</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Built with Solidity, Next.js, and Web3 technologies</p>
            <p className="mt-2">© 2026 DeFi Staking Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
