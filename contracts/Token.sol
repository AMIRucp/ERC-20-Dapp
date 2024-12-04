// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Main token contract inheriting from OpenZeppelin contracts
contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
   string private _tokenURI;

   // Sets up token with name "Innovatives Tech" and symbol "IT"
   constructor(address initialOwner)
       ERC20("Innovatives Tech", "IT")
       Ownable(initialOwner)
       ERC20Permit("Innovatives Tech")
   {}

   // Allows owner to pause all token transfers
   function pause() public onlyOwner {
       _pause();
   }

   // Allows owner to unpause all token transfers
   function unpause() public onlyOwner {
       _unpause();
   }

   // Allows owner to create new tokens
   function mint(address to, uint256 amount) public onlyOwner {
       _mint(to, amount);
   }

   // Transfer tokens with basic security checks
   function transferTokens(address to, uint256 amount) public returns (bool) {
       require(to != address(0), "Cannot transfer to zero address");
       require(amount > 0, "Amount must be greater than zero");
       return transfer(to, amount);
   }

   // Get token balance of an address
   function getBalance(address account) public view returns (uint256) {
       return balanceOf(account);
   }

   // Set token metadata URI
   function setTokenURI(string memory uri) public onlyOwner {
       _tokenURI = uri;
   }

   // Get token metadata URI
   function tokenURI() public view returns (string memory) {
       return _tokenURI;
   }

   // Required override for ERC20Pausable
   function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Pausable) {
       super._update(from, to, value);
   }
}
