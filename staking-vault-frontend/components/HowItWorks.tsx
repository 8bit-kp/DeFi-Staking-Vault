export default function HowItWorks() {
  return (
    <div className="mt-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Our staking vault makes it simple to earn passive income. Follow these steps to start earning rewards on your tokens.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Connect Wallet */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Connect Your Wallet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Click the "Connect Wallet" button in the top right corner to connect your Web3 wallet. We support MetaMask, WalletConnect, and other popular wallets through RainbowKit integration.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Supported Networks:</strong></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• Ethereum Sepolia Testnet (Chain ID: 11155111)</li>
                  <li>• Make sure you have test ETH for gas fees</li>
                  <li>• Get free Sepolia ETH from <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">faucets</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Get Tokens */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Acquire MOCK Tokens</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                You'll need MOCK tokens to stake. These are ERC20 test tokens deployed on Sepolia. Your wallet will automatically display your MOCK token balance on the dashboard.
              </p>
              
              {/* Airdrop Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                  <strong>🎁 Need MOCK Tokens?</strong>
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Contact <a href="https://x.com/0xkishan_" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-300">@0xkishan_</a> on X (Twitter) for an airdrop of MOCK tokens!
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Token Details:</strong></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Contract:</span>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs break-all">0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Symbol:</span>
                    <span>MOCK</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Decimals:</span>
                    <span>18</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Approve Tokens */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Approve Token Spending</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Before staking, you need to approve the staking vault contract to spend your MOCK tokens. This is a standard security feature of ERC20 tokens that gives you full control over your assets.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>How Approval Works:</strong></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                  <li>• Enter the amount you want to stake</li>
                  <li>• Click "1. Approve" button (appears when approval is needed)</li>
                  <li>• Confirm the transaction in your wallet</li>
                  <li>• Wait for blockchain confirmation (~15 seconds)</li>
                  <li>• The approval persists - you won't need to approve again for the same or smaller amounts</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Pro Tip:</strong> If you see a green "✓ Approved" badge, you already have sufficient approval and can skip directly to staking!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Stake Tokens */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">4</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Stake Your Tokens</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                After approval, you're ready to stake! Your tokens will be locked in the smart contract and start earning rewards immediately based on the current APY rate.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Staking Process:</strong></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                  <li>• Click "2. Stake" button (enabled after approval)</li>
                  <li>• Confirm the staking transaction in your wallet</li>
                  <li>• Your tokens are transferred to the vault contract</li>
                  <li>• Rewards start accumulating immediately</li>
                  <li>• You can stake additional tokens anytime to increase your position</li>
                  <li>• Your staked balance is displayed in the dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Earn & Track Rewards */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">5</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Watch Your Rewards Grow</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Once staked, your rewards accumulate automatically every second. The dashboard updates every 5 seconds to show your live earnings and current APY.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Rewards Explained:</strong></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                  <li>• <strong>Real-time tracking:</strong> See your rewards update live with a pulsing green indicator</li>
                  <li>• <strong>APY display:</strong> Current Annual Percentage Yield shown with live updates</li>
                  <li>• <strong>Compound growth:</strong> Rewards are calculated based on your staked amount</li>
                  <li>• <strong>No lock period:</strong> You can claim rewards or withdraw anytime</li>
                  <li>• <strong>Precision:</strong> Rewards calculated per second for maximum accuracy</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">Earned Rewards</p>
                  <p className="text-xs text-green-700 dark:text-green-400">Displays your accumulated MOCK tokens ready to claim</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">✓ Current APY</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Shows the annual return rate on your staked tokens</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 6: Claim Rewards */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-pink-600 dark:text-pink-400">6</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Claim Your Rewards</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Anytime you have earned rewards greater than zero, you can claim them. The rewards are transferred directly to your wallet while your staked amount remains in the vault earning more rewards.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Claiming Process:</strong></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                  <li>• Check your rewards in the yellow rewards card</li>
                  <li>• Click "Claim Rewards" button when you have rewards to claim</li>
                  <li>• Confirm the transaction in your wallet</li>
                  <li>• Rewards are sent to your wallet instantly after confirmation</li>
                  <li>• Your staked tokens remain in the vault</li>
                  <li>• Continue earning new rewards immediately</li>
                  <li>• Claim as often as you like - no restrictions!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step 7: Withdraw */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">7</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Withdraw Your Stake</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Need your tokens back? You can withdraw part or all of your staked tokens at any time. There's no lock-up period or withdrawal penalties.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>Withdrawal Options:</strong></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                  <li>• <strong>Partial withdrawal:</strong> Enter any amount up to your staked balance</li>
                  <li>• <strong>Full withdrawal:</strong> Withdraw your entire staked amount at once</li>
                  <li>• <strong>No penalties:</strong> There are no fees or penalties for withdrawing</li>
                  <li>• <strong>Unclaimed rewards:</strong> Your accumulated rewards remain claimable after withdrawal</li>
                  <li>• <strong>Instant access:</strong> Tokens are returned to your wallet immediately after confirmation</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Important:</strong> When you withdraw, you stop earning rewards on the withdrawn amount. Consider claiming your rewards first before withdrawing to maximize your earnings!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
