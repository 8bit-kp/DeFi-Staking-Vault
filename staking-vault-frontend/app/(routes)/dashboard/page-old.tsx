"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useState, useEffect } from "react";
import { sepolia } from "wagmi/chains";
import { STAKING_VAULT_ADDRESS, STAKING_VAULT_ABI, MOCK_TOKEN_ADDRESS, MOCK_TOKEN_ABI } from "@/lib/contracts";


export default function Home() {
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
        args: [STAKING_VAULT_ADDRESS, parsedStakeAmount],
      });
    } catch (e) {
      console.error("Approve failed", e);
    }
  };

  const handleStake = async () => {
    if (!canStake) return;

    try {
      stake({
        address: STAKING_VAULT_ADDRESS,
        abi: STAKING_VAULT_ABI,
        functionName: "stake",
        args: [parsedStakeAmount],
      });
    } catch (e) {
      console.error("Stake failed", e);
    }
  };

  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    try {
      withdraw({
        address: STAKING_VAULT_ADDRESS,
        abi: STAKING_VAULT_ABI,
        functionName: "withdraw",
        args: [parsedWithdrawAmount],
      });
    } catch (e) {
      console.error("Withdraw failed", e);
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
    } catch (e) {
      console.error("Claim failed", e);
    }
  };


  const parsedStakeAmount =
    stakeAmount && Number(stakeAmount) > 0
      ? parseEther(stakeAmount)
      : 0n;

  const parsedWithdrawAmount =
    withdrawAmount && Number(withdrawAmount) > 0
      ? parseEther(withdrawAmount)
      : 0n;

  const canApprove =
    isConnected &&
    parsedStakeAmount > 0n &&
    !isApproving;

  const canStake =
    isConnected &&
    parsedStakeAmount > 0n &&
    allowance !== undefined &&
    allowance >= parsedStakeAmount &&
    !isApproving &&
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

  // -------- APY calculation --------
  const SECONDS_PER_YEAR = 365n * 24n * 60n * 60n;

  let apy: string = "0.00";

  if (
    rewardRate !== undefined &&
    totalStaked !== undefined &&
    totalStaked > 0n
  ) {
    const yearlyRewards = rewardRate * SECONDS_PER_YEAR;
    const apyValue =
      Number(formatEther(yearlyRewards)) /
      Number(formatEther(totalStaked)) *
      100;

    apy = apyValue.toFixed(2);
  }

  if (isWrongNetwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">Staking Vault</h1>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Wrong Network</h3>
                <p className="text-sm mt-1">Please switch to Sepolia network to use this app.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Staking Vault</h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
              <p className="text-gray-400 max-w-md">
                Connect your wallet to start staking tokens and earning rewards
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Token Balance</p>
                <p className="text-2xl font-bold text-white">
                  {fmt(balance)}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Your Staked</p>
                <p className="text-2xl font-bold text-purple-400">
                  {fmt(stakedBalance)}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">Rewards Earned</p>
                <p className="text-2xl font-bold text-green-400">
                  {fmt(earnedRewards)}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <p className="text-gray-400 text-sm mb-2">APY</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {apy}%
                </p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Stake Tokens</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Amount to Stake</label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={!canApprove}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none active:scale-95"
                    >
                      {isApproving ? "Approving..." : "Approve"}
                    </button>

                    <button
                      onClick={handleStake}
                      disabled={!canStake}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 disabled:hover:from-gray-600 disabled:hover:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/50 disabled:shadow-none active:scale-95"
                    >
                      {isStaking ? "Staking..." : "Stake"}
                    </button>

                  </div>
                </div>
              </div>

              {/* Withdraw Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Withdraw & Claim</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Amount to Withdraw</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <button
                    onClick={handleWithdraw}
                    disabled={!canWithdraw}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/50 disabled:shadow-none active:scale-95"
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                  </button>

                  <button
                    onClick={handleClaim}
                    disabled={!canClaim}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-600 disabled:hover:from-gray-600 disabled:hover:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-yellow-500/50 disabled:shadow-none active:scale-95"
                  >
                    {isClaiming ? "Claiming..." : "Claim Rewards"}
                  </button>

                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Reward Rate</h4>
                  <p className="text-gray-400 text-sm">
                    Current reward rate:{" "}
                    {rewardRate
                      ? `${formatEther(rewardRate)} tokens / sec`
                      : "0 tokens / sec"}
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
