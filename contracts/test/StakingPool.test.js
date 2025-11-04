const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingPool", function () {
  let stakingPool;
  let mockToken;
  let owner;
  let user1;
  let user2;

  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18);
  const REWARD_RATE = ethers.parseUnits("0.000003963", 18); // ~12.5% APY
  const MIN_STAKE = ethers.parseUnits("10", 18);

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Test Token", "TEST", 18, INITIAL_SUPPLY);
    await mockToken.waitForDeployment();

    // Deploy staking pool
    const StakingPool = await ethers.getContractFactory("StakingPool");
    stakingPool = await StakingPool.deploy(
      await mockToken.getAddress(),
      await mockToken.getAddress(),
      REWARD_RATE,
      0, // no lock period
      MIN_STAKE,
      0 // no max stake
    );
    await stakingPool.waitForDeployment();

    // Transfer some tokens to users
    await mockToken.transfer(user1.address, ethers.parseUnits("1000", 18));
    await mockToken.transfer(user2.address, ethers.parseUnits("1000", 18));

    // Add rewards to the pool
    await mockToken.transfer(await stakingPool.getAddress(), ethers.parseUnits("100000", 18));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await stakingPool.owner()).to.equal(owner.address);
    });

    it("Should set the correct staking token", async function () {
      expect(await stakingPool.stakingToken()).to.equal(await mockToken.getAddress());
    });

    it("Should set the correct reward rate", async function () {
      expect(await stakingPool.rewardRate()).to.equal(REWARD_RATE);
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      const stakeAmount = ethers.parseUnits("100", 18);
      
      // Approve tokens
      await mockToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      
      // Stake tokens
      await expect(stakingPool.connect(user1).stake(stakeAmount))
        .to.emit(stakingPool, "Staked")
        .withArgs(user1.address, stakeAmount);

      expect(await stakingPool.balanceOf(user1.address)).to.equal(stakeAmount);
      expect(await stakingPool.totalSupply()).to.equal(stakeAmount);
    });

    it("Should reject stakes below minimum", async function () {
      const stakeAmount = ethers.parseUnits("5", 18); // Below minimum
      
      await mockToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      
      await expect(stakingPool.connect(user1).stake(stakeAmount))
        .to.be.revertedWithCustomError(stakingPool, "AmountTooSmall");
    });

    it("Should reject zero amount stakes", async function () {
      await expect(stakingPool.connect(user1).stake(0))
        .to.be.revertedWithCustomError(stakingPool, "ZeroAmount");
    });
  });

  describe("Withdrawing", function () {
    beforeEach(async function () {
      const stakeAmount = ethers.parseUnits("100", 18);
      await mockToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      await stakingPool.connect(user1).stake(stakeAmount);
    });

    it("Should allow users to withdraw staked tokens", async function () {
      const withdrawAmount = ethers.parseUnits("50", 18);
      
      await expect(stakingPool.connect(user1).withdraw(withdrawAmount))
        .to.emit(stakingPool, "Withdrawn")
        .withArgs(user1.address, withdrawAmount);

      expect(await stakingPool.balanceOf(user1.address)).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should reject withdrawals exceeding balance", async function () {
      const withdrawAmount = ethers.parseUnits("200", 18);
      
      await expect(stakingPool.connect(user1).withdraw(withdrawAmount))
        .to.be.revertedWithCustomError(stakingPool, "InsufficientBalance");
    });
  });

  describe("Rewards", function () {
    it("Should calculate rewards correctly", async function () {
      const stakeAmount = ethers.parseUnits("100", 18);
      
      await mockToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      await stakingPool.connect(user1).stake(stakeAmount);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [86400]); // 1 day
      await ethers.provider.send("evm_mine");

      const earned = await stakingPool.earned(user1.address);
      expect(earned).to.be.gt(0);
    });

    it("Should allow users to claim rewards", async function () {
      const stakeAmount = ethers.parseUnits("100", 18);
      
      await mockToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      await stakingPool.connect(user1).stake(stakeAmount);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [86400]); // 1 day
      await ethers.provider.send("evm_mine");

      const initialBalance = await mockToken.balanceOf(user1.address);
      await stakingPool.connect(user1).getReward();
      const finalBalance = await mockToken.balanceOf(user1.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow emergency withdrawal", async function () {
      const stakeAmount = ethers.parseUnits("100", 18);
      
      await mockToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      await stakingPool.connect(user1).stake(stakeAmount);

      const initialBalance = await mockToken.balanceOf(user1.address);
      
      await expect(stakingPool.connect(user1).emergencyWithdraw())
        .to.emit(stakingPool, "EmergencyWithdraw")
        .withArgs(user1.address, stakeAmount);

      const finalBalance = await mockToken.balanceOf(user1.address);
      expect(finalBalance).to.equal(initialBalance + stakeAmount);
      expect(await stakingPool.balanceOf(user1.address)).to.equal(0);
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to set reward rate", async function () {
      const newRate = ethers.parseUnits("0.000005", 18);
      
      await expect(stakingPool.setRewardRate(newRate))
        .to.emit(stakingPool, "RewardRateUpdated")
        .withArgs(newRate);

      expect(await stakingPool.rewardRate()).to.equal(newRate);
    });

    it("Should allow owner to pause/unpause", async function () {
      await stakingPool.pause();
      
      const stakeAmount = ethers.parseUnits("100", 18);
      await mockToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
      
      await expect(stakingPool.connect(user1).stake(stakeAmount))
        .to.be.revertedWith("Pausable: paused");

      await stakingPool.unpause();
      
      await expect(stakingPool.connect(user1).stake(stakeAmount))
        .to.emit(stakingPool, "Staked");
    });
  });
});