// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/// @notice Local proof-of-concept. Issuer trust does not prove meter truth or REC eligibility.
contract EnergyRegistry {
    address public immutable issuer;
    mapping(bytes32 => bool) public occupied;
    mapping(bytes32 => bool) public evidence;
    event Anchored(bytes32 indexed digest, uint256 intervals, uint256 wattHours);
    constructor() { issuer = msg.sender; }
    function anchor(bytes32 digest, bytes32[] calldata slots, uint256 wattHours) external {
        require(msg.sender == issuer, "issuer only");
        require(!evidence[digest], "evidence already anchored");
        require(slots.length > 0 && slots.length <= 168, "invalid interval count");
        for (uint256 i = 0; i < slots.length; i++) {
            require(!occupied[slots[i]], "interval already claimed");
            occupied[slots[i]] = true;
        }
        evidence[digest] = true;
        emit Anchored(digest, slots.length, wattHours);
    }
}
