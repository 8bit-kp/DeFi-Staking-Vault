# Staking Flow Diagram

This document provides visual representations of the staking process flow.

---

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEW USER ARRIVES                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 1: PREREQUISITES                          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐      │
│  │  Install   │  │  Get Test  │  │  Add Sepolia to     │      │
│  │  MetaMask  │  │   ETH      │  │  MetaMask           │      │
│  └────────────┘  └────────────┘  └─────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 2: VISIT STAKING PLATFORM                     │
│                                                                 │
│  Landing Page (/)  ──→  Click "Launch App"  ──→  Dashboard     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 3: CONNECT WALLET                         │
│                                                                 │
│  Click "Connect Wallet" → Select MetaMask → Approve Connection │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 4: VERIFY NETWORK                         │
│                                                                 │
│  Is Network = Sepolia?                                         │
│     ├── Yes → Continue                                          │
│     └── No  → Switch to Sepolia in MetaMask                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 5: GET TEST TOKENS                        │
│                                                                 │
│  Option A: Ask admin to mint tokens to your address            │
│  Option B: Use Hardhat console to mint (if you have access)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 6: APPROVE TOKEN SPENDING                     │
│                                                                 │
│  Click "Approve" → MetaMask Popup → Confirm → Wait             │
│  (One-time approval for unlimited staking)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 7: STAKE TOKENS                           │
│                                                                 │
│  Enter Amount → Click "Stake" → Confirm in MetaMask → Done!    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 8: EARN REWARDS                           │
│                                                                 │
│  Watch rewards accumulate in real-time (every second!)         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              STEP 9: CLAIM OR WITHDRAW                          │
│                                                                 │
│  ├── Claim Rewards (keep staking) → Click "Claim Rewards"      │
│  └── Withdraw Tokens (unstake) → Click "Withdraw"              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Transaction Flow

### First-Time Staking Flow

```
┌──────────────┐
│   User Has   │
│    Tokens    │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  Has user approved vault to spend tokens?│
└──────┬───────────────────┬───────────────┘
       │ NO                │ YES
       ↓                   ↓
┌──────────────┐    ┌─────────────┐
│   APPROVE    │    │   STAKE     │
│  Transaction │    │ Transaction │
└──────┬───────┘    └──────┬──────┘
       │                   │
       │  ┌────────────────┘
       │  │
       ↓  ↓
┌──────────────────┐
│  Tokens Staked   │
│ Rewards Started  │
└──────────────────┘
```

### Claiming Rewards Flow

```
┌──────────────┐
│   User Has   │
│   Rewards    │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│ Click "Claim     │
│    Rewards"      │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ MetaMask Popup   │
│ Shows Gas Fee    │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ User Confirms    │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ Smart Contract   │
│ claimRewards()   │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ Rewards → Wallet │
│ Counter Resets   │
│ Still Staking    │
└──────────────────┘
```

### Withdrawing Tokens Flow

```
┌──────────────┐
│   User Has   │
│Staked Tokens │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│ Click "Withdraw" │
│  Enter Amount    │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ MetaMask Popup   │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ User Confirms    │
└──────┬───────────┘
       │
       ↓
┌──────────────────────────┐
│ Smart Contract           │
│ withdraw(amount)         │
│ - Returns staked tokens  │
│ - Auto-claims rewards    │
└──────┬───────────────────┘
       │
       ↓
┌────────────────────────────┐
│ Tokens → Wallet            │
│ Rewards → Wallet           │
│ Remaining stake continues  │
└────────────────────────────┘
```

---

## Dashboard State Flow

### Button States Based on Conditions

```
┌─────────────────────────────────────────────────────────┐
│                    WALLET STATE                         │
└────────┬───────────────────┬────────────────────────────┘
         │                   │
    NOT CONNECTED      CONNECTED
         │                   │
         ↓                   ↓
┌──────────────┐    ┌──────────────────┐
│Show "Connect │    │  Check Network   │
│   Wallet"    │    └────┬──────┬──────┘
└──────────────┘         │      │
                    WRONG│  CORRECT
                         │      │
                         ↓      ↓
                 ┌───────────────────┐
                 │  Show "Wrong      │
                 │   Network"        │
                 └───────────────────┘
                         │
                         ↓
                 ┌───────────────────┐
                 │ Check Token       │
                 │ Allowance         │
                 └───┬──────┬────────┘
                     │      │
                ZERO │  HAS ALLOWANCE
                     │      │
                     ↓      ↓
         ┌──────────────────────────────┐
         │ APPROVE Button: ENABLED      │
         │ STAKE Button: DISABLED       │
         └──────────────────────────────┘
                     │
                     ↓
         ┌──────────────────────────────┐
         │ User Approves                │
         └──────────────────────────────┘
                     │
                     ↓
         ┌──────────────────────────────┐
         │ APPROVE Button: DISABLED     │
         │ STAKE Button: ENABLED        │
         └──────────────────────────────┘
```

