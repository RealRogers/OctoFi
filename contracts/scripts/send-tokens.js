/**
 * Send Test Tokens Script
 * Send tokens to specific address for testing
 */

const { ethers } = require("hardhat");

// Contract addresses
const CONTRACTS = {
  USDC: "0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB",
  USDT: "0xa233487B7FB5941Dd81A28A4A547519760BFE89e", 
  ARB: "0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030"
};

// Target address for testing
const TARGET_ADDRESS = "0xc5ce44d994c00f2fea2079408e8b6c18b6d2f156";

async function main() {
  console.log("🚰 Sending Test Tokens to Testing Account");
  console.log("=========================================");
  
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  console.log(`📤 From: ${signerAddress}`);
  console.log(`📥 To: ${TARGET_ADDRESS}`);
  console.log(`💰 Sending test tokens...`);
  
  // ERC20 ABI
  const erc20ABI = [
    "function faucet(uint256 amount)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
  ];
  
  try {
    // Send USDC tokens (2000 USDC)
    console.log("\n🪙 Sending USDC tokens...");
    const usdcContract = new ethers.Contract(CONTRACTS.USDC, erc20ABI, signer);
    
    // First get tokens via faucet
    const usdcFaucetAmount = ethers.parseUnits("2000", 6);
    const usdcFaucetTx = await usdcContract.faucet(usdcFaucetAmount);
    await usdcFaucetTx.wait();
    
    // Then transfer to target address
    const usdcTransferAmount = ethers.parseUnits("1500", 6); // Send 1500 USDC
    const usdcTransferTx = await usdcContract.transfer(TARGET_ADDRESS, usdcTransferAmount);
    await usdcTransferTx.wait();
    
    const usdcBalance = await usdcContract.balanceOf(TARGET_ADDRESS);
    console.log(`✅ USDC sent: ${ethers.formatUnits(usdcBalance, 6)} USDC`);
    
    // Send USDT tokens (2000 USDT)
    console.log("\n🪙 Sending USDT tokens...");
    const usdtContract = new ethers.Contract(CONTRACTS.USDT, erc20ABI, signer);
    
    // First get tokens via faucet
    const usdtFaucetAmount = ethers.parseUnits("2000", 6);
    const usdtFaucetTx = await usdtContract.faucet(usdtFaucetAmount);
    await usdtFaucetTx.wait();
    
    // Then transfer to target address
    const usdtTransferAmount = ethers.parseUnits("1500", 6); // Send 1500 USDT
    const usdtTransferTx = await usdtContract.transfer(TARGET_ADDRESS, usdtTransferAmount);
    await usdtTransferTx.wait();
    
    const usdtBalance = await usdtContract.balanceOf(TARGET_ADDRESS);
    console.log(`✅ USDT sent: ${ethers.formatUnits(usdtBalance, 6)} USDT`);
    
    // Send ARB tokens (2000 ARB)
    console.log("\n🪙 Sending ARB tokens...");
    const arbContract = new ethers.Contract(CONTRACTS.ARB, erc20ABI, signer);
    
    // First get tokens via faucet
    const arbFaucetAmount = ethers.parseUnits("2000", 18);
    const arbFaucetTx = await arbContract.faucet(arbFaucetAmount);
    await arbFaucetTx.wait();
    
    // Then transfer to target address
    const arbTransferAmount = ethers.parseUnits("1500", 18); // Send 1500 ARB
    const arbTransferTx = await arbContract.transfer(TARGET_ADDRESS, arbTransferAmount);
    await arbTransferTx.wait();
    
    const arbBalance = await arbContract.balanceOf(TARGET_ADDRESS);
    console.log(`✅ ARB sent: ${ethers.formatUnits(arbBalance, 18)} ARB`);
    
    console.log("\n🎉 SUCCESS! Test tokens sent!");
    console.log("==============================");
    console.log(`📋 Tokens sent to: ${TARGET_ADDRESS}`);
    console.log(`   USDC: ${ethers.formatUnits(usdcBalance, 6)}`);
    console.log(`   USDT: ${ethers.formatUnits(usdtBalance, 6)}`);
    console.log(`   ARB:  ${ethers.formatUnits(arbBalance, 18)}`);
    console.log("\n🚀 Ready to test!");
    console.log("   1. Connect MetaMask with this address");
    console.log("   2. Switch to Somnia Testnet (Chain ID: 50312)");
    console.log("   3. Go to http://localhost:5173");
    console.log("   4. Start testing the staking functionality!");
    
  } catch (error) {
    console.error("❌ Error sending tokens:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: Need more STT tokens for gas fees");
    }
    
    if (error.message.includes("execution reverted")) {
      console.log("\n💡 Solution: Check contract addresses and network");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });