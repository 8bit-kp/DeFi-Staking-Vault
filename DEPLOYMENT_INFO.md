# Deployment Information

## Network: Sepolia Testnet

### Deployed Contracts

**MockERC20 Token**
- Address: `0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03`
- Etherscan: https://sepolia.etherscan.io/address/0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03

**StakingVault**
- Address: `0xaf3c10b3f70f4eadc1d849c48f8f474ffe1b71c9`
- Etherscan: https://sepolia.etherscan.io/address/0xaf3c10b3f70f4eadc1d849c48f8f474ffe1b71c9

### Deployment Date
2 January 2026

### Deployer Address
`0x7d630C49E02465C975a35304c2BB5Bc166e95867`

## How to Use

1. **Get Test Tokens**: The deployed MockERC20 allows anyone to mint tokens for testing
2. **Connect Wallet**: Use MetaMask or any Web3 wallet on Sepolia network
3. **Interact**: Use the frontend at https://de-fi-staking-vault.vercel.app (or run locally at https://de-fi-staking-vault.vercel.app/)

## Contract Interactions

### MockERC20
- `mint(address to, uint256 amount)` - Mint test tokens
- `approve(address spender, uint256 amount)` - Approve vault to spend tokens
- `balanceOf(address account)` - Check token balance

### StakingVault
- `stake(uint256 amount)` - Stake tokens to earn rewards
- `withdraw(uint256 amount)` - Withdraw staked tokens
- `claimRewards()` - Claim accumulated rewards
- `earned(address user)` - View earned rewards
- `userBalance(address user)` - View staked balance

## Frontend Configuration

The frontend has been automatically updated with these contract addresses in:
`staking-vault-frontend/lib/contracts.ts`

## Verification (Optional)

To verify contracts on Etherscan:
```bash
npx hardhat verify --network sepolia 0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03
npx hardhat verify --network sepolia 0xaf3c10b3f70f4eadc1d849c48f8f474ffe1b71c9 "0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03"
```

## Notes
- Make sure you have Sepolia ETH for gas fees
- The reward rate is set in the StakingVault constructor
- Rewards accumulate per second based on the configured rate