### Button Enable/Disable Logic

```
APPROVE Button
├── ENABLED when:
│   ├── Wallet connected
│   ├── Correct network (Sepolia)
│   ├── Has token balance > 0
│   └── Allowance = 0
│
└── DISABLED when:
    ├── Wallet not connected
    ├── Wrong network
    ├── No token balance
    └── Already approved (allowance > 0)

STAKE Button
├── ENABLED when:
│   ├── Wallet connected
│   ├── Correct network
│   ├── Has allowance > 0
│   └── Has token balance > 0
│
└── DISABLED when:
    ├── Wallet not connected
    ├── Wrong network
    ├── No allowance (must approve first)
    └── Zero token balance

WITHDRAW Button
├── ENABLED when:
│   ├── Wallet connected
│   ├── Correct network
│   └── Has staked balance > 0
│
└── DISABLED when:
    ├── Wallet not connected
    ├── Wrong network
    └── Zero staked balance

CLAIM REWARDS Button
├── ENABLED when:
│   ├── Wallet connected
│   ├── Correct network
│   └── Has rewards > 0
│
└── DISABLED when:
    ├── Wallet not connected
    ├── Wrong network
    └── Zero rewards
```

---

## Smart Contract Interaction Flow

### Approve Transaction

```
Frontend                 MetaMask              Blockchain
   │                        │                      │
   │  User clicks          │                      │
   │  "Approve"            │                      │
   │────────────────────→  │                      │
   │                       │                      │
   │  Show transaction     │                      │
   │  details              │                      │
   │←─────────────────────│                      │
   │                       │                      │
   │                       │  User confirms       │
   │                       │─────────────────────→│
   │                       │                      │
   │                       │  Transaction         │
   │                       │  pending             │
   │                       │←─────────────────────│
   │  Show pending         │                      │
   │←──────────────────────│                      │
   │                       │                      │
   │                       │  Transaction         │
   │                       │  mined               │
   │                       │←─────────────────────│
   │  Update UI            │                      │
   │  Enable "Stake"       │                      │
   │←──────────────────────│                      │
```

### Stake Transaction

```
Frontend                 Smart Contract            Result
   │                           │                      │
   │  stake(amount)            │                      │
   │──────────────────────────→│                      │
   │                           │                      │
   │                           │  Check allowance     │
   │                           │  >= amount           │
   │                           │                      │
   │                           │  Transfer tokens     │
   │                           │  from user to vault  │
   │                           │                      │
   │                           │  Update user balance │
   │                           │  userStakes[user]    │
   │                           │                      │
   │                           │  Update total staked │
   │                           │  totalStaked += amt  │
   │                           │                      │
   │                           │  Update reward       │
   │                           │  checkpoint          │
   │                           │                      │
   │  Transaction success      │                      │
   │←──────────────────────────│                      │
   │                           │                      │
   │  Update dashboard         │                      │
   │  - Balance ↓              │────────────────────→│
   │  - Staked ↑              │                      │
   │  - Rewards start          │                      │
```

### Claim Rewards Transaction

```
Frontend                 Smart Contract            Result
   │                           │                      │
   │  claimRewards()           │                      │
   │──────────────────────────→│                      │
   │                           │                      │
   │                           │  Calculate earned    │
   │                           │  rewards             │
   │                           │                      │
   │                           │  Transfer rewards    │
   │                           │  to user             │
   │                           │                      │
   │                           │  Update checkpoint   │
   │                           │  to current time     │
   │                           │                      │
   │                           │  Reset earned to 0   │
   │                           │                      │
   │  Transaction success      │                      │
   │←──────────────────────────│                      │
   │                           │                      │
   │  Update dashboard         │                      │
   │  - Rewards → 0            │────────────────────→│
   │  - Balance ↑              │                      │
   │  - Still staking          │                      │
```

### Withdraw Transaction

```
Frontend                 Smart Contract            Result
   │                           │                      │
   │  withdraw(amount)         │                      │
   │──────────────────────────→│                      │
   │                           │                      │
   │                           │  Calculate & claim   │
   │                           │  pending rewards     │
   │                           │                      │
   │                           │  Transfer staked     │
   │                           │  tokens back         │
   │                           │                      │
   │                           │  Update user balance │
   │                           │  userStakes[user]    │
   │                           │  -= amount           │
   │                           │                      │
   │                           │  Update total staked │
   │                           │  totalStaked -= amt  │
   │                           │                      │
   │  Transaction success      │                      │
   │←──────────────────────────│                      │
   │                           │                      │
   │  Update dashboard         │                      │
   │  - Balance ↑              │────────────────────→│
   │  - Staked ↓              │                      │
   │  - Rewards → Wallet       │                      │
```

