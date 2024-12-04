const hre = require("hardhat");

async function main() {
  try {
    // Get the contract address from environment variable or replace with your contract address
    const contractAddress = "0xE77d4891a21E2B85Dc2b461C0a2fDdd668597960";
    
    // Amount to mint (in ether units)
    const amountToMint = "1.0"; // 1 token
    
    // Address to mint to (you can change this to any address)
    const recipientAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with recipient address
    
    // Get the contract factory and attach to the deployed contract
    const Token = await hre.ethers.getContractFactory("MyToken");
    const token = await Token.attach(contractAddress);
    
    // Get a signer (account) to send the transaction
    const [signer] = await hre.ethers.getSigners();
    console.log("Minting from address:", signer.address);
    
    // Convert amount to wei
    const amountInWei = hre.ethers.parseEther(amountToMint);
    
    // Mint tokens
    console.log(`Minting ${amountToMint} tokens to ${recipientAddress}...`);
    const mintTx = await token.mint(recipientAddress, amountInWei);
    
    // Wait for transaction to be mined
    await mintTx.wait(2);
    console.log("Mint transaction hash:", mintTx.hash);
    
    // Check the balance after minting
    const balance = await token.balanceOf(recipientAddress);
    console.log("New balance:", hre.ethers.formatEther(balance), "tokens");
    
    return mintTx;
  } catch (error) {
    console.error("Error minting tokens:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
