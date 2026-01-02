# Deployment Guide

## Steps to Deploy and Configure

### 1. Deploy Contracts (Backend)

```bash
cd ../defi-staking-vault
npx hardhat run scripts/deploy.ts --network sepolia
```

Note the deployed contract addresses from the output.

### 2. Update Contract Addresses

In `lib/contracts.ts`, replace the placeholder addresses with your deployed contract addresses:

```typescript
export const STAKING_VAULT_ADDRESS = "0xYourDeployedVaultAddress" as `0x${string}`;
export const MOCK_TOKEN_ADDRESS = "0xYourDeployedTokenAddress" as `0x${string}`;
```

### 3. Run the Frontend

```bash
npm run dev
```

Visit https://de-fi-staking-vault.vercel.app/ (Local development)

**Live Production**: https://de-fi-staking-vault.vercel.app

### 4. Get MOCK Tokens 🎁

Contact [@0xkishan_](https://x.com/0xkishan_) on X (Twitter) for an airdrop of MOCK tokens to start staking!

## Features

**Minimalistic Modern UI**
- Dark gradient background (slate-900 to purple-900)
- Glass-morphism cards with backdrop blur
- Smooth transitions and hover effects
- Responsive grid layout

**Wallet Integration**
- Connect wallet with RainbowKit
- SSR-safe localStorage handling
- Real-time balance updates

**Staking Features**
- Stake tokens
- Withdraw staked tokens
- Claim rewards
- View real-time stats

**Dashboard**
- Token balance
- Staked amount
- Earned rewards
- Total staked (protocol-wide)

## Fixed Issues

1. localStorage error - Added SSR support with `ssr: true` config
2. QueryClient initialization - Moved to useState hook
3. Contract ABI - Converted to proper ABI format
4. Type safety - Added proper TypeScript types
5. Modern UI - Minimalistic design with gradients and glass-morphism
