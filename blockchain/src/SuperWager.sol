// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BettingPool is Ownable {
    IERC20 public usdt;
    IERC20 public stt;

    uint256 public poolStartTime;
    uint256 public poolDuration = 7 days;

    address[] public usdtPlayers;
    address[] public sttPlayers;

    mapping(address => bool) public hasEntered;

    uint256 public constant MIN_USDT = 1e6; // 1 USDT (6 decimals)
    uint256 public constant MIN_STT = 1e16; // 0.01 STT (18 decimals)

    event EnterPool(address indexed player, string token);
    event WinnersDeclared(address[] winners, string token);

    constructor(address _usdt, address _stt) {
        usdt = IERC20(_usdt);
        stt = IERC20(_stt);
        poolStartTime = block.timestamp;
    }

    function enterPoolWithUSDT() external {
        require(block.timestamp < poolStartTime + poolDuration, "Pool ended");
        require(!hasEntered[msg.sender], "Already entered");
        require(
            usdt.transferFrom(msg.sender, address(this), MIN_USDT),
            "Transfer failed"
        );

        usdtPlayers.push(msg.sender);
        hasEntered[msg.sender] = true;

        emit EnterPool(msg.sender, "USDT");
    }

    function enterPoolWithSTT() external {
        require(block.timestamp < poolStartTime + poolDuration, "Pool ended");
        require(!hasEntered[msg.sender], "Already entered");
        require(
            stt.transferFrom(msg.sender, address(this), MIN_STT),
            "Transfer failed"
        );

        sttPlayers.push(msg.sender);
        hasEntered[msg.sender] = true;

        emit EnterPool(msg.sender, "STT");
    }

    function pickWinners(string memory token) external onlyOwner {
        require(
            block.timestamp >= poolStartTime + poolDuration,
            "Pool ongoing"
        );

        address[] storage players = keccak256(abi.encodePacked(token)) ==
            keccak256("USDT")
            ? usdtPlayers
            : sttPlayers;

        require(players.length >= 10, "Not enough players");

        // Pick 10 pseudo-random winners (for demo/hackathon only)
        address;
        for (uint256 i = 0; i < 10; i++) {
            uint256 randIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % players.length;
            winners[i] = players[randIndex];
        }

        uint256 totalPool = keccak256(abi.encodePacked(token)) ==
            keccak256("USDT")
            ? usdt.balanceOf(address(this))
            : stt.balanceOf(address(this));

        uint256 rewardAmount = (totalPool * 92) / 100;
        uint256 ownerAmount = totalPool - rewardAmount;
        uint256 perWinner = rewardAmount / 10;

        for (uint256 i = 0; i < 10; i++) {
            if (keccak256(abi.encodePacked(token)) == keccak256("USDT")) {
                usdt.transfer(winners[i], perWinner);
            } else {
                stt.transfer(winners[i], perWinner);
            }
        }

        if (keccak256(abi.encodePacked(token)) == keccak256("USDT")) {
            usdt.transfer(owner(), ownerAmount);
            delete usdtPlayers;
        } else {
            stt.transfer(owner(), ownerAmount);
            delete sttPlayers;
        }

        poolStartTime = block.timestamp; // restart pool

        emit WinnersDeclared(winners, token);
    }
}
