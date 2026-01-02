// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;

    uint256 public totalStaked;
    uint256 public rewardRate; // rewards per second

    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userBalance;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

   

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

   

    constructor(address _stakingToken) Ownable(msg.sender) {
        require(_stakingToken != address(0), "Invalid token");
        stakingToken = IERC20(_stakingToken);
    }

   

    function stake(uint256 amount) external nonReentrant {

    require(amount > 0, "Cannot stake zero");

    _updateReward(msg.sender);

    userBalance[msg.sender] += amount;
    totalStaked += amount;

    stakingToken.safeTransferFrom(
        msg.sender,
        address(this),
        amount
    );

    emit Staked(msg.sender, amount);
}


    function withdraw(uint256 amount) external nonReentrant {
    require(amount > 0, "Cannot withdraw zero");
    require(userBalance[msg.sender] >= amount, "Insufficient balance");

    _updateReward(msg.sender);

    userBalance[msg.sender] -= amount;
    totalStaked -= amount;

    stakingToken.safeTransfer(msg.sender, amount);

    emit Withdrawn(msg.sender, amount);
}


    function claimRewards() external nonReentrant {
    _updateReward(msg.sender);

    uint256 reward = rewards[msg.sender];
    require(reward > 0, "No rewards");

    rewards[msg.sender] = 0;

    stakingToken.safeTransfer(msg.sender, reward);

    emit RewardClaimed(msg.sender, reward);
}




    function earned(address user) public view returns (uint256) {
    uint256 perTokenDelta =
        rewardPerToken() - userRewardPerTokenPaid[user];

    uint256 newlyEarned =
        (userBalance[user] * perTokenDelta) / 1e18;

    return rewards[user] + newlyEarned;
}


    function rewardPerToken() public view returns (uint256) {
    if (totalStaked == 0) {
        return rewardPerTokenStored;
    }

    uint256 timeElapsed = block.timestamp - lastUpdateTime;

    return
        rewardPerTokenStored +
        ((timeElapsed * rewardRate * 1e18) / totalStaked);
}



    function _updateReward(address user) internal {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;

    if (user != address(0)) {
        rewards[user] = earned(user);
        userRewardPerTokenPaid[user] = rewardPerTokenStored;
    }
}



    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }
}
