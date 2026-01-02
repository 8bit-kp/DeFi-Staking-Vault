# DeFi Staking Vault

A secure and efficient ERC20 token staking vault smart contract built with Solidity, featuring time-based reward distribution and comprehensive security measures.

## Overview

The DeFi Staking Vault allows users to stake ERC20 tokens and earn rewards over time. The contract implements a sophisticated reward distribution mechanism based on staking duration and total staked amount, ensuring fair and proportional reward distribution among all stakers.

## Features

- **ERC20 Token Staking**: Stake any ERC20 token to earn rewards
- **Time-Based Rewards**: Rewards accrue per second based on configurable reward rate
- **Proportional Distribution**: Rewards distributed proportionally to stake size and duration
- **Security First**: Built with OpenZeppelin contracts and includes ReentrancyGuard protection
- **Owner Controls**: Admin functions to manage reward rates
- **Real-Time Tracking**: View earned rewards in real-time before claiming

## Technical Stack

- **Solidity**: ^0.8.20
- **Hardhat**: 3.1.2
- **OpenZeppelin Contracts**: 5.4.0
- **TypeScript**: ~5.8.0
- **Viem**: 2.43.4

## Installation

1. Clone the repository:
```bash
git clone https://github.com/8bit-kp/DeFi-Staking-Vault.git
cd defi-staking-vault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file or use hardhat-keystore
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set SEPOLIA_RPC_URL
```

## Usage

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy Contract

Deploy to local network:
```bash
npx hardhat ignition deploy ignition/modules/StakingVault.ts
```

Deploy to Sepolia testnet:
```bash
npx hardhat ignition deploy ignition/modules/StakingVault.ts --network sepolia
```

## Smart Contract Functions

### User Functions

#### `stake(uint256 amount)`
Stake tokens to earn rewards.
- **Parameters**: `amount` - Amount of tokens to stake
- **Requirements**: User must have approved the contract to transfer tokens

#### `withdraw(uint256 amount)`
Withdraw staked tokens.
- **Parameters**: `amount` - Amount of tokens to withdraw
- **Requirements**: User must have sufficient staked balance

#### `claimRewards()`
Claim accumulated rewards.
- **Requirements**: User must have rewards available to claim

#### `earned(address user)` (View)
Check how many rewards a user has earned.
- **Parameters**: `user` - Address of the user
- **Returns**: Amount of rewards earned

### Admin Functions

#### `setRewardRate(uint256 _rewardRate)` (Owner Only)
Set the reward rate per second.
- **Parameters**: `_rewardRate` - New reward rate (in wei per second)

## Security Features

- **ReentrancyGuard**: Protection against reentrancy attacks on all state-changing functions
- **SafeERC20**: Safe token transfer operations to handle non-standard ERC20 tokens
- **Ownable**: Access control for administrative functions
- **Input Validation**: Comprehensive checks on all user inputs
- **Immutable Token**: Staking token address cannot be changed after deployment

## Contract Architecture

```
StakingVault
├── State Variables
│   ├── stakingToken (immutable)
│   ├── totalStaked
│   ├── rewardRate
│   ├── rewardPerTokenStored
│   └── User mappings (balance, rewards, etc.)
├── User Functions
│   ├── stake()
│   ├── withdraw()
│   ├── claimRewards()
│   └── earned() [view]
├── Internal Functions
│   ├── _updateReward()
│   └── rewardPerToken() [view]
└── Admin Functions
    └── setRewardRate()
```

## Testing

The project uses Hardhat 3 with native Node.js test runner and Viem library. Tests can be written in both Solidity and TypeScript.

Run specific test suites:
```bash
npx hardhat test solidity  # Run Solidity tests
npx hardhat test nodejs    # Run TypeScript tests
```

## Networks

The project is configured for the following networks:

- **Local**: Hardhat mainnet simulation
- **Local OP**: Optimism mainnet simulation
- **Sepolia**: Ethereum testnet

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This smart contract is provided as-is. Please conduct thorough testing and auditing before deploying to mainnet with real funds.

## Support

For questions and support, please open an issue in the GitHub repository.

---

Built with Hardhat 3 and OpenZeppelin

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
