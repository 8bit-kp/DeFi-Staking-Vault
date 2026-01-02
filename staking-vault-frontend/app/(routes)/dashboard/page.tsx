"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useState } from "react";
import { sepolia } from "wagmi/chains";
import { STAKING_VAULT_ADDRESS, STAKING_VAULT_ABI, MOCK_TOKEN_ADDRESS, MOCK_TOKEN_ABI } from "@/lib/contracts";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const isWrongNetwork = chainId !== sepolia.id;

  // Format helper
  const fmt = (value?: bigint, decimals = 4) =>
    value ? Number(formatEther(value)).toFixed(decimals) : "0.0000";

  // Read contract data
  const { data: balance } = useReadContract({
    address: MOCK_TOKEN_ADDRESS,
    abi: MOCK_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: allowance } = useReadContract({
    address: MOCK_TOKEN_ADDRESS,
    abi: MOCK_TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, STAKING_VAULT_ADDRESS] : undefined,
  });

  const { data: stakedBalance } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "userBalance",
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined };

  const { data: totalStaked } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "totalStaked",
  }) as { data: bigint | undefined };

  const { data: rewardRate } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "rewardRate",
  }) as { data: bigint | undefined };

  const { data: earnedRewards } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "earned",
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined };

  // Write operations
  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { writeContract: stake, data: stakeHash } = useWriteContract();
  const { writeContract: withdraw, data: withdrawHash } = useWriteContract();
  const { writeContract: claimRewards, data: claimHash } = useWriteContract();

  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isWithdrawing } = useWaitForTransactionReceipt({ hash: withdrawHash });
  const { isLoading: isClaiming } = useWaitForTransactionReceipt({ hash: claimHash });

  const handleApprove = async () => {
    if (!canApprove) return;
    try {
      approve({
        address: MOCK_TOKEN_ADDRESS,
        abi: MOCK_TOKEN_ABI,
        functionName: "approve",
        args: [STAKING_VAULT_ADDRESS, parseEther("1000000")],
      });
    } catch (error) {
      console.error("Approve failed:", error);
    }
  };

  const handleStake = async () => {
    if (!canStake) return;
    try {
      const amount = parseEther(stakeAmount);
      stake({
        address: STAKING_VAULT_ADDRESS,
        abi: STAKING_VAULT_ABI,
        functionName: "stake",
        args: [amount],
      });
      setStakeAmount("");
    } catch (error) {
      console.error("Stake failed:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    try {
      const amount = parseEther(withdrawAmount);
      withdraw({
        address: STAKING_VAULT_ADDRESS,
        abi: STAKING_VAULT_ABI,
        functionName: "withdraw",
        args: [amount],
      });
      setWithdrawAmount("");
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const handleClaim = async () => {
    if (!canClaim) return;
    try {
      claimRewards({
        address: STAKING_VAULT_ADDRESS,
        abi: STAKING_VAULT_ABI,
        functionName: "claimRewards",
      });
    } catch (error) {
      console.error("Claim failed:", error);
    }
  };

  // Button enable/disable logic
  const hasAllowance = allowance !== undefined && allowance > 0n;
  const parsedStakeAmount = stakeAmount ? parseEther(stakeAmount) : 0n;
  const parsedWithdrawAmount = withdrawAmount ? parseEther(withdrawAmount) : 0n;

  const canApprove =
    isConnected &&
    !hasAllowance &&
    balance !== undefined &&
    balance > 0n &&
    !isApproving;

  const canStake =
    isConnected &&
    hasAllowance &&
    parsedStakeAmount > 0n &&
    balance !== undefined &&
    parsedStakeAmount <= balance &&
    !isStaking;

  const canWithdraw =
    isConnected &&
    parsedWithdrawAmount > 0n &&
    stakedBalance !== undefined &&
    parsedWithdrawAmount <= stakedBalance &&
    !isWithdrawing;

  const canClaim =
    isConnected &&
    earnedRewards !== undefined &&
    earnedRewards > 0n &&
    !isClaiming;

  // APY calculation
  const SECONDS_PER_YEAR = 365n * 24n * 60n * 60n;
  let apy: string = "0.00";

  if (rewardRate !== undefined && totalStaked !== undefined && totalStaked > 0n) {
    const yearlyRewards = rewardRate * SECONDS_PER_YEAR;
    const apyValue = Number(formatEther(yearlyRewards)) / Number(formatEther(totalStaked)) * 100;
    apy = apyValue.toFixed(2);
  }

  // Wrong network view
  if (isWrongNetwork) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
                >
                  Home
                </Link>
                <ConnectButton />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Wrong Network</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Please switch to the Sepolia testnet in your wallet to use this application.
            </p>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 max-w-md mx-auto border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Current Network:</strong> {chainId}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <strong>Required:</strong> Sepolia ({sepolia.id})
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
              >
                Home
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Connect your wallet to start staking tokens and earning rewards
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Your Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(balance)}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Your Staked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(stakedBalance)}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Rewards Earned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(earnedRewards)}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">APY</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{apy}%</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleApprove}
                disabled={!canApprove}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
              >
                {isApproving ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={handleStake}
                disabled={!canStake}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
              >
                {isStaking ? "Staking..." : "Stake"}
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!canWithdraw}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </button>
              <button
                onClick={handleClaim}
                disabled={!canClaim}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
              >
                {isClaiming ? "Claiming..." : "Claim Rewards"}
              </button>
            </div>

            {/* Input Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stake Tokens</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {!hasAllowance ? "Please approve first" : `Available: ${fmt(balance)}`}
                  </p>
                </div>
              </div>

              {/* Withdraw Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdraw Tokens</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Staked: {fmt(stakedBalance)}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">How it works</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    1. Approve tokens → 2. Stake tokens → 3. Earn rewards → 4. Claim or withdraw anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
