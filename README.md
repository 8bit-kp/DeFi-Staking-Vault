# 🏦 DeFi Staking Vault

A complete decentralized staking vault application built with Solidity smart contracts and a modern Next.js frontend. Stake your ERC20 tokens and earn rewards in real-time!

## � Live Demo

**Frontend**: [Your deployment URL here]  
**Network**: Sepolia Testnet  
**Deployed Contracts**: See [DEPLOYMENT_INFO.md](./DEPLOYMENT_INFO.md)

## �🏗️ Project Structure

```
defi-staking-vault-main/
├── defi-staking-vault/          # Smart contracts (Hardhat 3)
│   ├── contracts/               # Solidity contracts
│   │   ├── StakingVault.sol    # Main staking vault contract
│   │   └── MockERC20.sol       # Mock ERC20 token for testing
│   ├── scripts/                 # Deployment scripts
│   │   └── deploy.ts           # Viem-based deployment
│   ├── test/                    # Contract tests
│   │   └── StakingVault.test.ts
│   └── hardhat.config.ts       # Hardhat v3 configuration
│
└── staking-vault-frontend/      # Frontend (Next.js 16 + Wagmi + RainbowKit)
    ├── app/                     # Next.js App Router
    │   ├── page.tsx            # Landing page
    │   ├── (routes)/
    │   │   └── dashboard/
    │   │       ├── page.tsx    # Staking dashboard
    │   │       ├── loading.tsx # Loading skeleton
    │   │       └── error.tsx   # Error boundary
    │   ├── not-found.tsx       # Custom 404 page
    │   ├── layout.tsx          # Root layout with metadata
    │   ├── providers.tsx       # Wagmi & RainbowKit providers
    │   └── globals.css         # Tailwind CSS v4 styles
    ├── lib/                     # Utilities
    │   └── contracts.ts        # Contract addresses & ABIs
    └── package.json            # Frontend dependencies
```

## ✨ Features

### Smart Contracts
- ✅ **ERC20 Token Staking** - Stake any ERC20 token
- ✅ **Automatic Rewards** - Earn rewards based on configurable rate
- ✅ **Flexible Withdrawals** - Withdraw staked tokens anytime
- ✅ **Claim Rewards** - Claim accumulated rewards separately
- ✅ **Gas Optimized** - Efficient Solidity 0.8.28 implementation
- ✅ **Security Tested** - Comprehensive test coverage

### Frontend
- 🎨 **Modern UI/UX** - Glassmorphism design with gradient accents
- � **Landing Page** - Professional homepage with features showcase
- 📊 **Dashboard** - Real-time stats (Balance, Staked, Rewards, APY)
- 🌐 **Multi-Wallet Support** - RainbowKit integration (MetaMask, WalletConnect, etc.)
- 🔐 **Network Validation** - Automatic Sepolia testnet detection
- 💰 **Complete Actions** - Approve, Stake, Withdraw, and Claim
- 📈 **Live APY Calculation** - Dynamic annual percentage yield display
- 🎯 **Smart Buttons** - Color-coded (Blue=Approve, Green=Stake, Orange=Withdraw, Gold=Claim)
- ⚡ **Next.js 16** - Latest App Router with TypeScript
- 🚨 **Error Handling** - Error boundaries and 404 page
- ⏳ **Loading States** - Skeleton screens for better UX
- 📱 **Fully Responsive** - Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- MetaMask or compatible wallet

### 1. Install Dependencies

```bash
# Install smart contract dependencies
cd defi-staking-vault
npm install

# Install frontend dependencies
cd ../staking-vault-frontend
npm install
```

### 2. Deploy Smart Contracts

```bash
cd defi-staking-vault

# Compile contracts
npx hardhat compile

# Deploy to Sepolia (update hardhat.config.ts with your keys)
npx hardhat run scripts/deploy.ts --network sepolia
```

Note the deployed contract addresses.

### 3. Configure Frontend

**Current Deployment** (Sepolia):
- MockERC20: `0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03`
- StakingVault: `0xaf3c10b3f70f4eadc1d849c48f8f474ffe1b71c9`

Already configured in `staking-vault-frontend/lib/contracts.ts`!

### 4. Run Frontend

```bash
cd staking-vault-frontend

# Development
npm run dev

# Production build
npm run build
npm start
```

Visit:
- Development: http://localhost:3000
- Landing Page: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

## 🧪 Testing

```bash
cd defi-staking-vault
npx hardhat test
```

## 🎨 UI Features & User Flow

### 🏠 Landing Page (`/`)
- Hero section with gradient branding
- Feature showcase (Security, Rewards, Speed)
- Statistics grid
- Wallet-aware CTA button
- Professional footer

### 📊 Dashboard (`/dashboard`)

#### Stats Overview
- **Token Balance** - Available tokens in wallet
- **Your Staked** - Amount currently staked
- **Rewards Earned** - Real-time accumulated rewards
- **APY** - Dynamic Annual Percentage Yield calculation

