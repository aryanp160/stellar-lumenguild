# LumenGuild 


LumenGuild is a decentralized application (dApp) built on the Stellar network that serves as a financial hub for ad-hoc freelance collectives. It allows independent workers (designers, developers, copywriters, etc.) to form temporary "Guilds" for client projects, track shared expenses, and automatically settle debts on-chain using XLM via the Freighter wallet.

This repository also contains the completion of the **Stellar Journey to Mastery — White Belt** challenge.

## Smart Contract Deployment
## Live Demo URL :
https://lumenguild.netlify.app/

A basic Soroban smart contract for LumenGuild has been deployed to the Stellar Testnet:
- **Contract Address (Testnet):** `CACBOTO26HWBQU5V2W6XHUTOIMLRNR4HS47RMPCIAZVLBJFHQO4UKCBJ`
- **Explorer Link:** [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CACBOTO26HWBQU5V2W6XHUTOIMLRNR4HS47RMPCIAZVLBJFHQO4UKCBJ)
- Transaction Hash of Smart Contract : aa798fcbde6260556b698f03eab5c2d74b32c46b005b5719aae0b6f5851c4af0
- **Source Code:** Located in `contract/src/lib.rs`

## Features

### LumenGuild Web App (Vite + React + Tailwind)
- **Modern UI:** Responsive design with a dark mode glassmorphism aesthetic.
- **Freighter Integration:** Connect your Stellar wallet seamlessly.
- **Guild Management:** Create groups and invite members via their Stellar Public Keys.
- **Expense Tracking:** Log out-of-pocket project costs.
- **Settlement Calculator:** Automatically calculates who owes who based on equal-share splits.
- **On-Chain Settlement:** Pay debts directly from the UI using `TransactionBuilder` and Freighter signing.

### White Belt Scripts (Node.js)
Located in `scripts/whitebelt/`, these scripts demonstrate the fundamentals of the Stellar SDK:
- **Wallet Creation:** Generates secure keypairs.
- **Testnet Funding:** Connects to Friendbot.
- **Balance Retrieval:** Fetches live balances.
- **Transactions:** Broadcasts native XLM transactions.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS v3.x, Lucide React (Icons)
- **Blockchain:** `@stellar/stellar-sdk`, `@stellar/freighter-api`
- **State Management:** React Context, LocalStorage
- **Routing:** React Router DOM

## Folder Structure

```text
stellar-white/
├── src/
│   ├── components/       # Reusable UI components (Card, Modal, Button)
│   ├── context/          # WalletContext for Freighter integration
│   ├── hooks/            # LocalStorage persistence logic (useGroups)
│   ├── pages/            # Dashboard, LandingPage, GroupDetails
│   ├── utils/            # Settlement math & tailwind utilities
│   ├── App.tsx           # React routing
│   └── main.tsx          # React entrypoint
├── scripts/whitebelt/    # Original White Belt Node.js scripts
├── docs/                 # White Belt submission proofs
└── README.md
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v22+)
- [Freighter Wallet Extension](https://freighter.app/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aryanp160/stellar-white.git
   cd stellar-white
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Ensure your Freighter wallet is set to the **Testnet** network.

### Running White Belt Scripts

If you want to run the underlying Node.js scripts:
```bash
npm run create    # Generate wallet
npm run fund      # Fund with Friendbot
npm run balance   # Check balance
npm run send      # Send test transaction
```

## Building for Production

To build the static web app for production (e.g., to deploy to Vercel, Netlify, or Cloudflare Pages):
```bash
npm run build
```
The output will be generated in the `dist/` directory.



