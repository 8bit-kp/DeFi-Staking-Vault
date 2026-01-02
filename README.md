# DeFi Staking Vault

A complete decentralized staking vault application built with Solidity smart contracts and a Next.js frontend.

## 🏗️ Project Structure

```
defi-staking-vault-main/
├── defi-staking-vault/          # Smart contracts (Hardhat)
│   ├── contracts/               # Solidity contracts
│   │   ├── StakingVault.sol    # Main staking vault contract
│   │   └── MockERC20.sol       # Mock ERC20 token for testing
│   ├── scripts/                 # Deployment scripts
│   ├── test/                    # Contract tests
│   └── hardhat.config.ts       # Hardhat configuration
│
└── staking-vault-frontend/      # Frontend (Next.js 16 + Wagmi + RainbowKit)
    ├── app/                     # Next.js App Router
    │   ├── page.tsx            # Main staking interface
    │   ├── providers.tsx       # Wagmi & RainbowKit providers
    │   └── globals.css         # Global styles
    ├── lib/                     # Utilities
    │   └── contracts.ts        # Contract addresses & ABIs
    └── package.json            # Frontend dependencies
```

## ✨ Features

### Smart Contracts
- ✅ ERC20 token staking
- ✅ Automatic reward distribution
- ✅ Configurable reward rate
- ✅ Secure withdraw mechanism
- ✅ User balance tracking

### Frontend
- 🎨 Modern, minimalistic glassmorphism design
- 🌐 Multi-wallet support via RainbowKit
- 📊 Real-time stats dashboard (Balance, Staked, Rewards, APY)
- 🔐 Network validation (Sepolia testnet)
- 💰 Approve, Stake, Withdraw, and Claim functionality
- 📈 Live APY calculation
- 🎯 Meaningful color-coded buttons
- ⚡ Built with Next.js 16 (App Router) + TypeScript

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

Update `staking-vault-frontend/lib/contracts.ts` with your deployed addresses:

```typescript
export const STAKING_VAULT_ADDRESS = "0xYourVaultAddress" as `0x${string}`;
export const MOCK_TOKEN_ADDRESS = "0xYourTokenAddress" as `0x${string}`;
```

### 4. Run Frontend

```bash
cd staking-vault-frontend
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing

```bash
cd defi-staking-vault
npx hardhat test
```

## 🎨 UI Features

### Stats Dashboard
- **Token Balance** - Available tokens in wallet
- **Your Staked** - Amount currently staked
- **Rewards Earned** - Accumulated rewards
- **APY** - Current Annual Percentage Yield

### Actions
- **Approve** (Blue) - Grant vault permission to spend tokens
- **Stake** (Green) - Deposit tokens to earn rewards
- **Withdraw** (Orange) - Remove staked tokens
- **Claim** (Gold) - Collect earned rewards

### Smart Features
- Automatic allowance checking
- Disabled buttons with clear feedback
- Network validation (Sepolia only)
- Real-time balance updates
- APY auto-calculation

## 🔧 Tech Stack

### Backend
- Solidity ^0.8.28
- Hardhat
- OpenZeppelin Contracts
- TypeScript

### Frontend
- Next.js 16 (App Router)
- React 19
- Wagmi v2
- RainbowKit
- Viem
- TanStack Query
- Tailwind CSS v4
- TypeScript

## 📝 Smart Contract Functions

### StakingVault.sol
- `stake(uint256 amount)` - Stake tokens
- `withdraw(uint256 amount)` - Withdraw staked tokens
- `claimRewards()` - Claim earned rewards
- `earned(address user)` - View earned rewards
- `userBalance(address user)` - View staked balance

## 🌐 Network

Currently configured for **Sepolia Testnet**

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ using Solidity, Next.js, and Web3 technologies