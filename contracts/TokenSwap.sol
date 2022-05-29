// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSwap is Ownable {
    ERC20 public immutable token;
    mapping(address => uint256) public allocations;
    mapping(address => uint256) public claimed;
    uint256 public start;
    uint256 public vestingPeriod = 15552000; // 180 days
    bool public started;

    constructor(address _token) {
        token = ERC20(_token);
    }

    function setAllocations(
        address[] memory _users,
        uint256[] memory _allocations
    ) external onlyOwner {
        require(_users.length == _allocations.length, "!Length");
        for (uint256 i = 0; i < _users.length; i++) {
            allocations[_users[i]] = _allocations[i];
        }
    }

    function startSwap() external onlyOwner {
        require(!started, "Started");
        started = true;
        start = block.timestamp;
    }

    function claim() external {
        require(started, "!Started");
        uint256 _claimable = claimable(msg.sender);
        require(_claimable > 0, "Nothing to claim");
        claimed[msg.sender] += _claimable;
        token.transfer(msg.sender, _claimable);
    }

    function claimable(address _user) public view returns (uint256) {
        if (!started) return 0;
        if (block.timestamp - start > vestingPeriod)
            return allocations[_user] - claimed[_user];
        return
            (allocations[_user] * (block.timestamp - start)) /
            vestingPeriod -
            claimed[_user];
    }
}
