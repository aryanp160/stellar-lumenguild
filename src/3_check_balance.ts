import * as StellarSdk from "@stellar/stellar-sdk";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function checkBalance() {
  console.log("=== Stellar Balance Retrieval ===");
  const publicKey = process.env.STELLAR_PUBLIC_KEY;
  
  if (!publicKey) {
    console.error("❌ Error: STELLAR_PUBLIC_KEY not found in .env");
    process.exit(1);
  }

  console.log(`Connecting to Stellar Testnet...`);
  
  // Initialize the Stellar Testnet Server
  const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
  
  console.log(`Fetching balances for account: ${publicKey}\n`);
  
  try {
    // Load the account from the Stellar network
    const account = await server.loadAccount(publicKey);
    
    console.log("✅ Account found!");
    console.log("Balances:");
    
    // Iterate through all balances (can be XLM or other assets)
    account.balances.forEach((balance) => {
      const assetType = balance.asset_type === "native" ? "XLM" : ('asset_code' in balance ? balance.asset_code : "Liquidity Pool");
      console.log(`- ${assetType}: ${balance.balance}`);
    });
    
  } catch (error: any) {
    console.error("❌ Error retrieving balance.");
    if (error.response && error.response.status === 404) {
      console.error("The account does not exist on the network yet.");
      console.error("Make sure you fund it first by running: npm run fund");
    } else {
      console.error("Detailed error:", error);
    }
  }
}

checkBalance().catch(console.error);
