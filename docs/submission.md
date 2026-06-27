# Stellar White Belt Challenge Submission

## 1. Wallet Creation Proof

**What is a Stellar Wallet?**
A Stellar Wallet is basically an interface that interacts with a Stellar Account on the ledger. An account is represented by a **Keypair**.

**Public Key vs. Secret Key**
- **Public Key (starts with G):** This is your address. It is safe to share with others so they can send you funds.
- **Secret Key (starts with S):** This is your private credential. It must **NEVER** be shared. It acts as your signature to authorize transactions and control your funds.

**Proof of Implementation:**
- Code: `src/1_create_wallet.ts`
- Feature: Generates a keypair and saves it to `.env` while ensuring the secret key is never committed to GitHub (via `.gitignore`).

**Screenshot Required:**
> Please run `npm run create` in your terminal and take a screenshot of the successful wallet generation (hide your Secret Key if taking screenshots for public forums, though these are testnet keys).

---

## 2. Balance Retrieval Proof

**Proof of Implementation:**
- Code: `src/3_check_balance.ts`
- Feature: Uses `StellarSdk.Horizon.Server` to load account details and parses the `balances` array to display the account's XLM (and other assets).

**Screenshot Required:**
> Please run `npm run fund` followed by `npm run balance` and take a screenshot showing the 10,000 XLM balance retrieved from the testnet.

---

## 3. First Transaction Proof

**Proof of Implementation:**
- Code: `src/4_send_transaction.ts`
- Feature: Uses `TransactionBuilder` to create an operation, signs it with the generated secret key, and broadcasts it to the network via `server.submitTransaction()`.

**Screenshot Required:**
> Please run `npm run send` and take a screenshot showing the terminal output containing the "Transaction Successful!" message and the printed **Transaction Hash**.

---

### Final Submission Checklist
- [x] All code pushed to GitHub repository
- [x] `.env` excluded from version control
- [ ] Screenshots captured (Wallet, Balance, Transaction)
- [ ] Repository submitted for the White Belt Challenge
