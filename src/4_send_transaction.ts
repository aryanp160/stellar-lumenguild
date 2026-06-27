import * as StellarSdk from "@stellar/stellar-sdk";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function sendTransaction() {
  console.log("=== Stellar First Transaction ===");
  const secretKey = process.env.STELLAR_SECRET_KEY;
  
  if (!secretKey) {
    console.error("❌ Error: STELLAR_SECRET_KEY not found in .env");
    process.exit(1);
  }

  // Generate Keypair from the secret key
  const sourceKeypair = StellarSdk.Keypair.fromSecret(secretKey);
  const sourcePublicKey = sourceKeypair.publicKey();
  
  // We will send 1 XLM to the Testnet Friendbot address (or any valid address)
  const destinationId = "GBYEQK40YJOMJOF5OMZ7H5G6M4Z4U6Y7H6X7Y6Z4U6Y7H6X7Y6Z4U6Y7"; // Randomly generated or use a friend's
  // Let's use a newly generated random account just for this test
  const destinationKeypair = StellarSdk.Keypair.random();
  const destinationPublicKey = destinationKeypair.publicKey();

  console.log(`Sender: ${sourcePublicKey}`);
  console.log(`Destination: ${destinationPublicKey}`);
  
  // Initialize the Stellar Testnet Server
  const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
  
  try {
    console.log("\nLoading sender account details...");
    // Load the sender's account to get its current sequence number
    const sourceAccount = await server.loadAccount(sourcePublicKey);
    
    console.log("Building transaction...");
    // Build the transaction
    const fee = await server.fetchBaseFee();
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      // Add a createAccount operation since the destination is brand new
      .addOperation(StellarSdk.Operation.createAccount({
        destination: destinationPublicKey,
        startingBalance: "2", // Send 2 XLM to meet minimum balance requirements
      }))
      // Alternatively, to send to an existing account, we would use Payment operation:
      // .addOperation(StellarSdk.Operation.payment({
      //   destination: destinationId,
      //   asset: StellarSdk.Asset.native(),
      //   amount: "1",
      // }))
      .setTimeout(30)
      .build();
      
    console.log("Signing transaction...");
    // Sign the transaction with the sender's secret key
    transaction.sign(sourceKeypair);
    
    console.log("Broadcasting transaction to the Stellar network...");
    // Submit the transaction to the Stellar network
    const response = await server.submitTransaction(transaction);
    
    console.log("\n✅ Transaction Successful!");
    console.log("Transaction Hash:", response.hash);
    console.log(`View on Stellar Expert: https://stellar.expert/explorer/testnet/tx/${response.hash}`);
    
  } catch (error: any) {
    console.error("\n❌ Transaction failed.");
    if (error.response && error.response.data) {
      console.error("Error details:", JSON.stringify(error.response.data.extras.result_codes, null, 2));
    } else {
      console.error(error);
    }
  }
}

sendTransaction().catch(console.error);
