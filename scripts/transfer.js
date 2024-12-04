const hre = require("hardhat");

async function main() {
  try {
    // Get the contract address from environment variable or replace with your contract address
    const contractAddress = "0xE77d4891a21E2B85Dc2b461C0a2fDdd668597960";
    
    // Amount to transfer (in ether units)
    const amountToTransfer = "0.5"; // 0.5 tokens
    
    // Address to transfer to (you can change this to any address)
    const recipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Replace with recipient address
    
    // Get the contract factory and attach to the deployed contract
    const Token = await hre.ethers.getContractFactory("MyToken");
    const token = await Token.attach(contractAddress);
    
    // Get a signer (account) to send the transaction
    const [signer] = await hre.ethers.getSigners();
    console.log("Transferring from address:", signer.address);
    
    // Check balance before transfer
    const balanceBefore = await token.balanceOf(signer.address);
    console.log("Balance before transfer:", hre.ethers.formatEther(balanceBefore), "tokens");
    
    // Convert amount to wei
    const amountInWei = hre.ethers.parseEther(amountToTransfer);
    
    // Transfer tokens
    console.log(`Transferring ${amountToTransfer} tokens to ${recipientAddress}...`);
    const transferTx = await token.transfer(recipientAddress, amountInWei);
    
    // Wait for transaction to be mined with 2 block confirmations
    await transferTx.wait(2);
    console.log("Transfer transaction hash:", transferTx.hash);
    
    // Check balances after transfer
    const balanceAfter = await token.balanceOf(signer.address);
    const recipientBalance = await token.balanceOf(recipientAddress);
    
    console.log("Sender balance after transfer:", hre.ethers.formatEther(balanceAfter), "tokens");
    console.log("Recipient balance after transfer:", hre.ethers.formatEther(recipientBalance), "tokens");
    
    return transferTx;
  } catch (error) {
    console.error("Error transferring tokens:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