---

## Error Handling Flow

```
┌──────────────────┐
│  User Action     │
└────────┬─────────┘
         │
         ↓
┌─────────────────────────────┐
│  Frontend Validation        │
│  - Connected?               │
│  - Correct network?         │
│  - Sufficient balance?      │
│  - Valid amount?            │
└────────┬──────────┬─────────┘
         │          │
     PASS│      FAIL│
         │          │
         │          ↓
         │   ┌──────────────────┐
         │   │  Show Error UI   │
         │   │  - Red message   │
         │   │  - Disable button│
         │   └──────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  Send Transaction           │
└────────┬──────────┬─────────┘
         │          │
   SUCCESS│    FAIL  │
         │          │
         │          ↓
         │   ┌──────────────────────┐
         │   │  Transaction Error   │
         │   │  - Insufficient gas  │
         │   │  - Reverted          │
         │   │  - User rejected     │
         │   └───────┬──────────────┘
         │           │
         │           ↓
         │   ┌──────────────────────┐
         │   │  Show Error          │
         │   │  - Toast message     │
         │   │  - Keep UI enabled   │
         │   │  - Allow retry       │
         │   └──────────────────────┘
         │
         ↓
┌─────────────────────────────┐
│  Transaction Success        │
│  - Show success message     │
│  - Update UI                │
│  - Refresh balances         │
└─────────────────────────────┘
```

---

## Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend                        │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │   │
│  │  │ Landing │  │Dashboard│  │ 404/    │            │   │
│  │  │  Page   │  │  Page   │  │ Error   │            │   │
│  │  └─────────┘  └─────────┘  └─────────┘            │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │         Wagmi + RainbowKit                 │   │   │
│  │  │  - Wallet connection                       │   │   │
│  │  │  - Transaction management                  │   │   │
│  │  │  - Contract interaction                    │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  └──────────────────┬──────────────────────────────────┘   │
└────────────────────│──────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      WALLET (MetaMask)                      │
│  - Manages private keys                                     │
│  - Signs transactions                                       │
│  - Interacts with blockchain                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                   SEPOLIA BLOCKCHAIN                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Smart Contracts                            │   │
│  │  ┌──────────────────┐    ┌──────────────────┐     │   │
│  │  │  MockERC20       │    │  StakingVault    │     │   │
│  │  │  Token Contract  │◄───┤  Main Contract   │     │   │
│  │  └──────────────────┘    └──────────────────┘     │   │
│  │       0x986ea...              0xaf3c10...          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Time-Based Reward Calculation

```
Time Progression:
─────────────────────────────────────────────────────────────→

T0: User Stakes 100 tokens
│
├─ Checkpoint saved: T0
├─ userStakes[user] = 100
├─ totalStaked = 1000 (example)
│
│
T1: After 1 hour (3600 seconds)
│
├─ Time elapsed: 3600 seconds
├─ Reward rate: 1 token/second (example)
├─ User's share: 100/1000 = 10%
├─ Rewards: 3600 × 0.10 = 360 tokens
│
│
T2: User Claims Rewards
│
├─ Transfer 360 tokens to user
├─ Update checkpoint to T2
├─ Reset earned to 0
├─ Continue staking (still has 100 staked)
│
│
T3: After another hour
│
├─ Time elapsed since T2: 3600 seconds
├─ Rewards: 3600 × 0.10 = 360 tokens again
│
▼
```

### Reward Formula

```
earned = (userStakes[user] / totalStaked) × rewardRate × timeElapsed

Where:
- userStakes[user]: Amount user has staked
- totalStaked: Total amount staked by all users
- rewardRate: Tokens distributed per second
- timeElapsed: Seconds since last checkpoint
```

---

## Summary: Key User Actions

| Action | Prerequisites | Transaction | Gas Cost | Result |
|--------|--------------|-------------|----------|---------|
| **Connect Wallet** | MetaMask installed | None | Free | Wallet connected |
| **Approve** | Connected, has tokens | ERC20.approve() | Low | Can stake |
| **Stake** | Approved, has balance | Vault.stake() | Medium | Tokens locked, earning starts |
| **Claim Rewards** | Has rewards > 0 | Vault.claimRewards() | Low | Rewards to wallet, still staking |
| **Withdraw** | Has staked > 0 | Vault.withdraw() | Medium | Tokens + rewards to wallet |

---

For the complete step-by-step guide with detailed explanations, see [USER_GUIDE.md](./USER_GUIDE.md)
