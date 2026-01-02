# Quick Reference Card

**DeFi Staking Vault - Sepolia Testnet**

---

## Contract Addresses

```
MockERC20 Token:
0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03

Staking Vault:
0xaf3c10b3f70f4eadc1d849c48f8f474ffe1b71c9

Network: Sepolia (Chain ID: 11155111)
```

---

## Quick Start (3 Steps)

```
1. APPROVE → Click blue button → Confirm in MetaMask
2. STAKE   → Enter amount → Click green button → Confirm
3. EARN    → Watch rewards grow automatically!
```

---

## Button Guide

| Button | Color | When Active | What It Does |
|--------|-------|-------------|--------------|
| Approve | BLUE | First time only | Grants permission to stake |
| Stake | GREEN | After approval | Locks tokens to earn rewards |
| Withdraw | ORANGE | When staked > 0 | Returns tokens + rewards |
| Claim Rewards | GOLD | When rewards > 0 | Collects rewards, keeps staking |

---

## Transaction Costs (Sepolia)

- Approve: ~$0.01
- Stake: ~$0.02
- Claim: ~$0.01
- Withdraw: ~$0.02

---

## Reward Formula

```
Your Rewards = (Your Staked / Total Staked) × Reward Rate × Time

Example:
- You stake: 100 tokens
- Total staked: 10,000 tokens
- Your share: 1%
- If reward rate is 1 token/second
- You earn: 0.01 tokens/second = 36 tokens/hour
```

---

## Common Actions

### First Time Staking
```
Connect Wallet → Approve → Stake
```

### Collecting Rewards (Keep Staking)
```
Click "Claim Rewards" → Confirm
```

### Unstaking Everything
```
Click "Withdraw" → Enter full amount → Confirm
(Automatically claims rewards too)
```

### Adding More Stake
```
Just click "Stake" again with new amount
(No need to approve again)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Wrong Network" | Switch MetaMask to Sepolia |
| Approve disabled | Check you have token balance |
| Stake disabled | Click Approve first |
| Transaction failed | Check you have ETH for gas |
| Balance not updating | Wait 30 seconds, then refresh |

---

## Wallet Setup

### Add Sepolia to MetaMask

```
Network Name: Sepolia
RPC URL: https://ethereum-sepolia-rpc.publicnode.com
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer: https://sepolia.etherscan.io
```

---

## Getting Test Tokens

### Get Sepolia ETH (for gas fees)
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia

### Get MOCK Tokens 🎁
Contact [@0xkishan_](https://x.com/0xkishan_) on X (Twitter) for an airdrop of MOCK tokens!

**Token Details:**
- Address: `0x986ea3157ae92ccc9ca3a87d58dfcc64e654bf03`
- Symbol: MOCK
- Network: Sepolia

---

## Safety Checklist

- [ ] Never share your seed phrase
- [ ] Verify contract addresses
- [ ] Start with small amounts
- [ ] Check transaction details before confirming
- [ ] Use only official links
- [ ] Keep MetaMask updated

---

## Important Notes

1. **Rewards start immediately** - No waiting period
2. **You can withdraw anytime** - No lock-up period  
3. **Claiming doesn't unstake** - Keep earning after claiming
4. **Withdrawing auto-claims** - Get rewards automatically
5. **APY changes dynamically** - Based on total staked

---

## Need Help?

- Detailed Guide: [USER_GUIDE.md](./USER_GUIDE.md)
- Visual Flows: [STAKING_FLOW.md](./STAKING_FLOW.md)
- Technical Docs: [README.md](./README.md)
- Report Issues: Open GitHub issue

---

## Transaction Checklist

Before Each Transaction:
```
✓ Check you're on Sepolia network
✓ Have enough ETH for gas (~$0.02)
✓ Verify the contract address
✓ Review amount in MetaMask
✓ Confirm gas fee is reasonable
```

---

## Dashboard Stats Explained

**Your Balance**: Tokens in wallet (not staked)  
**Your Staked**: Tokens earning rewards  
**Rewards Earned**: Claimable rewards (updates every second)  
**APY**: Expected yearly return percentage

---

**Last Updated**: January 2026  
**Network**: Sepolia Testnet  
**Version**: 1.0
