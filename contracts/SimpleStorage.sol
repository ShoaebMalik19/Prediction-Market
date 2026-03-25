// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleStorage - A basic key-value store contract
/// @notice Demonstrates state variables, events, and access control on Shardeum
contract SimpleStorage {
    uint256 public value;
    address public owner;

    event ValueUpdated(address indexed updatedBy, uint256 oldValue, uint256 newValue);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "SimpleStorage: caller is not the owner");
        _;
    }

    constructor(uint256 _initialValue) {
        value = _initialValue;
        owner = msg.sender;
        emit ValueUpdated(msg.sender, 0, _initialValue);
    }

    /// @notice Update the stored value (owner only)
    function setValue(uint256 _newValue) external onlyOwner {
        uint256 old = value;
        value = _newValue;
        emit ValueUpdated(msg.sender, old, _newValue);
    }

    /// @notice Transfer ownership to a new address
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "SimpleStorage: new owner is zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}
