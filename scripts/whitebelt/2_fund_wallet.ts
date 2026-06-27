import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function fundWallet() {
  console.log("=== Stellar Testnet Funding ===");
  const publicKey = process.env.STELLAR_PUBLIC_KEY;
  
  if (!publicKey) {
    console.error("❌ Error: STELLAR_PUBLIC_KEY not found in .env");
    console.log("Please run the wallet creation script first: npm run create");
    process.exit(1);
  }

  console.log(`Funding account: ${publicKey}`);
  console.log("Requesting XLM from Friendbot (Testnet Faucet)...");

  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    const responseJSON = await response.json();
    
    if (response.ok) {
      console.log("✅ Successfully funded wallet with 10,000 testnet XLM!");
    } else {
      console.error("❌ Failed to fund wallet. It might already be funded or Friendbot is busy.");
      console.error("Response:", responseJSON);
    }
  } catch (e) {
    console.error("❌ Error connecting to Friendbot:", e);
  }
}

fundWallet().catch(console.error);
