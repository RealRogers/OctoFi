const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 OctoFi Smart Contract Deployment Setup");
  console.log("==========================================");

  // Step 1: Generate or use existing private key
  let privateKey;
  const envPath = path.join(__dirname, '../.env');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const privateKeyMatch = envContent.match(/PRIVATE_KEY=(.+)/);
    if (privateKeyMatch && privateKeyMatch[1] && privateKeyMatch[1] !== 'your-private-key-here') {
      privateKey = privateKeyMatch[1];
      console.log("✅ Using existing private key from .env");
    }
  }

  if (!privateKey) {
    console.log("🔑 Generating new private key...");
    const wallet = ethers.Wallet.createRandom();
    privateKey = wallet.privateKey;
    
    // Create .env file
    const envContent = `# OctoFi Contract Deployment Environment
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
PRIVATE_KEY=${privateKey}
SOMNIA_API_KEY=your-api-key-here
REPORT_GAS=true

# Contract Addresses (will be populated after deployment)
USDC_ADDRESS=
USDT_ADDRESS=
ARB_ADDRESS=
USDC_POOL_ADDRESS=
USDT_POOL_ADDRESS=
ARB_POOL_ADDRESS=
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Generated new private key and saved to .env");
    console.log(`📝 Wallet Address: ${wallet.address}`);
  }

  // Step 2: Check wallet balance
  const wallet = new ethers.Wallet(privateKey);
  console.log(`\n📍 Deployment Address: ${wallet.address}`);

  try {
    const provider = new ethers.JsonRpcProvider("https://dream-rpc.somnia.network");
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    
    console.log(`💰 Current Balance: ${balanceInEth} STT`);

    // Step 3: Check if we need testnet tokens
    const minBalance = ethers.parseEther("0.1"); // Need at least 0.1 STT for deployment
    
    if (balance < minBalance) {
      console.log("\n⚠️  Insufficient balance for deployment!");
      console.log("🚰 You need testnet STT tokens. Here are your options:");
      console.log("\n1. Manual Faucet:");
      console.log(`   - Visit: https://testnet.faucet.somnia.network`);
      console.log(`   - Enter address: ${wallet.address}`);
      console.log(`   - Request testnet STT tokens`);
      
      console.log("\n2. Alternative Faucets:");
      console.log(`   - Try searching for 'Somnia testnet faucet'`);
      console.log(`   - Join Somnia Discord/Telegram for faucet access`);
      
      console.log("\n3. If you have STT tokens elsewhere:");
      console.log(`   - Send at least 0.1 STT to: ${wallet.address}`);
      
      console.log("\n⏳ Waiting for tokens... (checking every 30 seconds)");
      console.log("   Press Ctrl+C to exit and run this script again after getting tokens");
      
      // Wait for tokens
      await waitForTokens(provider, wallet.address, minBalance);
    }

    // Step 4: Deploy contracts
    console.log("\n🚀 Starting contract deployment...");
    await deployContracts();
    
  } catch (error) {
    console.error("❌ Error during setup:", error.message);
    
    if (error.message.includes('network')) {
      console.log("\n🔧 Network connection issue. Please check:");
      console.log("   - Internet connection");
      console.log("   - Somnia testnet RPC URL: https://testnet.rpc.somnia.network");
    }
    
    process.exit(1);
  }
}

