# Stellar Journey to Mastery — White Belt

This repository contains the completion of the Stellar Journey to Mastery — White Belt challenge. It demonstrates fundamental interactions with the Stellar blockchain using the `@stellar/stellar-sdk` via TypeScript.

## Features

- **Wallet Creation:** Generates a new random Stellar Keypair and securely stores the credentials.
- **Account Funding:** Automatically connects to Friendbot (Stellar's Testnet Faucet) to fund newly generated accounts.
- **Balance Retrieval:** Connects to the Stellar Testnet, fetches the account details, and displays balances.
- **First Transaction:** Builds, signs, and broadcasts a transaction (Create Account operation) to the Stellar Testnet.

## Setup Instructions

### Prerequisites
- Node.js (v22+)
- npm (Node Package Manager)
- Git

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/aryanp160/stellar-white.git
   cd stellar-white
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Copy `.env.example` to `.env` if you have existing testnet keys, OR simply run the creation script below to automatically generate them.

## Running the Project

Run the following scripts in order to complete the workflow:

1. **Create Wallet:**
   ```bash
   npm run create
   ```
   *Generates a new keypair and saves it to `.env`.*

2. **Fund Wallet:**
   ```bash
   npm run fund
   ```
   *Requests 10,000 testnet XLM from Friendbot.*

3. **Check Balance:**
   ```bash
   npm run balance
   ```
   *Connects to the testnet and prints your current XLM balance.*

4. **Send Transaction:**
   ```bash
   npm run send
   ```
   *Creates a transaction, signs it, and broadcasts it to the Stellar testnet.*

## White Belt Completion Notes

- **Secret Management:** Secrets are stored securely in `.env` and are explicitly ignored in `.gitignore`.
- **Code Quality:** Written in TypeScript, properly typed, and documented with clear logging.
- **Error Handling:** Robust try/catch blocks with friendly feedback in case Friendbot fails or accounts do not exist.

---
*Created as part of the Stellar Journey to Mastery.*
