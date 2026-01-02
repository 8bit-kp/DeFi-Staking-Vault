# User Guide: How to Stake Tokens

This guide will walk you through the complete process of staking tokens in the DeFi Staking Vault, from setting up your wallet to claiming your rewards.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Staking Process](#step-by-step-staking-process)
3. [Understanding the Dashboard](#understanding-the-dashboard)
4. [How Rewards Work](#how-rewards-work)
5. [Withdrawing and Claiming](#withdrawing-and-claiming)
6. [Troubleshooting](#troubleshooting)
7. [Safety Tips](#safety-tips)

---

## Prerequisites

Before you start staking, make sure you have:

### 1. MetaMask Wallet (or compatible wallet)
- Download from [metamask.io](https://metamask.io)
- Create a new wallet or import existing one
- **IMPORTANT**: Save your seed phrase securely - never share it with anyone!

### 2. Sepolia Testnet ETH
- You need ETH for gas fees (transaction costs)
- Get free Sepolia ETH from faucets:
  - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
  - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
  - [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

### 3. Test Tokens to Stake
- You'll need the MockERC20 tokens deployed on Sepolia
- Contract Address: `0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03`
- See [Getting Test Tokens](#getting-test-tokens) section below

---

## Step-by-Step Staking Process

### Step 1: Add Sepolia Network to MetaMask

If you haven't added Sepolia network yet:

1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Add Network"
4. Click "Add Network Manually"
5. Enter the following details:
   ```
   Network Name: Sepolia
   RPC URL: https://ethereum-sepolia-rpc.publicnode.com
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```
6. Click "Save"
7. Switch to Sepolia network

### Step 2: Get Test Tokens

**Option A: Mint Tokens (if you have minting access)**

Open Hardhat console:
```bash
cd defi-staking-vault
npx hardhat console --network sepolia
```

Run:
```javascript
const MockERC20 = await ethers.getContractAt("MockERC20", "0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03")
await MockERC20.mint("YOUR_WALLET_ADDRESS", ethers.parseEther("1000"))
```

**Option B: Ask Project Owner**

Contact the project owner to mint tokens to your address.

### Step 3: Visit the Staking Dashboard

1. Open your browser and go to: [Your deployment URL]
2. You'll see the landing page with project information
3. Click "Launch App" or "Go to Dashboard"
4. You'll be redirected to `/dashboard`

### Step 4: Connect Your Wallet

1. On the dashboard, you'll see a "Connect Wallet" button in the top right
2. Click "Connect Wallet"
3. A modal will appear showing wallet options:
   - MetaMask
   - WalletConnect
   - Coinbase Wallet
   - Rainbow
   - And more...
4. Select your wallet (e.g., MetaMask)
5. MetaMask will pop up asking for permission
6. Click "Next" then "Connect"
7. Your wallet is now connected!

**What you'll see after connecting:**
- Your wallet address (shortened) in the top right
- Your token balance
- Your staked amount (initially 0)
- Your earned rewards (initially 0)
- Current APY (Annual Percentage Yield)

### Step 5: Check Network

**IMPORTANT**: Make sure you're on Sepolia network!

If you see a "Wrong Network" message:
1. The dashboard will show an alert: "Please switch to Sepolia network"
2. Open MetaMask
3. Click the network dropdown
4. Select "Sepolia"
5. Refresh the page

### Step 6: Approve Token Spending (First Time Only)

Before you can stake, you need to give permission to the Staking Vault contract to spend your tokens.

1. Look at the "Your Balance" section - it shows how many tokens you have
2. Find the "Approve" button (it's BLUE)
3. Click the "Approve" button
4. MetaMask will pop up showing the transaction details:
   ```
   Contract: StakingVault
   Function: approve
   Gas Fee: ~$0.01 (varies)
   ```
5. Review and click "Confirm"
6. Wait for the transaction to complete (10-30 seconds)
7. You'll see a success notification

**What just happened?**
You gave the Staking Vault contract permission to transfer your tokens when you stake. This is a standard security practice in DeFi.

### Step 7: Stake Your Tokens

Now you're ready to stake!

1. The "Approve" button should now be disabled
2. The "Stake" button (GREEN) should now be enabled
3. Enter the amount you want to stake (e.g., "100")
4. Click the "Stake" button
5. MetaMask will pop up:
   ```
   Contract: StakingVault
   Function: stake
   Amount: 100 tokens
   Gas Fee: ~$0.02 (varies)
   ```
6. Review and click "Confirm"
7. Wait for confirmation (10-30 seconds)
8. Success! You're now staking!

**What you'll see after staking:**
- "Your Balance" decreased by staked amount
- "Your Staked" increased by staked amount
- "Rewards Earned" starts accumulating
- APY percentage displayed

### Step 8: Watch Your Rewards Grow

Your rewards start accumulating **immediately** and grow every second!

**How to check rewards:**
- The "Rewards Earned" section updates automatically
- Rewards are calculated based on:
  ```
  Your Rewards = (Your Staked Amount / Total Staked) × Reward Rate × Time
  ```

**Example:**
- You staked: 100 tokens
- Total staked in vault: 10,000 tokens
- Your share: 1%
- Reward rate: 1 token per second
- Your rewards: 1% of 1 = 0.01 tokens per second
- Per hour: 36 tokens
- Per day: 864 tokens

---

## Understanding the Dashboard

### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│                    Top Bar                          │
│  DeFi Staking Vault              [Connect Wallet]   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  Stats Cards                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│ │ Balance  │ │  Staked  │ │ Rewards  │ │   APY   │ │
│ │ 900.00   │ │ 100.00   │ │  25.50   │ │ 31.54%  │ │
│ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 Action Buttons                      │
│ [Approve] [Stake] [Withdraw] [Claim Rewards]       │
└─────────────────────────────────────────────────────┘
```

### Stats Explained

1. **Your Balance**
   - Available tokens in your wallet
   - These are NOT staked yet
   - You can stake these tokens

2. **Your Staked**
   - Tokens currently staked in the vault
   - Earning rewards
   - Can be withdrawn anytime

3. **Rewards Earned**
   - Accumulated rewards
   - Updates in real-time
   - Can be claimed without unstaking

4. **APY (Annual Percentage Yield)**
   - Expected yearly return percentage
   - Formula: `(Reward Rate × 31,536,000 / Total Staked) × 100`
   - Example: 31.54% means if you stake 100 tokens for a year, you'd earn 31.54 tokens

### Button States

**APPROVE (Blue)**
- Enabled: When you need to approve token spending
- Disabled: After you've approved
- You only need to approve once

**STAKE (Green)**
- Enabled: After approval, when you have balance
- Disabled: If you haven't approved or have no balance
- Stakes your tokens to earn rewards

**WITHDRAW (Orange)**
- Enabled: When you have staked tokens
- Disabled: When you have nothing staked
- Returns staked tokens to your wallet

**CLAIM REWARDS (Gold)**
- Enabled: When you have rewards to claim
- Disabled: When rewards are zero
- Claims rewards without unstaking

---

## How Rewards Work

### Reward Mechanism

The Staking Vault uses a **continuous reward distribution** system:

1. **Reward Pool**: The vault has a pool of reward tokens
2. **Reward Rate**: Set to X tokens per second (e.g., 1 token/second)
3. **Your Share**: Proportional to your staked amount vs total staked
4. **Accumulation**: Rewards accumulate every second

### Calculation Example

```
Scenario:
- Total staked in vault: 10,000 tokens
- Your staked amount: 500 tokens
- Reward rate: 1 token per second
- Time staked: 1 hour (3,600 seconds)

Your share: 500 / 10,000 = 5%
Rewards per second: 1 × 0.05 = 0.05 tokens
Rewards per hour: 0.05 × 3,600 = 180 tokens
Daily rewards: 180 × 24 = 4,320 tokens
Yearly rewards: 4,320 × 365 = 1,576,800 tokens

APY: (1,576,800 / 500) × 100 = 315,360%
```

**Important Notes:**
- APY changes as more people stake (total staked increases)
- Higher total staked = lower APY for everyone
- Your rewards accumulate even if you don't claim them
- Unclaimed rewards keep accumulating

### When Do Rewards Start?

- Rewards start **immediately** after staking
- You don't need to wait for a specific period
- Rewards accumulate every second
- You can claim rewards anytime

---

## Withdrawing and Claiming

### Claiming Rewards (Without Unstaking)

Want to collect your rewards but keep staking?

1. Click "Claim Rewards" button (GOLD)
2. MetaMask pops up
3. Confirm the transaction
4. Wait for confirmation
5. Rewards are sent to your wallet
6. Your staked amount remains unchanged
7. Rewards counter resets to 0 and starts accumulating again

**Gas Cost**: ~$0.01-0.03 in ETH

### Withdrawing Staked Tokens

Want to unstake some or all tokens?

1. Decide how much to withdraw (e.g., 50 out of 100 staked)
2. Click "Withdraw" button (ORANGE)
3. Enter the amount (or click "Max" for all)
4. MetaMask pops up
5. Confirm the transaction
6. Wait for confirmation
7. Tokens return to your wallet
8. Any pending rewards are automatically claimed

**What happens when you withdraw:**
- Staked tokens return to "Your Balance"
- Pending rewards are claimed to your wallet
- Remaining staked tokens continue earning
- If you withdraw all, you stop earning rewards

### Full Exit Strategy

To completely exit and claim everything:

**Option 1: Withdraw All**
```
1. Click "Withdraw"
2. Enter your full staked amount (or click "Max")
3. Confirm transaction
Result: All tokens + all rewards in your wallet
```

**Option 2: Claim Then Withdraw**
```
1. Click "Claim Rewards" (get rewards first)
2. Then click "Withdraw" with full amount
3. Confirm both transactions
Result: Same as Option 1, but in 2 steps
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Connect Wallet" Button Not Working

**Problem**: Button doesn't respond when clicked

**Solutions**:
- Make sure MetaMask is installed
- Try refreshing the page
- Check if MetaMask is unlocked
- Try a different browser
- Clear browser cache

#### 2. "Wrong Network" Message

**Problem**: Dashboard shows network error

**Solutions**:
- Open MetaMask
- Click network dropdown
- Select "Sepolia"
- Refresh the page

#### 3. "Approve" Button Disabled

**Problem**: Can't approve tokens

**Possible Causes & Solutions**:
- **No balance**: Get test tokens first
- **Already approved**: You only need to approve once, proceed to stake
- **Not connected**: Connect your wallet first

#### 4. "Stake" Button Disabled

**Problem**: Can't stake tokens

**Possible Causes & Solutions**:
- **Not approved yet**: Click "Approve" first
- **Zero balance**: Get tokens first
- **Wrong network**: Switch to Sepolia
- **Wallet not connected**: Connect wallet

#### 5. Transaction Failed

**Problem**: MetaMask shows "Transaction Failed"

**Common Reasons & Fixes**:
- **Insufficient gas**: Get more Sepolia ETH
- **Amount too high**: You're trying to stake more than you have
- **Network congestion**: Wait a few minutes and retry
- **Nonce too low**: Reset account in MetaMask (Settings > Advanced > Reset Account)

#### 6. Balance Not Updating

**Problem**: Dashboard shows old balance

**Solutions**:
- Wait 10-30 seconds for blockchain confirmation
- Refresh the page
- Disconnect and reconnect wallet
- Check transaction on [Sepolia Etherscan](https://sepolia.etherscan.io)

#### 7. Rewards Not Accumulating

**Problem**: Rewards stuck at 0 or not increasing

**Check These**:
- Are you actually staked? Check "Your Staked" amount
- Is there anyone else staking? (Check total staked)
- Wait a few seconds and refresh
- Is the reward pool empty? (Contact admin)

#### 8. MetaMask Popup Blocked

**Problem**: MetaMask doesn't pop up for confirmation

**Solutions**:
- Look for the MetaMask icon in browser toolbar (might be there)
- Check if popup is blocked - allow popups for this site
- Restart browser
- Re-install MetaMask extension

---

## Safety Tips

### Protecting Your Assets

#### DO's:

1. **Secure Your Seed Phrase**
   - Write it down on paper
   - Store in a safe place
   - NEVER share with anyone
   - NEVER enter it on websites

2. **Verify Contract Addresses**
   ```
   MockERC20 Token: 0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03
   Staking Vault: 0xaf3c10b3f70f4eadc1d849c48f8f474ffe1b71c9
   ```
   - Always verify on Sepolia Etherscan
   - Bookmark the official site

3. **Check Transaction Details**
   - Review all details in MetaMask before confirming
   - Check the contract address
   - Verify the amount
   - See gas fees

4. **Start Small**
   - Test with small amounts first
   - Stake 10-50 tokens initially
   - Learn the process
   - Then stake more

5. **Secure Your Computer**
   - Use antivirus software
   - Keep browser updated
   - Don't use public WiFi for transactions
   - Use a hardware wallet for large amounts

#### DON'Ts:

1. **NEVER Share Private Keys**
   - No one from the project will ever ask for it
   - Not even "support" or "admins"

2. **Don't Click Suspicious Links**
   - Only use official links
   - Check URL carefully
   - Watch for phishing sites

3. **Don't Approve Suspicious Contracts**
   - Only approve the official Staking Vault
   - Revoke approvals you don't need

4. **Don't Rush Transactions**
   - Read all confirmations
   - Take your time
   - If something feels wrong, stop

5. **Don't Store Seeds Digitally**
   - Don't screenshot seed phrases
   - Don't save in notes apps
   - Don't email to yourself
   - Don't store in cloud

### Red Flags (Scam Warning Signs)

**Stop immediately if:**
- Someone asks for your seed phrase
- A "support person" DMs you first
- You're asked to send tokens to "verify" your wallet
- Website URL looks slightly different
- MetaMask asks for unusual permissions
- Promises seem too good to be true

### Getting Help

**Official Channels:**
- GitHub Issues: [Repository link]
- Documentation: Check README.md files
- Smart Contract: Verify on Etherscan

**What to Share When Asking for Help:**
- Your wallet address (PUBLIC - this is safe)
- Transaction hash (if relevant)
- Screenshots of error messages
- Steps you took

**NEVER Share:**
- Private keys
- Seed phrase
- Password
- Signed messages from unknown sources

---

## Advanced Topics

### Understanding Gas Fees

Every transaction requires "gas" - fees paid to blockchain miners:

**Typical Gas Costs on Sepolia:**
- Approve: $0.01 - 0.02
- Stake: $0.02 - 0.03
- Withdraw: $0.02 - 0.03
- Claim: $0.01 - 0.02

**On Ethereum Mainnet (when deployed):**
- Costs could be $5 - $50+ depending on network congestion
- Consider gas prices before transacting
- Use gas trackers like [ETH Gas Station](https://ethgasstation.info/)

### Staking Strategies

#### Strategy 1: Long-Term Hold
- Stake everything
- Claim rewards monthly
- Re-stake rewards (compound)
- Best for: Maximum rewards

#### Strategy 2: Regular Income
- Stake a portion
- Claim rewards weekly/daily
- Keep some liquid for emergencies
- Best for: Regular income

#### Strategy 3: Dollar-Cost Averaging
- Stake gradually over time
- Add more as you accumulate
- Reduces timing risk
- Best for: Risk-averse users

### Compounding Rewards

To maximize earnings:

1. Claim your rewards
2. Use claimed rewards to stake again
3. Repeat regularly
4. This increases your staked amount
5. Which increases future rewards

**Example:**
```
Week 1: Stake 100 tokens → Earn 10 tokens
Week 2: Claim and re-stake 10 → Now staking 110 tokens
Week 3: Earn 11 tokens (10% more because of larger stake)
Week 4: Claim and re-stake 11 → Now staking 121 tokens
And so on...
```

---

## Quick Reference

### Contract Addresses

```
Network: Sepolia Testnet (Chain ID: 11155111)

MockERC20 Token:
0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03

Staking Vault:
0xaf3c10b3f70f4eadc1d849c48f8f474ffe1b71c9
```

### Transaction Sequence

First Time Staking:
```
1. Connect Wallet → 2. Approve → 3. Stake
```

Claiming Rewards:
```
Claim Rewards (anytime)
```

Unstaking:
```
Withdraw (amount) → Tokens + Pending Rewards to wallet
```

### Button Color Guide

- **BLUE (Approve)**: Grant permission to stake
- **GREEN (Stake)**: Deposit tokens to earn rewards
- **ORANGE (Withdraw)**: Remove staked tokens
- **GOLD (Claim)**: Collect earned rewards

---

## Frequently Asked Questions (FAQ)

**Q: How long do I need to stake?**  
A: No minimum time! Stake and unstake anytime. Rewards start immediately.

**Q: Do I lose rewards if I withdraw?**  
A: No! When you withdraw, pending rewards are automatically claimed to your wallet.

**Q: Can I add more tokens to my stake?**  
A: Yes! Just stake again. Your new tokens join your existing stake.

**Q: Is my wallet safe?**  
A: Your tokens remain in your control. The contract only has permission to transfer when YOU initiate a stake.

**Q: What if the contract is hacked?**  
A: This is testnet for testing. On mainnet, always check for audits and use audited contracts only.

**Q: Why do I need to approve first?**  
A: It's an ERC20 standard. You give permission once, then you can stake multiple times without approving again.

**Q: Can I stake from mobile?**  
A: Yes! Use MetaMask mobile app or WalletConnect-compatible wallets.

**Q: What happens if I close the browser?**  
A: Nothing! Your stake is on the blockchain. Open the site anytime to check.

**Q: How often should I claim rewards?**  
A: Up to you! Consider gas fees. Claiming more frequently costs more in gas.

**Q: Can rewards run out?**  
A: Theoretically yes, if the reward pool is depleted. The contract owner can refill it.

---

## Need More Help?

- **Documentation**: Check [README.md](./README.md) for technical details
- **Contract Info**: See [DEPLOYMENT_INFO.md](./DEPLOYMENT_INFO.md)
- **Code Issues**: Open an issue on GitHub
- **Security Concerns**: Read [SECURITY.md](./SECURITY.md)

---

**Happy Staking! May your rewards be plentiful!**

Last Updated: January 2026