async function waitForTokens(provider, address, minBalance) {
  let attempts = 0;
  const maxAttempts = 60; // Wait up to 30 minutes
  
  while (attempts < maxAttempts) {
    try {
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      
      console.log(`⏳ Attempt ${attempts + 1}: Balance = ${balanceInEth} STT`);
      
      if (balance >= minBalance) {
        console.log("✅ Sufficient balance received! Proceeding with deployment...");
        return;
      }
      
      // Wait 30 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 30000));
      attempts++;
      
    } catch (error) {
      console.log(`⚠️  Error checking balance: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 30000));
      attempts++;
    }
  }
  
  console.log("❌ Timeout waiting for tokens. Please:");
  console.log("   1. Get testnet tokens from faucet");
  console.log("   2. Run this script again");
  process.exit(1);
}

async function deployContracts() {
  console.log("\n=== Deploying Mock Tokens ===");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "STT");

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  
  // Deploy USDC Mock (6 decimals)
  console.log("Deploying Mock USDC...");
  const mockUSDC = await MockERC20.deploy(
    "Mock USDC",
    "USDC",
    6,
    ethers.parseUnits("1000000", 6) // 1M USDC
  );
  await mockUSDC.waitForDeployment();
  const usdcAddress = await mockUSDC.getAddress();
  console.log("✅ Mock USDC deployed to:", usdcAddress);

  // Deploy USDT Mock (6 decimals)
  console.log("Deploying Mock USDT...");
  const mockUSDT = await MockERC20.deploy(
    "Mock USDT",
    "USDT", 
    6,
    ethers.parseUnits("1000000", 6) // 1M USDT
  );
  await mockUSDT.waitForDeployment();
  const usdtAddress = await mockUSDT.getAddress();
  console.log("✅ Mock USDT deployed to:", usdtAddress);

  // Deploy ARB Mock (18 decimals)
  console.log("Deploying Mock ARB...");
  const mockARB = await MockERC20.deploy(
    "Mock Arbitrum",
    "ARB",
    18,
    ethers.parseUnits("1000000", 18) // 1M ARB
  );
  await mockARB.waitForDeployment();
  const arbAddress = await mockARB.getAddress();
  console.log("✅ Mock ARB deployed to:", arbAddress);

  // Deploy Staking Pools
  console.log("\n=== Deploying Staking Pools ===");
  
  const StakingPool = await ethers.getContractFactory("StakingPool");
  
  // USDC Staking Pool (12.5% APY, no lock, flexible)
  console.log("Deploying USDC Staking Pool...");
  const usdcRewardRate = ethers.parseUnits("0.000003963", 18); // ~12.5% APY
  const usdcPool = await StakingPool.deploy(
    usdcAddress, // staking token
    usdcAddress, // reward token (same as staking)
    usdcRewardRate,
    0, // no lock period
    ethers.parseUnits("10", 6), // min stake: 10 USDC
    0 // no max stake limit
  );
  await usdcPool.waitForDeployment();
  const usdcPoolAddress = await usdcPool.getAddress();
  console.log("✅ USDC Staking Pool deployed to:", usdcPoolAddress);

  // USDT Staking Pool (15.8% APY, 30 days lock)
  console.log("Deploying USDT Staking Pool...");
  const usdtRewardRate = ethers.parseUnits("0.000005009", 18); // ~15.8% APY
  const usdtPool = await StakingPool.deploy(
    usdtAddress,
    usdtAddress,
    usdtRewardRate,
    30 * 24 * 60 * 60, // 30 days lock
    ethers.parseUnits("10", 6), // min stake: 10 USDT
    0
  );
  await usdtPool.waitForDeployment();
  const usdtPoolAddress = await usdtPool.getAddress();
  console.log("✅ USDT Staking Pool deployed to:", usdtPoolAddress);

  // ARB Staking Pool (22.3% APY, 90 days lock)
  console.log("Deploying ARB Staking Pool...");
  const arbRewardRate = ethers.parseUnits("0.000007067", 18); // ~22.3% APY
  const arbPool = await StakingPool.deploy(
    arbAddress,
    arbAddress,
    arbRewardRate,
    90 * 24 * 60 * 60, // 90 days lock
    ethers.parseUnits("5", 18), // min stake: 5 ARB
    0
  );
  await arbPool.waitForDeployment();
  const arbPoolAddress = await arbPool.getAddress();
  console.log("✅ ARB Staking Pool deployed to:", arbPoolAddress);

  // Add initial rewards to pools
  console.log("\n=== Adding Initial Rewards ===");
  
  const rewardAmount = ethers.parseUnits("100000", 6); // 100k tokens for USDC/USDT
  const arbRewardAmount = ethers.parseUnits("100000", 18); // 100k ARB
  
  console.log("Adding rewards to USDC pool...");
  await mockUSDC.transfer(usdcPoolAddress, rewardAmount);
  
  console.log("Adding rewards to USDT pool...");
  await mockUSDT.transfer(usdtPoolAddress, rewardAmount);
  
  console.log("Adding rewards to ARB pool...");
  await mockARB.transfer(arbPoolAddress, arbRewardAmount);
  
  console.log("✅ Initial rewards added to all pools");

  // Update .env file with contract addresses
  console.log("\n=== Updating Environment Variables ===");
  
  const envPath = path.join(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(/USDC_ADDRESS=.*/, `USDC_ADDRESS=${usdcAddress}`);
  envContent = envContent.replace(/USDT_ADDRESS=.*/, `USDT_ADDRESS=${usdtAddress}`);
  envContent = envContent.replace(/ARB_ADDRESS=.*/, `ARB_ADDRESS=${arbAddress}`);
  envContent = envContent.replace(/USDC_POOL_ADDRESS=.*/, `USDC_POOL_ADDRESS=${usdcPoolAddress}`);
  envContent = envContent.replace(/USDT_POOL_ADDRESS=.*/, `USDT_POOL_ADDRESS=${usdtPoolAddress}`);
  envContent = envContent.replace(/ARB_POOL_ADDRESS=.*/, `ARB_POOL_ADDRESS=${arbPoolAddress}`);
  
  fs.writeFileSync(envPath, envContent);

  // Also update main project .env
  const mainEnvPath = path.join(__dirname, '../../.env');
  const mainEnvContent = `# OctoFi Frontend Environment Variables

# Somnia Testnet Configuration
VITE_SOMNIA_RPC_URL=https://testnet.rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=997
VITE_SOMNIA_EXPLORER=https://testnet.explorer.somnia.network

# Deployed Contract Addresses
VITE_USDC_ADDRESS=${usdcAddress}
VITE_USDT_ADDRESS=${usdtAddress}
VITE_ARB_ADDRESS=${arbAddress}
VITE_USDC_POOL_ADDRESS=${usdcPoolAddress}
VITE_USDT_POOL_ADDRESS=${usdtPoolAddress}
VITE_ARB_POOL_ADDRESS=${arbPoolAddress}

# Optional: Analytics and Monitoring
# VITE_SENTRY_DSN=your-sentry-dsn
# VITE_GA_TRACKING_ID=your-google-analytics-id
`;
  
  fs.writeFileSync(mainEnvPath, mainEnvContent);

  // Output deployment summary
  console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉");
  console.log("=====================================");
  console.log("📋 Contract Addresses:");
  console.log(`   Mock USDC: ${usdcAddress}`);
  console.log(`   Mock USDT: ${usdtAddress}`);
  console.log(`   Mock ARB: ${arbAddress}`);
  console.log(`   USDC Pool: ${usdcPoolAddress}`);
  console.log(`   USDT Pool: ${usdtPoolAddress}`);
  console.log(`   ARB Pool: ${arbPoolAddress}`);
  
  console.log("\n🔗 Explorer Links:");
  console.log(`   USDC: https://testnet.explorer.somnia.network/address/${usdcAddress}`);
  console.log(`   USDT: https://testnet.explorer.somnia.network/address/${usdtAddress}`);
  console.log(`   ARB: https://testnet.explorer.somnia.network/address/${arbAddress}`);
  
  console.log("\n📁 Environment Files Updated:");
  console.log("   ✅ contracts/.env");
  console.log("   ✅ .env (main project)");
  
  console.log("\n🚀 Next Steps:");
  console.log("   1. Update src/services/stakingService.ts (set useMockData = false)");
  console.log("   2. Run: npm run test");
  console.log("   3. Run: npm run build");
  console.log("   4. Run: npm run preview");
  console.log("   5. Test staking with MetaMask on Somnia Testnet");
  
  console.log("\n💰 Get Test Tokens:");
  console.log(`   - Use faucet functions in deployed contracts`);
  console.log(`   - Or visit: https://testnet.faucet.somnia.network`);
  console.log(`   - Send to your wallet: ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });