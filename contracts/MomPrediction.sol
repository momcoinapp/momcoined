// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MomPrediction
 * @dev A simple prediction game where users bet MOM tokens on whether the price
 * of a target asset (e.g. Clanker) will go UP or DOWN after a set duration.
 */
contract MomPrediction is Ownable, ReentrancyGuard {
    IERC20 public momToken;
    
    uint256 public currentRoundId;
    uint256 public roundDuration = 8 hours;
    bool public isPaused;
    
    struct Round {
        uint256 id;
        uint256 startTime;
        uint256 lockPrice;
        uint256 closePrice;
        uint256 totalAmount;
        uint256 upAmount;
        uint256 downAmount;
        bool resolved;
        bool cancelled;
    }
    
    struct BetInfo {
        uint256 amount;
        bool isUp; // true = UP, false = DOWN
        bool claimed;
    }

    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => BetInfo)) public bets;
    
    event BetPlaced(address indexed user, uint256 amount, bool isUp, uint256 roundId);
    event RoundStarted(uint256 roundId, uint256 startTime, uint256 lockPrice);
    event RoundResolved(uint256 roundId, uint256 closePrice, bool upWon);
    event WinningsClaimed(address indexed user, uint256 amount);
    event RoundCancelled(uint256 roundId);

    constructor(address _momToken) Ownable(msg.sender) {
        momToken = IERC20(_momToken);
    }

    // --- Admin Functions ---

    function startRound(uint256 _lockPrice) external onlyOwner {
        require(!isPaused, "Game paused");
        
        // If previous round exists, ensure it's resolved or cancelled
        if (currentRoundId > 0) {
            require(rounds[currentRoundId].resolved || rounds[currentRoundId].cancelled, "Prev round active");
        }

        currentRoundId++;
        Round storage round = rounds[currentRoundId];
        round.id = currentRoundId;
        round.startTime = block.timestamp;
        round.lockPrice = _lockPrice;
        
        emit RoundStarted(currentRoundId, block.timestamp, _lockPrice);
    }

    function resolveRound(uint256 _closePrice) external onlyOwner {
        Round storage round = rounds[currentRoundId];
        require(!round.resolved && !round.cancelled, "Round not active");
        require(block.timestamp >= round.startTime + roundDuration, "Round not over");

        round.closePrice = _closePrice;
        round.resolved = true;

        bool upWon = _closePrice > round.lockPrice;
        emit RoundResolved(currentRoundId, _closePrice, upWon);
    }

    function cancelRound() external onlyOwner {
        Round storage round = rounds[currentRoundId];
        require(!round.resolved && !round.cancelled, "Cannot cancel");
        round.cancelled = true;
        emit RoundCancelled(currentRoundId);
    }

    function setPaused(bool _paused) external onlyOwner {
        isPaused = _paused;
    }

    function setDuration(uint256 _hours) external onlyOwner {
        roundDuration = _hours * 1 hours;
    }

    // --- User Functions ---

    function placeBet(bool _isUp, uint256 _amount) external nonReentrant {
        require(!isPaused, "Paused");
        require(_amount > 0, "Bet > 0");
        
        Round storage round = rounds[currentRoundId];
        require(!round.resolved && !round.cancelled, "Round not active");
        // Stop bets 1 hour before close? Or allow until end? Let's allow until end for simplicity or add buffer.
        
        require(momToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        BetInfo storage bet = bets[currentRoundId][msg.sender];
        
        // If user already bet, add to it (must be same direction for simplicity)
        if (bet.amount > 0) {
            require(bet.isUp == _isUp, "Cannot switch sides");
        } else {
            bet.isUp = _isUp;
        }
        
        bet.amount += _amount;
        round.totalAmount += _amount;
        
        if (_isUp) {
            round.upAmount += _amount;
        } else {
            round.downAmount += _amount;
        }

        emit BetPlaced(msg.sender, _amount, _isUp, currentRoundId);
    }

    function claim(uint256 _roundId) external nonReentrant {
        Round storage round = rounds[_roundId];
        BetInfo storage bet = bets[_roundId][msg.sender];
        
        require(bet.amount > 0, "No bet");
        require(!bet.claimed, "Already claimed");
        
        uint256 payout = 0;

        // 1. Round Cancelled -> Refund
        if (round.cancelled) {
            payout = bet.amount;
        }
        // 2. Round Resolved
        else if (round.resolved) {
            bool upWon = round.closePrice > round.lockPrice;
            
            // If user picked winner
            if (bet.isUp == upWon) {
                uint256 pool = upWon ? round.upAmount : round.downAmount;
                uint256 totalPool = round.totalAmount;
                
                // Share = (UserBet / WinningPool) * TotalPool
                // Example: Bet 10 on UP. UP pool 100. Total pool 200.
                // Share = (10 / 100) * 200 = 20. Double money.
                payout = (bet.amount * totalPool) / pool;
            }
        } else {
            revert("Round pending");
        }

        require(payout > 0, "Nothing to claim");
        
        bet.claimed = true;
        require(momToken.transfer(msg.sender, payout), "Transfer failed");
        
        emit WinningsClaimed(msg.sender, payout);
    }
}
