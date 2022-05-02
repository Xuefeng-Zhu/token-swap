// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSwap {
    ERC20 public immutable token;
    mapping(address => uint) public allocations;
    mapping(address => uint) public claimed;
    uint public start;
    uint public vestingPeriod = 15552000; // 180 days
    bool public started;
    address private creator;

    constructor(address[] memory _users, uint[] memory _allocations, address _token) {
        require(_users.length == _allocations.length, "!Length");
        for (uint i=0; i<_users.length; i++) {
            allocations[_users[i]] = _allocations[i];
        }
        creator = msg.sender;
        token = ERC20(_token);
    }

    function startSwap() external {
        require(msg.sender == creator, "!Creator");
        require(!started, "Started");
        started = true;
        start = block.timestamp;
    }

    function claim() external {
        require(started, "!Started");
        uint _claimable = claimable(msg.sender);
        require(_claimable > 0, "Nothing to claim");
        claimed[msg.sender] += _claimable;
        token.transfer(msg.sender, _claimable);
    }

    function claimable(address _user) public view returns (uint) {
        if (!started) return 0;
        if (block.timestamp-start > vestingPeriod) return allocations[_user] - claimed[_user];
        return allocations[_user]*(block.timestamp-start)/vestingPeriod - claimed[_user];
    }
}
