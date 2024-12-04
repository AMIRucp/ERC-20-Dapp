const hre = require("hardhat");

async function main() {
  try {
    // Get the contract address from environment variable or replace with your contract address
    const contractAddress = "0xE77d4891a21E2B85Dc2b461C0a2fDdd668597960";
    
    // Get the contract factory and attach to the deployed contract
    const Token = await hre.ethers.getContractFactory("MyToken");
    const token = await Token.attach(contractAddress);
    
    // Get a signer (account) to check balance
    const [signer] = await hre.ethers.getSigners();
    console.log("Checking balance for address:", signer.address);
    
    // Check the balance
    const balance = await token.balanceOf(signer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "tokens");
    
    return balance;
  } catch (error) {
    console.error("Error checking balance:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
