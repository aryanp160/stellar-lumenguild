import { Keypair } from "@stellar/stellar-sdk";
import * as fs from "fs";
import * as path from "path";

async function createWallet() {
  console.log("=== Stellar Wallet Creation ===");
  console.log("Generating a new Stellar Keypair...");
  
  // Generate a random keypair
  const pair = Keypair.random();
  const publicKey = pair.publicKey();
  const secretKey = pair.secret();
  
  console.log("\n✅ Wallet created successfully!\n");
  console.log("Public Key:", publicKey);
  console.log("Secret Key:", secretKey);
  
  console.log("\n--- SECURITY NOTICE ---");
  console.log("Public Key: Safe to share. Used to receive funds.");
  console.log("Secret Key: NEVER SHARE. Used to sign transactions and control funds.");
  
  // Create .env file with the keys
  const envContent = `STELLAR_PUBLIC_KEY=${publicKey}\nSTELLAR_SECRET_KEY=${secretKey}\n`;
  const envPath = path.resolve(__dirname, "../.env");
  
  if (fs.existsSync(envPath)) {
    console.log("\n⚠️ .env file already exists. Please update it manually with the new keys if desired.");
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ Saved keys to .env file (${envPath})`);
  }
  
  console.log("\nNext Steps:");
  console.log("1. Keep your .env file safe. It is in .gitignore so it won't be committed.");
  console.log("2. Run the funding script to get testnet XLM: npm run fund");
}

createWallet().catch(console.error);
