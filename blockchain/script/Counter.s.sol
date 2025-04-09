// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {BallotVoting} from "../src/BallotVoting.sol";

contract CounterScript is Script {
    BallotVoting public ballotVoting;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        ballotVoting = new BallotVoting();

        vm.stopBroadcast();
    }
}
