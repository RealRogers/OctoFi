/**
 * Faucet Script - Get Test Tokens
 * Run: npx hardhat run scripts/faucet.js --network somnia-testnet
 */

const { ethers } = require("hardhat");

// Contract addresses (update these with your deployed addresses)
const CONTRACTS = {
  USDC: "0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB",
  USDT: "0xa233487B7FB5941Dd81A28A4A547519760BFE89e", 
  ARB: "0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030"
};

async function main() {
  console.log("🚰 OctoFi Token Faucet");
  console.log("=====================");
  
  const [signer] = await ethers.getSigners();
  const userAddress = await signer.getAddress();
  
  console.log(`📍 User Address: ${userAddress}`);
  console.log(`💰 Getting test tokens...`);
  
  // ERC20 ABI for faucet function
  const erc20ABI = [
    "function faucet(uint256 amount)",
    "function balanceOf(address account) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
  ];
  
  try {
    // Get USDC tokens (1000 USDC with 6 decimals)
    console.log("\n🪙 Getting USDC tokens...");
    const usdcContract = new ethers.Contract(CONTRACTS.USDC, erc20ABI, signer);
    const usdcAmount = ethers.parseUnits("1000", 6); // 1000 USDC
    const usdcTx = await usdcContract.faucet(usdcAmount);
    await usdcTx.wait();
    const usdcBalance = await usdcContract.balanceOf(userAddress);
    console.log(`✅ USDC: ${ethers.formatUnits(usdcBalance, 6)} USDC`);
    
    // Get USDT tokens (1000 USDT with 6 decimals)
    console.log("\n🪙 Getting USDT tokens...");
    const usdtContract = new ethers.Contract(CONTRACTS.USDT, erc20ABI, signer);
    const usdtAmount = ethers.parseUnits("1000", 6); // 1000 USDT
    const usdtTx = await usdtContract.faucet(usdtAmount);
    await usdtTx.wait();
    const usdtBalance = await usdtContract.balanceOf(userAddress);
    console.log(`✅ USDT: ${ethers.formatUnits(usdtBalance, 6)} USDT`);
    
    // Get ARB tokens (1000 ARB with 18 decimals)
    console.log("\n🪙 Getting ARB tokens...");
    const arbContract = new ethers.Contract(CONTRACTS.ARB, erc20ABI, signer);
    const arbAmount = ethers.parseUnits("1000", 18); // 1000 ARB
    const arbTx = await arbContract.faucet(arbAmount);
    await arbTx.wait();
    const arbBalance = await arbContract.balanceOf(userAddress);
    console.log(`✅ ARB: ${ethers.formatUnits(arbBalance, 18)} ARB`);
    
    console.log("\n🎉 SUCCESS! Test tokens received!");
    console.log("===============================");
    console.log("📋 Your Token Balances:");
    console.log(`   USDC: ${ethers.formatUnits(usdcBalance, 6)}`);
    console.log(`   USDT: ${ethers.formatUnits(usdtBalance, 6)}`);
    console.log(`   ARB:  ${ethers.formatUnits(arbBalance, 18)}`);
    console.log("\n🚀 Ready to test staking!");
    console.log("   1. Go to http://localhost:5173");
    console.log("   2. Connect your wallet");
    console.log("   3. Navigate to /stake");
    console.log("   4. Start staking!");
    
  } catch (error) {
    console.error("❌ Error getting tokens:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: You need STT tokens for gas fees");
      console.log("   - Contact Somnia team for testnet STT");
      console.log("   - Or use a wallet with STT balance");
    }
    
    if (error.message.includes("execution reverted")) {
      console.log("\n💡 Solution: Check contract addresses are correct");
      console.log("   - Verify contracts are deployed");
      console.log("   - Check network connection");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });