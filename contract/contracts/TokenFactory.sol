// contracts/TokenFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./FactoryToken.sol";

contract TokenFactory {
    address[] public deployedTokens;

    event TokenCreated(address tokenAddress, string name, string symbol);

    function createToken( string memory name, string memory symbol ) external returns (address) {
        FactoryToken token = new FactoryToken( name, symbol );
        deployedTokens.push(address(token));

        emit TokenCreated(address(token), name, symbol);
        return address(token);
    }

    function getAllTokens() external view returns (address[] memory) {
        return deployedTokens;
    }
}
