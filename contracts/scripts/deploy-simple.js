const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 OctoFi Simple Contract Deployment");
  console.log("====================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "STT");

  // We already have the tokens deployed, let's just deploy one staking pool
  const tokenAddresses = {
    USDC: "0x2a57095A0F93d23d03BE23EA926B52C6c30D23bB",
    USDT: "0xa233487B7FB5941Dd81A28A4A547519760BFE89e", 
    ARB: "0x160de1ACa29C95E36A9d4ecc0b6d22E72663f030"
  };

  console.log("\n=== Deploying USDC Staking Pool ===");
  
  const StakingPool = await ethers.getContractFactory("StakingPool");
  
  // USDC Staking Pool (12.5% APY, no lock, flexible)
  console.log("Deploying USDC Staking Pool...");
  const usdcRewardRate = ethers.parseUnits("0.000003963", 18); // ~12.5% APY
  
  try {
    const usdcPool = await StakingPool.deploy(
      tokenAddresses.USDC, // staking token
      tokenAddresses.USDC, // reward token (same as staking)
      usdcRewardRate,
      0, // no lock period
      ethers.parseUnits("10", 6), // min stake: 10 USDC
      0 // no max stake limit
    );
    await usdcPool.waitForDeployment();
    const usdcPoolAddress = await usdcPool.getAddress();
    console.log("✅ USDC Staking Pool deployed to:", usdcPoolAddress);

    // Update environment files
    console.log("\n=== Updating Environment Variables ===");
    
    // Update contracts/.env
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(/USDC_ADDRESS=.*/, `USDC_ADDRESS=${tokenAddresses.USDC}`);
    envContent = envContent.replace(/USDT_ADDRESS=.*/, `USDT_ADDRESS=${tokenAddresses.USDT}`);
    envContent = envContent.replace(/ARB_ADDRESS=.*/, `ARB_ADDRESS=${tokenAddresses.ARB}`);
    envContent = envContent.replace(/USDC_POOL_ADDRESS=.*/, `USDC_POOL_ADDRESS=${usdcPoolAddress}`);
    
    fs.writeFileSync(envPath, envContent);

    // Update main project .env
    const mainEnvPath = path.join(__dirname, '../../.env');
    const mainEnvContent = `# OctoFi Frontend Environment Variables

# Somnia Network Configuration
VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=50312
VITE_SOMNIA_EXPLORER=https://explorer.somnia.network

# Deployed Contract Addresses
VITE_USDC_ADDRESS=${tokenAddresses.USDC}
VITE_USDT_ADDRESS=${tokenAddresses.USDT}
VITE_ARB_ADDRESS=${tokenAddresses.ARB}
VITE_USDC_POOL_ADDRESS=${usdcPoolAddress}
VITE_USDT_POOL_ADDRESS=
VITE_ARB_POOL_ADDRESS=

# Optional: Analytics and Monitoring
# VITE_SENTRY_DSN=your-sentry-dsn
# VITE_GA_TRACKING_ID=your-google-analytics-id
`;
    
    fs.writeFileSync(mainEnvPath, mainEnvContent);

    console.log("\n🎉 DEPLOYMENT COMPLETED! 🎉");
    console.log("============================");
    console.log("📋 Contract Addresses:");
    console.log(`   Mock USDC: ${tokenAddresses.USDC}`);
    console.log(`   Mock USDT: ${tokenAddresses.USDT}`);
    console.log(`   Mock ARB: ${tokenAddresses.ARB}`);
    console.log(`   USDC Pool: ${usdcPoolAddress}`);
    
    console.log("\n🔗 Explorer Links:");
    console.log(`   USDC: https://explorer.somnia.network/address/${tokenAddresses.USDC}`);
    console.log(`   USDC Pool: https://explorer.somnia.network/address/${usdcPoolAddress}`);
    
    console.log("\n📁 Environment Files Updated:");
    console.log("   ✅ contracts/.env");
    console.log("   ✅ .env (main project)");
    
    console.log("\n🚀 Next Steps:");
    console.log("   1. Update src/services/stakingService.ts (set useMockData = false)");
    console.log("   2. Update src/lib/stakingConstants.ts with contract addresses");
    console.log("   3. Run: npm run test");
    console.log("   4. Run: npm run build");
    console.log("   5. Test staking with MetaMask on Somnia Network");
    
    console.log("\n💰 Get Test Tokens:");
    console.log(`   - Use faucet function: await mockUSDC.faucet(ethers.parseUnits("1000", 6))`);
    console.log(`   - Your wallet: ${deployer.address}`);

  } catch (error) {
    console.error("❌ Error deploying staking pool:", error.message);
    
    // Still update environment with token addresses
    console.log("\n📝 Updating environment with token addresses...");
    
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(/USDC_ADDRESS=.*/, `USDC_ADDRESS=${tokenAddresses.USDC}`);
    envContent = envContent.replace(/USDT_ADDRESS=.*/, `USDT_ADDRESS=${tokenAddresses.USDT}`);
    envContent = envContent.replace(/ARB_ADDRESS=.*/, `ARB_ADDRESS=${tokenAddresses.ARB}`);
    
    fs.writeFileSync(envPath, envContent);

    const mainEnvPath = path.join(__dirname, '../../.env');
    const mainEnvContent = `# OctoFi Frontend Environment Variables

# Somnia Network Configuration  
VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=50312
VITE_SOMNIA_EXPLORER=https://explorer.somnia.network

# Deployed Contract Addresses
VITE_USDC_ADDRESS=${tokenAddresses.USDC}
VITE_USDT_ADDRESS=${tokenAddresses.USDT}
VITE_ARB_ADDRESS=${tokenAddresses.ARB}
VITE_USDC_POOL_ADDRESS=
VITE_USDT_POOL_ADDRESS=
VITE_ARB_POOL_ADDRESS=

# Optional: Analytics and Monitoring
# VITE_SENTRY_DSN=your-sentry-dsn
# VITE_GA_TRACKING_ID=your-google-analytics-id
`;
    
    fs.writeFileSync(mainEnvPath, mainEnvContent);
    
    console.log("✅ Token addresses saved to environment files");
    console.log("⚠️  You can deploy staking pools later when you have more STT tokens");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });