# Staking Vault Frontend

Modern Next.js 16 frontend for the DeFi Staking Vault protocol.

## 📁 Folder Structure

```
staking-vault-frontend/
├── app/                          # Next.js App Router
│   ├── (routes)/                # Route groups (not in URL)
│   │   └── dashboard/           # Dashboard page (/dashboard)
│   │       └── page.tsx         # Staking interface
│   ├── favicon.ico              # Site favicon
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (/)
│   └── providers.tsx            # Wagmi & RainbowKit config
│
├── components/                   # Reusable components
│   └── (to be added)
│
├── lib/                         # Utilities and configurations
│   ├── contracts.ts             # Contract addresses & ABIs
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Helper functions
│
├── public/                      # Static assets
│   ├── next.svg
│   └── ...
│
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS config (Tailwind)
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🚀 Routes

- `/` - Landing page with features and hero section
- `/dashboard` - Staking dashboard (requires wallet connection)

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Web3**: 
  - Wagmi v2
  - RainbowKit
  - Viem
- **State Management**: TanStack Query

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Variables

No environment variables needed for basic operation. The app connects to Sepolia testnet by default.

## 🔧 Configuration

### Contract Addresses

Update `lib/contracts.ts` with your deployed contract addresses:

```typescript
export const STAKING_VAULT_ADDRESS = "0xYourVaultAddress";
export const MOCK_TOKEN_ADDRESS = "0xYourTokenAddress";
```

### Network

Default network is Sepolia. To change, update `app/providers.tsx`:

```typescript
const config = createConfig({
  chains: [sepolia], // Change to your desired chain
  // ...
});
```

## 📦 Key Files

### `app/page.tsx`
Home page with hero section, features, and call-to-action

### `app/(routes)/dashboard/page.tsx`
Main staking interface with:
- Balance display
- Staking functions
- Reward claiming
- APY calculation

### `app/providers.tsx`
Web3 provider configuration:
- Wagmi setup
- RainbowKit configuration
- Network validation

### `lib/contracts.ts`
Contract configurations:
- Addresses
- ABIs
- Function signatures

## 🎯 Features

- ✅ Wallet connection (multiple wallets supported)
- ✅ Network validation (Sepolia)
- ✅ Token balance display
- ✅ Staking functionality
- ✅ Withdraw functionality
- ✅ Reward claiming
- ✅ Real-time APY calculation
- ✅ Responsive design
- ✅ Glass-morphism UI

## 🔐 Security

- Client-side only (no backend)
- No private keys stored
- All transactions signed by user wallet
- Network validation before operations

## 📱 Responsive Design

Fully responsive across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🤝 Contributing

1. Follow the existing folder structure
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Test across different screen sizes
5. Ensure wallet connection works

## 📄 License

MIT
