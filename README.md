# MyToken Smart Contract

This smart contract implements an ERC-20 token with additional features such as burning, pausing transfers, minting new tokens, and setting a token URI. It inherits from OpenZeppelin’s ERC-20, ERC-20Burnable, ERC-20Pausable, ERC-20Permit, and Ownable contracts.




<img width="1665" alt="image" src="https://github.com/user-attachments/assets/73848f8f-2bdd-4111-b69e-21da1c8deee4">




Try running some of the following tasks:
 To Build the smart contract
```shell
npx hardhat compile

```

To Deploy the smart contract
```shell

npx hardhat run scripts/deploy.js --network <network-name>

```
Testing the smart contract 

```shell

npx hardhat run scripts/checkbalance.js --network <network-name>

npx hardhat run scripts/mint.js --network <network-name>

npx hardhat run scripts/transfer.js --network <network-name>
```
# Deploy the FrontEnd

```shell

git clone https://github.com/AMIRucp/ERC-20-Dapp.git

cd frontend

npm install

npm start 
```

# How to Use the ERC-20 DApp

Connect Your Wallet (MetaMask):

Open your browser and ensure you have the MetaMask extension installed.
Click the "Connect Wallet" button on the DApp interface and select MetaMask.
Approve the connection in your MetaMask wallet.
1) Check Your Token Balance:

Once your wallet is connected, you can view your ERC-20 token balance.
The balance will be displayed on the DApp interface.

2) Mint New Tokens (Owner Only):

Only the contract owner can mint new tokens.
If you're the owner, you can mint new tokens to another address by entering the recipient's wallet address and the amount of tokens to mint.
Click the "Mint" button to mint the tokens.

3) Transfer Tokens to Another Address:

You can transfer your tokens to any valid Ethereum address.
Enter the recipient’s address and the amount of tokens to transfer, then click the "Transfer" button.
Confirm the transaction in MetaMask
