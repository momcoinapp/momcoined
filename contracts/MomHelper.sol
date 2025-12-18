// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract MomHelper is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    IERC20 public momToken;
    address public signerWallet; // Backend wallet that signs claims
    
    // Daily Claim
    mapping(address => uint256) public lastClaimTime;
    uint256 public constant CLAIM_AMOUNT = 10 * 10**18; // 10 MOM (Updated)
    uint256 public constant CLAIM_COOLDOWN = 1 days;

    // Points Conversion
    mapping(address => uint256) public nonces; // Prevent replay attacks

    // Staking
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingStartTime;
    uint256 public totalStaked;

    event Claimed(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount, uint256 nonce);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event SignerUpdated(address newSigner);

    constructor(address _momToken, address _signer) Ownable(msg.sender) {
        momToken = IERC20(_momToken);
        signerWallet = _signer;
    }

    function setSigner(address _signer) external onlyOwner {
        signerWallet = _signer;
        emit SignerUpdated(_signer);
    }

    // 1. Daily Faucet (No points needed, just time)
    function claimDaily() external nonReentrant {
        require(block.timestamp >= lastClaimTime[msg.sender] + CLAIM_COOLDOWN, "Cooldown active");
        
        lastClaimTime[msg.sender] = block.timestamp;
        require(momToken.transfer(msg.sender, CLAIM_AMOUNT), "Transfer failed");
        
        emit Claimed(msg.sender, CLAIM_AMOUNT);
    }

    // 2. Convert Points to MOM (Requires Backend Signature)
    function claimRewards(uint256 amount, bytes calldata signature) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        // Verify Signature: keccak256(user, amount, nonce)
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, amount, nonces[msg.sender]));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        
        require(recoveredSigner == signerWallet, "Invalid signature");
        
        // Increment nonce to prevent replay
        nonces[msg.sender]++;
        
        require(momToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit RewardsClaimed(msg.sender, amount, nonces[msg.sender] - 1);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(momToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        stakedBalance[msg.sender] += amount;
        stakingStartTime[msg.sender] = block.timestamp;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient balance");

        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        require(momToken.transfer(msg.sender, amount), "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    // Admin function to withdraw tokens if needed (e.g. migration)
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(momToken.transfer(msg.sender, amount), "Transfer failed");
    }
}
