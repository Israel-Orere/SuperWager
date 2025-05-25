// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SomniaPrizePool is ReentrancyGuard {
    using Counters for Counters.Counter;

    // Pool parameters
    uint256 public constant MIN_DEPOSIT = 0.01 ether; // 0.01 STT
    uint256 public constant DURATION = 2 seconds;
    uint256 public constant WINNER_COUNT = 10;
    uint256 public constant FEE_PERCENTAGE = 8; // 8% fee

    // Pool state
    address public owner;
    uint256 public poolStartTime;
    bool public poolActive;
    bool public winnersSelected;

    // Player tracking
    Counters.Counter private playerCount;
    mapping(address => bool) public hasEntered;
    address[] public players;
    address[] public winners;

    // Events
    event PoolEntered(address indexed player, uint256 amount);
    event WinnersSelected(address[] winners);
    event PrizeDistributed(address indexed winner, uint256 amount);
    event FeeCollected(uint256 amount);

    constructor() {
        owner = msg.sender;
        poolActive = false;
        winnersSelected = false;
    }

    // Start a new pool
    function startPool() external onlyOwner {
        require(!poolActive, "Pool is already active");
        poolStartTime = block.timestamp;
        poolActive = true;
        winnersSelected = false;
    }

    // Enter the pool by depositing STT
    function enterPool(uint256 amount) external payable nonReentrant {
        require(poolActive, "Pool is not active");
        require(
            block.timestamp < poolStartTime + DURATION,
            "Pool duration has ended"
        );
        require(msg.value >= MIN_DEPOSIT, "Deposit must be at least 0.01 STT");
        require(!hasEntered[msg.sender], "Already entered this pool");

        amount = msg.value;

        hasEntered[msg.sender] = true;
        players.push(msg.sender);
        playerCount.increment();

        emit PoolEntered(msg.sender, msg.value);
    }

    // Select winners randomly (callable after pool ends)
    function selectWinners() external onlyOwner {
        require(poolActive, "Pool is not active");
        require(
            block.timestamp >= poolStartTime + DURATION,
            "Pool duration not ended"
        );
        require(!winnersSelected, "Winners already selected");
        require(
            playerCount.current() >= WINNER_COUNT,
            "Not enough participants"
        );

        // Use blockhash for pseudo-randomness (for MVP only - not production secure)
        bytes32 randomSeed = blockhash(block.number - 1);

        // Select winners
        for (uint256 i = 0; i < WINNER_COUNT; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(randomSeed, i))
            ) % players.length;
            address winner = players[randomIndex];

            // Ensure no duplicate winners
            bool alreadyWinner;
            for (uint256 j = 0; j < winners.length; j++) {
                if (winners[j] == winner) {
                    alreadyWinner = true;
                    break;
                }
            }

            if (!alreadyWinner) {
                winners.push(winner);
            } else {
                i--; // Try again for this slot
            }
        }

        winnersSelected = true;
        emit WinnersSelected(winners);
    }

    // Distribute prizes to winners (92% of pool)
    function distributePrizes() external onlyOwner nonReentrant {
        require(winnersSelected, "Winners not selected yet");
        require(!poolActive, "Pool is still active");

        uint256 totalPool = address(this).balance;
        require(totalPool > 0, "No funds in pool");

        // Calculate amounts
        uint256 feeAmount = (totalPool * FEE_PERCENTAGE) / 100;
        uint256 prizePool = totalPool - feeAmount;
        uint256 prizePerWinner = prizePool / WINNER_COUNT;

        // Send prizes
        for (uint256 i = 0; i < winners.length; i++) {
            (bool success, ) = winners[i].call{value: prizePerWinner}("");
            require(success, "Transfer failed");
            emit PrizeDistributed(winners[i], prizePerWinner);
        }

        // Keep the fee (8%)
        (bool feeSuccess, ) = owner.call{value: feeAmount}("");
        require(feeSuccess, "Fee transfer failed");
        emit FeeCollected(feeAmount);

        // Reset pool for next round
        _resetPool();
    }

    // Reset pool state
    function _resetPool() private {
        for (uint256 i = 0; i < players.length; i++) {
            hasEntered[players[i]] = false;
        }
        delete players;
        delete winners;
        playerCount.reset();
        poolActive = false;
    }

    // Get current pool balance
    function getPoolBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Get player count
    function getPlayerCount() public view returns (uint256) {
        return playerCount.current();
    }

    // Modifier for owner-only functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Allow contract to receive STT (fallback)
    receive() external payable {}
}
