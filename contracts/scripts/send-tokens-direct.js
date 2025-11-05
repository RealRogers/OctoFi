/**
 * Direct Token Faucet for Testing Address
 * Calls faucet function directly for the testing address
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
  console.log("🚰 Direct Faucet for Testing Account");
  console.log("====================================");
  
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  console.log(`📤 Faucet Caller: ${signerAddress}`);
  console.log(`📥 Target Address: ${TARGET_ADDRESS}`);
  console.log(`💰 Getting tokens via faucet...`);
  
  // ERC20 ABI with faucetTo function
  const erc20ABI = [
    "function faucet(uint256 amount)",
    "function faucetTo(address to, uint256 amount)",
    "function balanceOf(address account) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function mint(address to, uint256 amount)"
  ];
  
  try {
    // Get USDC tokens (1500 USDC)
    console.log("\n🪙 Getting USDC tokens...");
    const usdcContract = new ethers.Contract(CONTRACTS.USDC, erc20ABI, signer);
    
    try {
      // Try faucetTo first
      const usdcAmount = ethers.parseUnits("1500", 6);
      const usdcTx = await usdcContract.faucetTo(TARGET_ADDRESS, usdcAmount);
      await usdcTx.wait();
    } catch (error) {
      // If faucetTo doesn't exist, try mint
      try {
        const usdcAmount = ethers.parseUnits("1500", 6);
        const usdcTx = await usdcContract.mint(TARGET_ADDRESS, usdcAmount);
        await usdcTx.wait();
      } catch (mintError) {
        console.log("Using regular faucet method for USDC...");
        // This will mint to the signer, we'll need to transfer manually
        const usdcAmount = ethers.parseUnits("1500", 6);
        const usdcTx = await usdcContract.faucet(usdcAmount);
        await usdcTx.wait();
        console.log("⚠️  USDC minted to deployer address. You'll need to transfer manually.");
      }
    }
    
    const usdcBalance = await usdcContract.balanceOf(TARGET_ADDRESS);
    console.log(`✅ USDC Balance: ${ethers.formatUnits(usdcBalance, 6)} USDC`);
    
    // Get USDT tokens (1500 USDT)
    console.log("\n🪙 Getting USDT tokens...");
    const usdtContract = new ethers.Contract(CONTRACTS.USDT, erc20ABI, signer);
    
    try {
      const usdtAmount = ethers.parseUnits("1500", 6);
      const usdtTx = await usdtContract.faucetTo(TARGET_ADDRESS, usdtAmount);
      await usdtTx.wait();
    } catch (error) {
      try {
        const usdtAmount = ethers.parseUnits("1500", 6);
        const usdtTx = await usdtContract.mint(TARGET_ADDRESS, usdtAmount);
        await usdtTx.wait();
      } catch (mintError) {
        console.log("Using regular faucet method for USDT...");
        const usdtAmount = ethers.parseUnits("1500", 6);
        const usdtTx = await usdtContract.faucet(usdtAmount);
        await usdtTx.wait();
        console.log("⚠️  USDT minted to deployer address. You'll need to transfer manually.");
      }
    }
    
    const usdtBalance = await usdtContract.balanceOf(TARGET_ADDRESS);
    console.log(`✅ USDT Balance: ${ethers.formatUnits(usdtBalance, 6)} USDT`);
    
    // Get ARB tokens (1500 ARB)
    console.log("\n🪙 Getting ARB tokens...");
    const arbContract = new ethers.Contract(CONTRACTS.ARB, erc20ABI, signer);
    
    try {
      const arbAmount = ethers.parseUnits("1500", 18);
      const arbTx = await arbContract.faucetTo(TARGET_ADDRESS, arbAmount);
      await arbTx.wait();
    } catch (error) {
      try {
        const arbAmount = ethers.parseUnits("1500", 18);
        const arbTx = await arbContract.mint(TARGET_ADDRESS, arbAmount);
        await arbTx.wait();
      } catch (mintError) {
        console.log("Using regular faucet method for ARB...");
        const arbAmount = ethers.parseUnits("1500", 18);
        const arbTx = await arbContract.faucet(arbAmount);
        await arbTx.wait();
        console.log("⚠️  ARB minted to deployer address. You'll need to transfer manually.");
      }
    }
    
    const arbBalance = await arbContract.balanceOf(TARGET_ADDRESS);
    console.log(`✅ ARB Balance: ${ethers.formatUnits(arbBalance, 18)} ARB`);
    
    console.log("\n🎉 TOKEN DISTRIBUTION COMPLETE!");
    console.log("===============================");
    console.log(`📋 Final Balances for ${TARGET_ADDRESS}:`);
    console.log(`   USDC: ${ethers.formatUnits(usdcBalance, 6)}`);
    console.log(`   USDT: ${ethers.formatUnits(usdtBalance, 6)}`);
    console.log(`   ARB:  ${ethers.formatUnits(arbBalance, 18)}`);
    
    if (usdcBalance > 0 || usdtBalance > 0 || arbBalance > 0) {
      console.log("\n🚀 READY TO TEST!");
      console.log("   1. Connect MetaMask with address: 0xc5ce44d994c00f2fea2079408e8b6c18b6d2f156");
      console.log("   2. Switch to Somnia Testnet (Chain ID: 50312)");
      console.log("   3. Go to http://localhost:5173");
      console.log("   4. Navigate to /stake and start testing!");
    } else {
      console.log("\n⚠️  No tokens were successfully sent to target address.");
      console.log("   You may need to manually transfer tokens or use a different approach.");
    }
    
  } catch (error) {
    console.error("❌ Error in token distribution:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });