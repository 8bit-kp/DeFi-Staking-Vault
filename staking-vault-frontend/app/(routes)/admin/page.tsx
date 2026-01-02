"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { formatEther, parseEther, isAddress } from "viem";
import { useState, useEffect } from "react";
import { sepolia } from "wagmi/chains";
import { STAKING_VAULT_ADDRESS, STAKING_VAULT_ABI, MOCK_TOKEN_ADDRESS, MOCK_TOKEN_ABI } from "@/lib/contracts";
import toast from "react-hot-toast";
import LoadingPopup from "@/components/LoadingPopup";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [newRewardRate, setNewRewardRate] = useState("");
  const [tokensPerSecond, setTokensPerSecond] = useState("");
  const [airdropAddress, setAirdropAddress] = useState("");
  const [airdropAmount, setAirdropAmount] = useState("");

  const isWrongNetwork = chainId !== sepolia.id;

  // Format helper
  const fmt = (value?: bigint, decimals = 4) =>
    value ? Number(formatEther(value)).toFixed(decimals) : "0.0000";

  // Read contract owner
  const { data: contractOwner } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "owner",
  }) as { data: string | undefined };

  // Read current reward rate
  const { data: currentRewardRate, refetch: refetchRewardRate } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "rewardRate",
  }) as { data: bigint | undefined; refetch: () => void };

  // Read total staked
  const { data: totalStaked } = useReadContract({
    address: STAKING_VAULT_ADDRESS,
    abi: STAKING_VAULT_ABI,
    functionName: "totalStaked",
  }) as { data: bigint | undefined };

  // Read admin's token balance
  const { data: adminBalance, refetch: refetchAdminBalance } = useReadContract({
    address: MOCK_TOKEN_ADDRESS,
    abi: MOCK_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  }) as { data: bigint | undefined; refetch: () => void };

  // Check if connected user is the owner
  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  // Write operation for setting reward rate
  const { writeContract: setRewardRate, data: setRewardRateHash, isPending: isSetRewardRatePending } = useWriteContract();

  const { isLoading: isSettingRewardRate, isSuccess: isSetRewardRateSuccess } = useWaitForTransactionReceipt({ 
    hash: setRewardRateHash 
  });

  // Write operation for airdrop
  const { writeContract: airdrop, data: airdropHash, isPending: isAirdropPending } = useWriteContract();

  const { isLoading: isAirdropping, isSuccess: isAirdropSuccess } = useWaitForTransactionReceipt({ 
    hash: airdropHash 
  });

  const isSettingRewardRateTransaction = isSetRewardRatePending || isSettingRewardRate;
  const isAirdropTransaction = isAirdropPending || isAirdropping;

  // Handle successful reward rate update
  useEffect(() => {
    if (isSetRewardRateSuccess) {
      toast.success("Reward rate updated successfully! 🎉", { id: "setRewardRate" });
      refetchRewardRate();
      setNewRewardRate("");
      setTokensPerSecond("");
    }
  }, [isSetRewardRateSuccess, refetchRewardRate]);

  // Handle successful airdrop
  useEffect(() => {
    if (isAirdropSuccess) {
      toast.success("Tokens airdropped successfully! 🎉", { id: "airdrop" });
      refetchAdminBalance();
      setAirdropAddress("");
      setAirdropAmount("");
    }
  }, [isAirdropSuccess, refetchAdminBalance]);

  // Handle reward rate update
  const handleSetRewardRate = async () => {
    if (!newRewardRate || !isOwner) return;

    const toastId = toast.loading("Setting reward rate...");
    
    try {
      const rateInWei = parseEther(newRewardRate);
      
      setRewardRate({
        address: STAKING_VAULT_ADDRESS,
        abi: STAKING_VAULT_ABI,
        functionName: "setRewardRate",
        args: [rateInWei],
        gas: 150000n, // Set reasonable gas limit
      });

      toast.loading("Waiting for wallet confirmation...", { id: toastId });
    } catch (error: any) {
      console.error("Error setting reward rate:", error);
      toast.error(error.message || "Failed to set reward rate", { id: toastId });
    }
  };

  // Handle tokens per second input change
  const handleTokensPerSecondChange = (value: string) => {
    setTokensPerSecond(value);
    setNewRewardRate(value);
  };

  // Handle airdrop
  const handleAirdrop = async () => {
    if (!airdropAddress || !airdropAmount || !isOwner) return;

    // Validate address
    if (!isAddress(airdropAddress)) {
      toast.error("Invalid Ethereum address");
      return;
    }

    const toastId = toast.loading("Sending tokens...");
    
    try {
      const amountInWei = parseEther(airdropAmount);
      
      // Check if admin has enough balance
      if (adminBalance && amountInWei > adminBalance) {
        toast.error("Insufficient token balance", { id: toastId });
        return;
      }
      
      airdrop({
        address: MOCK_TOKEN_ADDRESS,
        abi: MOCK_TOKEN_ABI,
        functionName: "transfer",
        args: [airdropAddress as `0x${string}`, amountInWei],
      });

      toast.loading("Waiting for wallet confirmation...", { id: toastId });
    } catch (error: any) {
      console.error("Error airdropping tokens:", error);
      toast.error(error.message || "Failed to airdrop tokens", { id: toastId });
    }
  };

  // Calculate APY
  const calculateAPY = () => {
    if (!currentRewardRate || !totalStaked || totalStaked === 0n) return "0.00";
    
    const rewardsPerYear = Number(currentRewardRate) * 365 * 24 * 60 * 60;
    const totalStakedNum = Number(totalStaked);
    const apy = (rewardsPerYear / totalStakedNum) * 100;
    
    return apy.toFixed(2);
  };

  // Calculate stats
  const tokensPerDay = currentRewardRate ? Number(formatEther(currentRewardRate * 86400n)) : 0;
  const tokensPerYear = currentRewardRate ? Number(formatEther(currentRewardRate * 31536000n)) : 0;

  // Wrong network screen
  if (isConnected && isWrongNetwork) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/" className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition-colors font-medium">
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
              Please switch to the Sepolia testnet in your wallet to access the admin panel.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                {isOwner && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>Owner Access</span>
                  </div>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/" className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg transition-colors font-medium">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Access Required</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Connect your wallet to access the admin panel and manage reward rates.
            </p>
            <ConnectButton />
          </div>
        ) : !isOwner ? (
          <div className="text-center py-20 space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              You must be the contract owner to access this admin panel.
            </p>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 max-w-md mx-auto border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Your Address:</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-1 break-all">
                {address}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                <strong>Contract Owner:</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-1 break-all">
                {contractOwner}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Reward Rate */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Reward Rate</h3>
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {currentRewardRate ? fmt(currentRewardRate, 6) : "0.000000"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">tokens/second</p>
              </div>

              {/* Daily Rewards */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Rewards</h3>
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {tokensPerDay.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">MOCK tokens</p>
              </div>

              {/* Current APY */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Current APY</h3>
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {calculateAPY()}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">annual yield</p>
              </div>
            </div>

            {/* Set Reward Rate */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Set New Reward Rate</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                    Tokens Per Second
                  </label>
                  <input
                    type="number"
                    value={tokensPerSecond}
                    onChange={(e) => handleTokensPerSecondChange(e.target.value)}
                    placeholder="e.g., 0.01 (864 tokens/day)"
                    step="0.000001"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  />
                  {tokensPerSecond && (
                    <div className="mt-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Preview:</p>
                      <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                        <li>• Per second: {tokensPerSecond} MOCK</li>
                        <li>• Per day: {(Number(tokensPerSecond) * 86400).toFixed(2)} MOCK</li>
                        <li>• Per year: {(Number(tokensPerSecond) * 31536000).toFixed(2)} MOCK</li>
                      </ul>
                    </div>
                  )}
                </div>

                {tokensPerSecond && (
                  <button
                    onClick={handleSetRewardRate}
                    disabled={isSettingRewardRateTransaction}
                    className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white dark:text-gray-900 font-medium rounded-lg transition"
                  >
                    {isSettingRewardRateTransaction ? "Setting Reward Rate..." : "Set Reward Rate"}
                  </button>
                )}
              </div>
            </div>

            {/* Airdrop Tokens */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Airdrop MOCK Tokens</h3>
                <div className="bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-lg">
                  <p className="text-xs font-semibold text-green-800 dark:text-green-300">
                    Balance: {fmt(adminBalance)} MOCK
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={airdropAddress}
                    onChange={(e) => setAirdropAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                    Amount (MOCK)
                  </label>
                  <input
                    type="number"
                    value={airdropAmount}
                    onChange={(e) => setAirdropAmount(e.target.value)}
                    placeholder="e.g., 1000"
                    step="0.000001"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  />
                  {airdropAmount && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Sending: <span className="font-semibold text-gray-900 dark:text-white">{airdropAmount} MOCK</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={handleAirdrop}
                  disabled={!airdropAddress || !airdropAmount || isAirdropTransaction || !isAddress(airdropAddress)}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                >
                  {isAirdropTransaction ? "Sending Tokens..." : "Airdrop Tokens"}
                </button>

                {airdropAddress && !isAddress(airdropAddress) && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⚠️ Invalid Ethereum address
                  </p>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Important Information</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• <strong>Reward Rate:</strong> Only the contract owner can set the reward rate</li>
                <li>• Changes take effect immediately after transaction confirmation</li>
                <li>• Make sure you have enough tokens in the vault to cover rewards</li>
                <li>• Higher reward rates = faster token distribution</li>
                <li>• APY is calculated based on total staked amount</li>
                <li className="pt-2 border-t border-gray-700">• <strong>Airdrop:</strong> Send MOCK tokens directly from your wallet to any address</li>
                <li>• Tokens are transferred from your balance, not the vault contract</li>
                <li>• Useful for distributing tokens to new users for testing</li>
              </ul>
            </div>

            {/* Contract Info */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Staking Vault Address:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{STAKING_VAULT_ADDRESS}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">MOCK Token Address:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{MOCK_TOKEN_ADDRESS}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contract Owner:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{contractOwner}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Staked:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">{fmt(totalStaked)} MOCK</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Token Balance:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">{fmt(adminBalance)} MOCK</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Loading Popups */}
      <LoadingPopup
        isOpen={isSettingRewardRateTransaction}
        message="Setting Reward Rate..."
        description="Please confirm the transaction in your wallet. The new reward rate will be active immediately after confirmation."
      />
      <LoadingPopup
        isOpen={isAirdropTransaction}
        message="Sending Tokens..."
        description="Airdropping MOCK tokens to the recipient address. Please wait for confirmation."
      />
    </div>
  );
}
