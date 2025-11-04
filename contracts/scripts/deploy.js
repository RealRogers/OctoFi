const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment to Somnia Testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy Mock Tokens first
  console.log("\n=== Deploying Mock Tokens ===");
  
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  
  // Deploy USDC Mock (6 decimals)
  const mockUSDC = await MockERC20.deploy(
    "Mock USDC",
    "USDC",
    6,
    ethers.parseUnits("1000000", 6) // 1M USDC
  );
  await mockUSDC.waitForDeployment();
  console.log("Mock USDC deployed to:", await mockUSDC.getAddress());

  // Deploy USDT Mock (6 decimals)
  const mockUSDT = await MockERC20.deploy(
    "Mock USDT",
    "USDT", 
    6,
    ethers.parseUnits("1000000", 6) // 1M USDT
  );
  await mockUSDT.waitForDeployment();
  console.log("Mock USDT deployed to:", await mockUSDT.getAddress());

  // Deploy ARB Mock (18 decimals)
  const mockARB = await MockERC20.deploy(
    "Mock Arbitrum",
    "ARB",
    18,
    ethers.parseUnits("1000000", 18) // 1M ARB
  );
  await mockARB.waitForDeployment();
  console.log("Mock ARB deployed to:", await mockARB.getAddress());

  // Deploy Staking Pools
  console.log("\n=== Deploying Staking Pools ===");
  
  const StakingPool = await ethers.getContractFactory("StakingPool");
  
  // USDC Staking Pool (12.5% APY, no lock, flexible)
  const usdcRewardRate = ethers.parseUnits("0.000003963", 18); // ~12.5% APY
  const usdcPool = await StakingPool.deploy(
    await mockUSDC.getAddress(), // staking token
    await mockUSDC.getAddress(), // reward token (same as staking)
    usdcRewardRate,
    0, // no lock period
    ethers.parseUnits("10", 6), // min stake: 10 USDC
    0 // no max stake limit
  );
  await usdcPool.waitForDeployment();
  console.log("USDC Staking Pool deployed to:", await usdcPool.getAddress());

  // USDT Staking Pool (15.8% APY, 30 days lock)
  const usdtRewardRate = ethers.parseUnits("0.000005009", 18); // ~15.8% APY
  const usdtPool = await StakingPool.deploy(
    await mockUSDT.getAddress(),
    await mockUSDT.getAddress(),
    usdtRewardRate,
    30 * 24 * 60 * 60, // 30 days lock
    ethers.parseUnits("10", 6), // min stake: 10 USDT
    0
  );
  await usdtPool.waitForDeployment();
  console.log("USDT Staking Pool deployed to:", await usdtPool.getAddress());

  // ARB Staking Pool (22.3% APY, 90 days lock)
  const arbRewardRate = ethers.parseUnits("0.000007067", 18); // ~22.3% APY
  const arbPool = await StakingPool.deploy(
    await mockARB.getAddress(),
    await mockARB.getAddress(),
    arbRewardRate,
    90 * 24 * 60 * 60, // 90 days lock
    ethers.parseUnits("5", 18), // min stake: 5 ARB
    0
  );
  await arbPool.waitForDeployment();
  console.log("ARB Staking Pool deployed to:", await arbPool.getAddress());

  // Add initial rewards to pools
  console.log("\n=== Adding Initial Rewards ===");
  
  const rewardAmount = ethers.parseUnits("100000", 6); // 100k tokens for USDC/USDT
  const arbRewardAmount = ethers.parseUnits("100000", 18); // 100k ARB
  
  // Transfer rewards to pools
  await mockUSDC.transfer(await usdcPool.getAddress(), rewardAmount);
  await mockUSDT.transfer(await usdtPool.getAddress(), rewardAmount);
  await mockARB.transfer(await arbPool.getAddress(), arbRewardAmount);
  
  console.log("Initial rewards added to all pools");

  // Output deployment summary
  console.log("\n=== Deployment Summary ===");
  console.log("Mock USDC:", await mockUSDC.getAddress());
  console.log("Mock USDT:", await mockUSDT.getAddress());
  console.log("Mock ARB:", await mockARB.getAddress());
  console.log("USDC Staking Pool:", await usdcPool.getAddress());
  console.log("USDT Staking Pool:", await usdtPool.getAddress());
  console.log("ARB Staking Pool:", await arbPool.getAddress());

  // Generate .env update
  console.log("\n=== Environment Variables ===");
  console.log("Add these to your .env file:");
  console.log(`VITE_USDC_ADDRESS=${await mockUSDC.getAddress()}`);
  console.log(`VITE_USDT_ADDRESS=${await mockUSDT.getAddress()}`);
  console.log(`VITE_ARB_ADDRESS=${await mockARB.getAddress()}`);
  console.log(`VITE_USDC_POOL_ADDRESS=${await usdcPool.getAddress()}`);
  console.log(`VITE_USDT_POOL_ADDRESS=${await usdtPool.getAddress()}`);
  console.log(`VITE_ARB_POOL_ADDRESS=${await arbPool.getAddress()}`);

  console.log("\nDeployment completed successfully! 🎉");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });