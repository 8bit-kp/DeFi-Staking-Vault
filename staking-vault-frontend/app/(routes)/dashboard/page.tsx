"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useState, useEffect } from "react";
import { sepolia } from "wagmi/chains";
import { STAKING_VAULT_ADDRESS, STAKING_VAULT_ABI, MOCK_TOKEN_ADDRESS, MOCK_TOKEN_ABI } from "@/lib/contracts";
import toast from "react-hot-toast";
import LoadingPopup from "@/components/LoadingPopup";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const isWrongNetwork = chainId !== sepolia.id;

  // Format helper
  const fmt = (value?: bigint, decimals = 4) =>
    value ? Number(formatEther(value)).toFixed(decimals) : "0.0000";

  // Read contract data with refetch
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: MOCK_TOKEN_ADDRESS,
    abi: MOCK_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: MOCK_TOKEN_ADDRESS,
    abi: MOCK_TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, STAKING_VAULT_ADDRESS] : undefined,
  });

  const { data: stakedBalance, refetch: refetchStaked } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "userBalance",
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined; refetch: () => void };

  const { data: totalStaked, refetch: refetchTotalStaked } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "totalStaked",
  }) as { data: bigint | undefined; refetch: () => void };

  const { data: rewardRate } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "rewardRate",
  }) as { data: bigint | undefined };

  const { data: earnedRewards, refetch: refetchRewards } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "earned",
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined; refetch: () => void };

  // Read contract owner for admin access
  const { data: contractOwner } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "owner",
  }) as { data: string | undefined };

  // Check if connected user is the owner
  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  // Auto-refresh rewards and total staked every 5 seconds
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      refetchRewards();
      refetchTotalStaked();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isConnected, address, refetchRewards, refetchTotalStaked]);

  // Write operations
  const { writeContract: approve, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { writeContract: stake, data: stakeHash, isPending: isStakePending } = useWriteContract();
  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawPending } = useWriteContract();
  const { writeContract: claimRewards, data: claimHash, isPending: isClaimPending } = useWriteContract();

  const { isLoading: isApproving, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isWithdrawing, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });
  const { isLoading: isClaiming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimHash });

  // Combined loading states
  const isApprovingTransaction = isApprovePending || isApproving;
  const isStakingTransaction = isStakePending || isStaking;
  const isWithdrawingTransaction = isWithdrawPending || isWithdrawing;
  const isClaimingTransaction = isClaimPending || isClaiming;

  // Handle transaction success and refetch data
  useEffect(() => {
    if (isApproveSuccess) {
      toast.success("Approval successful! You can now stake tokens.", { id: "approve" });
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isStakeSuccess) {
      toast.success(`Successfully staked ${stakeAmount} tokens!`, { id: "stake" });
      refetchBalance();
      refetchStaked();
      refetchTotalStaked();
      refetchRewards();
    }
  }, [isStakeSuccess, stakeAmount, refetchBalance, refetchStaked, refetchTotalStaked, refetchRewards]);

  useEffect(() => {
    if (isWithdrawSuccess) {
      toast.success(`Successfully withdrawn ${withdrawAmount} tokens!`, { id: "withdraw" });
      refetchBalance();
      refetchStaked();
      refetchTotalStaked();
      refetchRewards();
    }
  }, [isWithdrawSuccess, withdrawAmount, refetchBalance, refetchStaked, refetchTotalStaked, refetchRewards]);

  useEffect(() => {
    if (isClaimSuccess) {
      toast.success("Rewards claimed successfully!", { id: "claim" });
      refetchBalance();
      refetchRewards();
    }
  }, [isClaimSuccess, refetchBalance, refetchRewards]);

  const handleApprove = async () => {
    if (!canApprove) return;
    try {
      approve({
        address: MOCK_TOKEN_ADDRESS,
        abi: MOCK_TOKEN_ABI,
        functionName: "approve",
        args: [STAKING_VAULT_ADDRESS, parseEther("1000000")],
      });
    } catch (error: any) {
      console.error("Approve failed:", error);
      toast.error(error?.message || "Approval failed");
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
    } catch (error: any) {
      console.error("Stake failed:", error);
      toast.error(error?.message || "Staking failed");
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
    } catch (error: any) {
      console.error("Withdraw failed:", error);
      toast.error(error?.message || "Withdrawal failed");
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
    } catch (error: any) {
      console.error("Claim failed:", error);
      toast.error(error?.message || "Claim failed");
    }
  };

  // Button enable/disable logic
  const parsedStakeAmount = stakeAmount ? parseEther(stakeAmount) : 0n;
  const parsedWithdrawAmount = withdrawAmount ? parseEther(withdrawAmount) : 0n;
  
  // Check if allowance is sufficient for the stake amount
  const hasSufficientAllowance = allowance !== undefined && parsedStakeAmount > 0n && allowance >= parsedStakeAmount;
  const needsApproval = parsedStakeAmount > 0n && (allowance === undefined || allowance < parsedStakeAmount);

  const canApprove =
    isConnected &&
    needsApproval &&
    balance !== undefined &&
    balance > 0n &&
    !isApprovingTransaction;

  const canStake =
    isConnected &&
    hasSufficientAllowance &&
    parsedStakeAmount > 0n &&
    balance !== undefined &&
    parsedStakeAmount <= balance &&
    !isStakingTransaction;

  const canWithdraw =
    isConnected &&
    parsedWithdrawAmount > 0n &&
    stakedBalance !== undefined &&
    parsedWithdrawAmount <= stakedBalance &&
    !isWithdrawingTransaction;

  const canClaim =
    isConnected &&
    earnedRewards !== undefined &&
    earnedRewards > 0n &&
    !isClaimingTransaction;

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                {isConnected && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Live</span>
                  </div>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {isOwner && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </Link>
              )}
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(balance)} <span className="text-base text-gray-600 dark:text-gray-400">MOCK</span></p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Your Staked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(stakedBalance)} <span className="text-base text-gray-600 dark:text-gray-400">MOCK</span></p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Rewards Earned</p>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(earnedRewards)} <span className="text-base text-gray-600 dark:text-gray-400">MOCK</span></p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">APY</p>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{apy}%</p>
              </div>
            </div>

            {/* Action Cards with Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stake Tokens</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Enter amount to stake (e.g., 100)"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  
                  {/* Status and Balance Display */}
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                      Balance: {fmt(balance)} MOCK
                    </p>
                    {parsedStakeAmount > 0n && (
                      <div className="flex items-center gap-2">
                        {hasSufficientAllowance ? (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approved
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Needs Approval
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Approve and Stake Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={!canApprove}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                      title={!canApprove ? (hasSufficientAllowance ? "Already approved for this amount" : "Enter an amount first") : "Approve tokens for staking"}
                    >
                      {isApprovingTransaction ? "Approving..." : "1. Approve"}
                    </button>
                    <button
                      onClick={handleStake}
                      disabled={!canStake}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                      title={!canStake ? (needsApproval ? "Approve first" : "Enter a valid amount") : "Stake your tokens"}
                    >
                      {isStakingTransaction ? "Staking..." : "2. Stake"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Withdraw Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdraw Tokens</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount to withdraw (e.g., 50)"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Staked: {fmt(stakedBalance)} MOCK
                  </p>
                  
                  {/* Withdraw Button */}
                  <button
                    onClick={handleWithdraw}
                    disabled={!canWithdraw}
                    className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                    title={!canWithdraw ? "Enter a valid amount to withdraw" : "Withdraw your staked tokens"}
                  >
                    {isWithdrawingTransaction ? "Withdrawing..." : "Withdraw"}
                  </button>
                </div>
              </div>
            </div>

            {/* Rewards Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Rewards</h3>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {fmt(earnedRewards)} <span className="text-xl text-gray-600 dark:text-gray-400">MOCK</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {earnedRewards && earnedRewards > 0n ? "Ready to claim! " : "Start staking to earn rewards"}
                  </p>
                </div>
                <button
                  onClick={handleClaim}
                  disabled={!canClaim}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition shadow-lg disabled:shadow-none"
                  title={!canClaim ? "No rewards to claim yet" : "Claim your earned rewards"}
                >
                  {isClaimingTransaction ? "Claiming..." : "Claim Rewards"}
                </button>
              </div>
            </div>

            {/* Input Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ display: 'none' }}>
              {/* Old cards - hidden */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stake Tokens</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Amount</label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Enter amount to stake (e.g., 100)"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {needsApproval ? "Please approve first" : `Available: ${fmt(balance)} MOCK`}
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
                      placeholder="Enter amount to withdraw (e.g., 50)"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Staked: {fmt(stakedBalance)} MOCK
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

      {/* Loading Popups */}
      <LoadingPopup
        isOpen={isApprovingTransaction}
        message="Approving Tokens..."
        description="Please confirm the transaction in your wallet and wait for blockchain confirmation."
      />
      <LoadingPopup
        isOpen={isStakingTransaction}
        message="Staking Tokens..."
        description="Your tokens are being staked. This may take a few seconds."
      />
      <LoadingPopup
        isOpen={isWithdrawingTransaction}
        message="Withdrawing Tokens..."
        description="Your tokens are being withdrawn from the vault."
      />
      <LoadingPopup
        isOpen={isClaimingTransaction}
        message="Claiming Rewards..."
        description="Your rewards are being claimed and sent to your wallet."
      />
    </div>
  );
}
