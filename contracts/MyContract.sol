// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract MyContract {
    address public owner;
    uint public storedData;

    event DataStored(uint newData);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function set(uint data) public onlyOwner {
        storedData = data;
        emit DataStored(data);
    }

    function get() public view returns (uint) {
        return storedData;
    }
}