#### Action Buttons
1. **Approve** (Blue 💙) - Grant vault permission to spend tokens
2. **Stake** (Green 💚) - Deposit tokens to start earning rewards
3. **Withdraw** (Orange 🧡) - Remove staked tokens back to wallet
4. **Claim Rewards** (Gold 💛) - Collect earned rewards

#### Smart Features
- ✅ Automatic allowance checking before staking
- ✅ Disabled buttons with clear feedback messages
- ✅ Network validation (Sepolia testnet only)
- ✅ Real-time balance updates after each transaction
- ✅ APY auto-calculation: `(rewardRate * SECONDS_PER_YEAR / totalStaked) * 100`
- ✅ Wrong network detection with helpful message
- ✅ Loading skeletons during data fetch
- ✅ Error boundaries for graceful error handling

## 🔧 Tech Stack

### Smart Contracts
- **Solidity** ^0.8.28 - Smart contract language
- **Hardhat** 3.1.2 - Development environment
- **OpenZeppelin** 5.4.0 - Secure contract libraries
- **Viem** - Modern deployment scripts
- **TypeScript** - Type-safe configuration

### Frontend
- **Next.js** 16.1.1 - React framework with App Router
- **React** 19 - UI library
- **Wagmi** v2.9.0 - React hooks for Ethereum
- **RainbowKit** 2.2.10 - Wallet connection UI
- **Viem** 2.0 - TypeScript interface for Ethereum
- **TanStack Query** - Async state management
- **Tailwind CSS** v4 - Utility-first styling
- **TypeScript** 5 - Type safety

## 📝 Smart Contract API

### StakingVault.sol

#### Write Functions
```solidity
function stake(uint256 amount) external
// Stakes tokens into the vault
// Requirements: Must have approved vault, amount > 0

function withdraw(uint256 amount) external  
// Withdraws staked tokens back to user
// Requirements: Sufficient staked balance

function claimRewards() external
// Claims all accumulated rewards
// No requirements, safe to call anytime
```

#### Read Functions
```solidity
function earned(address user) external view returns (uint256)
// Returns total rewards earned by user

function userBalance(address user) external view returns (uint256)  
// Returns user's staked token balance

function rewardRate() external view returns (uint256)
// Returns reward tokens per second

function totalStaked() external view returns (uint256)
// Returns total tokens staked in vault
```

### MockERC20.sol (Test Token)
```solidity
function mint(address to, uint256 amount) external
// Mints test tokens (useful for testing)

function approve(address spender, uint256 amount) external returns (bool)
// Standard ERC20 approve

function balanceOf(address account) external view returns (uint256)
// Standard ERC20 balance check
```

## 🚀 Deployment Guide

### Prerequisites
1. Get Sepolia ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
2. Get Alchemy API key from [Alchemy](https://www.alchemy.com/)
3. Have your wallet private key ready (NEVER commit this!)

### Environment Setup

Create `.env` in `defi-staking-vault/`:
```bash
ALCHEMY_API_KEY=your_alchemy_api_key_here
SEPOLIA_PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here  # Optional, for verification
```

### Deploy Contracts
```bash
cd defi-staking-vault
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

Note the deployed addresses and update `staking-vault-frontend/lib/contracts.ts`.

### Deploy Frontend

#### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `staking-vault-frontend`
4. Deploy!

#### Option 2: Netlify
1. Build the project: `cd staking-vault-frontend && npm run build`
2. Deploy `out/` folder to Netlify

#### Option 3: Self-hosted
```bash
cd staking-vault-frontend
npm run build
npm start  # Runs on port 3000
```

## 🌐 Network Configuration

**Current Network**: Sepolia Testnet (Chain ID: 11155111)

To add Sepolia to MetaMask:
- Network Name: Sepolia
- RPC URL: https://ethereum-sepolia-rpc.publicnode.com
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: https://sepolia.etherscan.io

## 🧪 Local Development Tips

### Get Test Tokens
```bash
# In Hardhat console
npx hardhat console --network sepolia
> const MockERC20 = await ethers.getContractAt("MockERC20", "0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03")
> await MockERC20.mint("YOUR_ADDRESS", ethers.parseEther("1000"))
```

### Common Issues

**"Wrong Network"**
- Make sure MetaMask is connected to Sepolia testnet

**"Transaction Failed"**
- Check you have enough Sepolia ETH for gas
- Verify contract addresses are correct

**"Insufficient Allowance"**
- Click "Approve" button first before staking

## 📁 Additional Documentation

- [DEPLOYMENT_INFO.md](./DEPLOYMENT_INFO.md) - Deployed contract details
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Frontend architecture

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

Need help? Here's how to get support:
- 🐛 **Bug Reports**: Open an issue with the `bug` label
- 💡 **Feature Requests**: Open an issue with the `enhancement` label
- 💬 **Questions**: Open a discussion in the repository
- 📖 **Documentation**: Check our docs in the repo

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with ❤️ using Solidity, Next.js, and Web3 technologies**

Made by the DeFi community, for the DeFi community 🚀