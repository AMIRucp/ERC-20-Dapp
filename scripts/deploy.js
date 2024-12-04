// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  try {
    // Get the contract factory
    const MyToken = await hre.ethers.getContractFactory("MyToken");

    // Get the deployer's address
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the contract with the deployer's address as initialOwner
    const myToken = await MyToken.deploy(deployer.address);
    
    // Wait for deployment
    await myToken.waitForDeployment();
    
    const tokenAddress = await myToken.getAddress();
    console.log("Token deployed to:", tokenAddress);

    // Wait for block confirmations
    console.log("Waiting for block confirmations...");
    await myToken.deploymentTransaction().wait(5);

    // Mint initial tokens (1 million tokens)
    const initialMintAmount = hre.ethers.parseEther("1000000");
    console.log("Minting initial tokens...");
    const mintTx = await myToken.mint(deployer.address, initialMintAmount);
    await mintTx.wait(2);
    console.log(`Minted ${hre.ethers.formatEther(initialMintAmount)} tokens to ${deployer.address}`);

    // Verify the contract on Etherscan
    
    // Print token information
    console.log("\nToken Information:");
    console.log("Name:", await myToken.name());
    console.log("Symbol:", await myToken.symbol());
    console.log("Decimals:", await myToken.decimals());
    console.log("Owner:", await myToken.owner());
   
  } catch (error) {
    console.error("Error in deployment:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });