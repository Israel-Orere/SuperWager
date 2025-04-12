// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BettingPool is Ownable {
    uint256 public poolStartTime;
    uint256 public poolDuration = 7 days;

    address[] public players;
    mapping(address => bool) public hasEntered;

    uint256 public constant MIN_STT = 0.01 ether; // Native token equivalent

    event EnterPool(address indexed player);
    event WinnersDeclared(address[] winners);

    constructor() {
        poolStartTime = block.timestamp;
    }

    // Enter the pool by sending native STT
    function enterPool() external payable {
        require(block.timestamp < poolStartTime + poolDuration, "Pool ended");
        require(!hasEntered[msg.sender], "Already entered");
        require(msg.value >= MIN_STT, "Insufficient STT sent");

        players.push(msg.sender);
        hasEntered[msg.sender] = true;

        emit EnterPool(msg.sender);
    }

    // Only owner can pick winners and distribute the pool
    function pickWinners() external onlyOwner {
        require(
            block.timestamp >= poolStartTime + poolDuration,
            "Pool ongoing"
        );
        require(players.length >= 10, "Not enough players");

        address;

        for (uint256 i = 0; i < 10; i++) {
            uint256 randIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % players.length;
            winners[i] = players[randIndex];
        }

        uint256 totalPool = address(this).balance;
        uint256 rewardAmount = (totalPool * 92) / 100;
        uint256 ownerAmount = totalPool - rewardAmount;
        uint256 perWinner = rewardAmount / 10;

        for (uint256 i = 0; i < 10; i++) {
            payable(winners[i]).transfer(perWinner);
        }

        payable(owner()).transfer(ownerAmount);
        delete players;

        // Reset pool
        poolStartTime = block.timestamp;

        emit WinnersDeclared(winners);
    }

    // Allow fallback deposits (optional)
    receive() external payable {}
}
