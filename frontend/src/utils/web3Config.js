import { ethers } from 'ethers';

const contractAddress = "0xE77d4891a21E2B85Dc2b461C0a2fDdd668597960";

const contractABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "function mint(address to, uint256 amount)",
    "function getBalance(address account) view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

const SEPOLIA_CHAIN_ID = '0xaa36a7';

export const getWeb3Provider = async () => {
    if (!window.ethereum) {
        throw new Error("MetaMask not found! Please install MetaMask.");
    }

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
    } catch (switchError) {
        // This error code means the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: SEPOLIA_CHAIN_ID,
                    chainName: 'Sepolia Testnet',
                    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://sepolia.infura.io/v3/'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                }]
            });
        }
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.providers.Web3Provider(window.ethereum);
};

export const getContract = (provider) => {
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
};

export { contractAddress, contractABI };
