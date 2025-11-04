// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title StakingPool
 * @dev A staking pool contract that allows users to stake tokens and earn rewards
 */
contract StakingPool is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // State variables
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;
    
    uint256 public rewardRate; // Rewards per second
    uint256 public lockDuration; // Lock period in seconds
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalSupply;
    uint256 public minStakeAmount;
    uint256 public maxStakeAmount;
    
    // Fee structure (in basis points, 100 = 1%)
    uint256 public entryFee;
    uint256 public exitFee;
    uint256 public performanceFee;
    
    // User data
    mapping(address => uint256) public balances;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public unlockTime;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    event FeesUpdated(uint256 entryFee, uint256 exitFee, uint256 performanceFee);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    // Errors
    error InsufficientBalance();
    error StillLocked();
    error AmountTooSmall();
    error AmountTooLarge();
    error ZeroAmount();
    error TransferFailed();

    /**
     * @dev Constructor
     * @param _stakingToken Address of the token to be staked
     * @param _rewardToken Address of the reward token
     * @param _rewardRate Initial reward rate per second
     * @param _lockDuration Lock period in seconds
     * @param _minStakeAmount Minimum stake amount
     * @param _maxStakeAmount Maximum stake amount (0 for no limit)
     */
    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate,
        uint256 _lockDuration,
        uint256 _minStakeAmount,
        uint256 _maxStakeAmount
    ) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
        lockDuration = _lockDuration;
        minStakeAmount = _minStakeAmount;
        maxStakeAmount = _maxStakeAmount;
        lastUpdateTime = block.timestamp;
    }

    // Modifiers
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    // View functions
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + 
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalSupply);
    }

    function earned(address account) public view returns (uint256) {
        return (balances[account] * 
            (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18 + 
            rewards[account];
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function isLocked(address account) external view returns (bool) {
        return block.timestamp < unlockTime[account];
    }

    function timeUntilUnlock(address account) external view returns (uint256) {
        if (block.timestamp >= unlockTime[account]) {
            return 0;
        }
        return unlockTime[account] - block.timestamp;
    }

    // Main functions
    function stake(uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        updateReward(msg.sender) 
    {
        if (amount == 0) revert ZeroAmount();
        if (amount < minStakeAmount) revert AmountTooSmall();
        if (maxStakeAmount > 0 && amount > maxStakeAmount) revert AmountTooLarge();

        // Calculate entry fee
        uint256 fee = (amount * entryFee) / 10000;
        uint256 stakeAmount = amount - fee;

        // Update state
        totalSupply += stakeAmount;
        balances[msg.sender] += stakeAmount;
        unlockTime[msg.sender] = block.timestamp + lockDuration;

        // Transfer tokens
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Transfer fee to owner if applicable
        if (fee > 0) {
            stakingToken.safeTransfer(owner(), fee);
        }

        emit Staked(msg.sender, stakeAmount);
    }

    function withdraw(uint256 amount) 
        external 
        nonReentrant 
        updateReward(msg.sender) 
    {
        if (amount == 0) revert ZeroAmount();
        if (amount > balances[msg.sender]) revert InsufficientBalance();
        if (block.timestamp < unlockTime[msg.sender]) revert StillLocked();

        // Calculate exit fee
        uint256 fee = (amount * exitFee) / 10000;
        uint256 withdrawAmount = amount - fee;

        // Update state
        totalSupply -= amount;
        balances[msg.sender] -= amount;

        // Transfer tokens
        stakingToken.safeTransfer(msg.sender, withdrawAmount);
        
        // Transfer fee to owner if applicable
        if (fee > 0) {
            stakingToken.safeTransfer(owner(), fee);
        }

        emit Withdrawn(msg.sender, amount);
    }

    function getReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            
            // Calculate performance fee
            uint256 fee = (reward * performanceFee) / 10000;
            uint256 userReward = reward - fee;
            
            // Transfer rewards
            rewardToken.safeTransfer(msg.sender, userReward);
            
            // Transfer fee to owner if applicable
            if (fee > 0) {
                rewardToken.safeTransfer(owner(), fee);
            }
            
            emit RewardPaid(msg.sender, userReward);
        }
    }

    function exit() external {
        uint256 amount = balances[msg.sender];
        if (amount > 0) {
            this.withdraw(amount);
        }
        if (rewards[msg.sender] > 0) {
            this.getReward();
        }
    }

    // Emergency function - allows withdrawal even when locked (for emergencies only)
    function emergencyWithdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        if (amount == 0) revert ZeroAmount();

        totalSupply -= amount;
        balances[msg.sender] = 0;
        rewards[msg.sender] = 0; // Forfeit rewards in emergency

        stakingToken.safeTransfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, amount);
    }

    // Owner functions
    function setRewardRate(uint256 _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }

    function setFees(
        uint256 _entryFee,
        uint256 _exitFee,
        uint256 _performanceFee
    ) external onlyOwner {
        require(_entryFee <= 1000, "Entry fee too high"); // Max 10%
        require(_exitFee <= 1000, "Exit fee too high"); // Max 10%
        require(_performanceFee <= 2000, "Performance fee too high"); // Max 20%
        
        entryFee = _entryFee;
        exitFee = _exitFee;
        performanceFee = _performanceFee;
        
        emit FeesUpdated(_entryFee, _exitFee, _performanceFee);
    }

    function setStakeLimits(uint256 _minStakeAmount, uint256 _maxStakeAmount) external onlyOwner {
        minStakeAmount = _minStakeAmount;
        maxStakeAmount = _maxStakeAmount;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency function to recover tokens sent by mistake
    function recoverToken(address token, uint256 amount) external onlyOwner {
        require(token != address(stakingToken), "Cannot recover staking token");
        IERC20(token).safeTransfer(owner(), amount);
    }

    // Function to add rewards to the pool
    function addRewards(uint256 amount) external onlyOwner {
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
    }
}