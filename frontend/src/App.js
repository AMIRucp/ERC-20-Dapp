import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Spinner,
  Container,
  Flex,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  keyframes,
  Badge,
  HStack,
  Tooltip,
  Icon,
  Divider,
  List,
  ListItem,
  ScaleFade,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { getWeb3Provider, getContract } from './utils/web3Config';
import { ethers } from 'ethers';
import { FaEthereum, FaHistory, FaWallet, FaExchangeAlt, FaPlus, FaChartLine, FaNetworkWired, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { BiNetworkChart } from 'react-icons/bi';

// Animation keyframes
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  
  // Separate states for each card
  const [checkBalanceAddress, setCheckBalanceAddress] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  
  // Separate amount states
  const [mintAmount, setMintAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  
  // Separate loading states
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const toast = useToast();

  // Add new states for transaction history and network
  const [transactions, setTransactions] = useState([]);
  const [network, setNetwork] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('sepolia');
  const [tokenPrice, setTokenPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Enhanced color mode values
  const bgGradient = useColorModeValue(
    'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    'linear-gradient(-45deg, #2d3748, #1a202c, #2c5282, #2a4365)'
  );

  const cardBg = useColorModeValue(
    'rgba(255, 255, 255, 0.95)',
    'rgba(26, 32, 44, 0.95)'
  );

  const buttonBgGradient = useColorModeValue(
    'linear-gradient(to right, #00b4db, #0083b0)',
    'linear-gradient(to right, #4a90e2, #357abd)'
  );

  const transactionItemBg = useColorModeValue('gray.50', 'gray.700');

  // Function to add transaction to history
  const addTransaction = (type, amount, address) => {
    const newTx = {
      type,
      amount,
      address,
      timestamp: new Date().toLocaleString(),
    };
    setTransactions([newTx, ...transactions.slice(0, 9)]); // Keep last 10 transactions
  };

  // Enhanced connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const web3Provider = await getWeb3Provider();
      const accounts = await web3Provider.listAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No authorized account found');
      }

      const network = await web3Provider.getNetwork();
      setNetwork(network.name);

      const tokenContract = getContract(web3Provider);
      setAccount(accounts[0]);
      setProvider(web3Provider);
      setContract(tokenContract);

      toast({
        title: 'Connected!',
        description: `Connected to ${network.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Connection Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsConnecting(false);
  };

  // Enhanced check balance function
  const checkBalance = async () => {
    if (!checkBalanceAddress) {
      toast({
        title: 'Error',
        description: 'Please enter an address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCheckingBalance(true);
    try {
      const balance = await contract.balanceOf(checkBalanceAddress);
      setBalance(ethers.utils.formatEther(balance));
      addTransaction('check', null, checkBalanceAddress);
      toast({
        title: 'Success',
        description: `Balance retrieved successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error checking balance:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsCheckingBalance(false);
  };

  // Enhanced mint function with animation
  const mintTokens = async () => {
    if (!mintAddress || !mintAmount) {
      toast({
        title: 'Error',
        description: 'Please enter both address and amount',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsMinting(true);
    try {
      const tx = await contract.mint(mintAddress, ethers.utils.parseEther(mintAmount));
      await tx.wait();
      addTransaction('mint', mintAmount, mintAddress);
      toast({
        title: 'Success',
        description: `Successfully minted ${mintAmount} tokens to ${mintAddress}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setMintAddress('');
      setMintAmount('');
    } catch (error) {
      console.error('Error minting tokens:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsMinting(false);
  };

  const transferTokens = async () => {
    if (!transferAddress || !transferAmount) {
      toast({
        title: 'Error',
        description: 'Please enter both address and amount',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsTransferring(true);
    try {
      const tx = await contract.transfer(transferAddress, ethers.utils.parseEther(transferAmount));
      await tx.wait();
      addTransaction('transfer', transferAmount, transferAddress);
      toast({
        title: 'Success',
        description: `Successfully transferred ${transferAmount} tokens to ${transferAddress}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTransferAddress('');
      setTransferAmount('');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsTransferring(false);
  };

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        bgGradient={bgGradient}
        backgroundSize="400% 400%"
        animation={`${gradientAnimation} 15s ease infinite`}
        p={4}
      >
        <Container maxW="container.xl">
          <VStack spacing={8}>
            {/* Header */}
            <Flex
              w="full"
              justify="space-between"
              align="center"
              p={4}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="xl"
              backdropFilter="blur(10px)"
            >
              <Heading size="lg">IT Token Dashboard</Heading>
              <HStack spacing={4}>
                {network && (
                  <Tooltip label={`Connected to ${network}`}>
                    <Badge colorScheme="green">
                      <HStack>
                        <Icon as={BiNetworkChart} />
                        <Text>{network}</Text>
                      </HStack>
                    </Badge>
                  </Tooltip>
                )}
                <Button
                  onClick={connectWallet}
                  isLoading={isConnecting}
                  loadingText="Connecting..."
                  bgGradient={buttonBgGradient}
                  color="white"
                  _hover={{
                    opacity: 0.9,
                  }}
                  leftIcon={<FaWallet />}
                >
                  {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                </Button>
                <Tooltip label="View Transaction History">
                  <Button
                    onClick={onOpen}
                    variant="ghost"
                    leftIcon={<FaHistory />}
                  >
                    History
                  </Button>
                </Tooltip>
              </HStack>
            </Flex>

            {/* Token Price and Network */}
            <Box
              w="full"
              p={6}
              mb={8}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="xl"
              backdropFilter="blur(10px)"
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {/* Token Price Card */}
                <Stat>
                  <StatLabel>Token Price</StatLabel>
                  <StatNumber fontSize="3xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                    $1.23
                  </StatNumber>
                  <StatHelpText color={priceChange >= 0 ? "green.500" : "red.500"}>
                    <Icon as={priceChange >= 0 ? FaArrowUp : FaArrowDown} mr={1} />
                    {Math.abs(priceChange || 0)}%
                  </StatHelpText>
                </Stat>

                {/* Network Selector */}
                <Box>
                  <Text mb={2} fontSize="sm" color="gray.500">Current Network</Text>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaNetworkWired />}
                      w="full"
                      variant="outline"
                      colorScheme="blue"
                    >
                      {network || 'Select Network'}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSelectedNetwork('sepolia')}>Sepolia Testnet</MenuItem>
                      <MenuItem onClick={() => setSelectedNetwork('goerli')}>Goerli Testnet</MenuItem>
                      <MenuItem onClick={() => setSelectedNetwork('mainnet')}>Ethereum Mainnet</MenuItem>
                    </MenuList>
                  </Menu>
                </Box>

                {/* Quick Actions */}
                <SimpleGrid columns={2} spacing={4}>
                  <Button
                    leftIcon={<FaChartLine />}
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => {/* Add chart view action */}}
                  >
                    View Charts
                  </Button>
                  <Button
                    leftIcon={<FaHistory />}
                    colorScheme="purple"
                    variant="outline"
                    onClick={onOpen}
                  >
                    History
                  </Button>
                </SimpleGrid>
              </SimpleGrid>
            </Box>

            {/* Main Content */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {/* Check Balance Card */}
              <ScaleFade in={true}>
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="xl"
                  backdropFilter="blur(10px)"
                  transition="transform 0.3s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <VStack spacing={4}>
                    <Icon as={FaEthereum} boxSize={8} color="blue.500" />
                    <Heading size="md">Check Balance</Heading>
                    <Input
                      placeholder="Enter address"
                      value={checkBalanceAddress}
                      onChange={(e) => setCheckBalanceAddress(e.target.value)}
                      bg={useColorModeValue('white', 'gray.800')}
                    />
                    <Button
                      onClick={checkBalance}
                      isLoading={isCheckingBalance}
                      w="full"
                      colorScheme="blue"
                    >
                      Check Balance
                    </Button>
                    {balance !== null && (
                      <Stat>
                        <StatLabel>Balance</StatLabel>
                        <StatNumber>{balance} IT</StatNumber>
                      </Stat>
                    )}
                  </VStack>
                </Box>
              </ScaleFade>

              {/* Mint Tokens Card */}
              <ScaleFade in={true} delay={0.2}>
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="xl"
                  backdropFilter="blur(10px)"
                  transition="transform 0.3s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <VStack spacing={4}>
                    <Icon as={FaPlus} boxSize={8} color="green.500" />
                    <Heading size="md">Mint Tokens</Heading>
                    <Input
                      placeholder="Enter address"
                      value={mintAddress}
                      onChange={(e) => setMintAddress(e.target.value)}
                      bg={useColorModeValue('white', 'gray.800')}
                    />
                    <Input
                      placeholder="Amount"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      bg={useColorModeValue('white', 'gray.800')}
                    />
                    <Button
                      onClick={mintTokens}
                      isLoading={isMinting}
                      w="full"
                      colorScheme="green"
                    >
                      Mint Tokens
                    </Button>
                  </VStack>
                </Box>
              </ScaleFade>

              {/* Transfer Tokens Card */}
              <ScaleFade in={true} delay={0.4}>
                <Box
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="xl"
                  backdropFilter="blur(10px)"
                  transition="transform 0.3s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <VStack spacing={4}>
                    <Icon as={FaExchangeAlt} boxSize={8} color="purple.500" />
                    <Heading size="md">Transfer Tokens</Heading>
                    <Input
                      placeholder="Enter recipient address"
                      value={transferAddress}
                      onChange={(e) => setTransferAddress(e.target.value)}
                      bg={useColorModeValue('white', 'gray.800')}
                    />
                    <Input
                      placeholder="Amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      bg={useColorModeValue('white', 'gray.800')}
                    />
                    <Button
                      onClick={transferTokens}
                      isLoading={isTransferring}
                      w="full"
                      colorScheme="purple"
                    >
                      Transfer Tokens
                    </Button>
                  </VStack>
                </Box>
              </ScaleFade>
            </SimpleGrid>
          </VStack>
        </Container>

        {/* Transaction History Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalHeader>
              <HStack justify="space-between">
                <Text>Transaction History</Text>
                <Badge colorScheme="blue" fontSize="0.8em">
                  Last {transactions.length} transactions
                </Badge>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <List spacing={3}>
                {transactions.map((tx, index) => (
                  <ListItem
                    key={index}
                    p={4}
                    bg={transactionItemBg}
                    borderRadius="lg"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <HStack>
                          <Icon
                            as={
                              tx.type === 'mint'
                                ? FaPlus
                                : tx.type === 'transfer'
                                ? FaExchangeAlt
                                : FaEthereum
                            }
                            color={
                              tx.type === 'mint'
                                ? 'green.500'
                                : tx.type === 'transfer'
                                ? 'purple.500'
                                : 'blue.500'
                            }
                          />
                          <Text fontWeight="bold">
                            {tx.type === 'mint'
                              ? 'Token Mint'
                              : tx.type === 'transfer'
                              ? 'Token Transfer'
                              : 'Balance Check'}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {tx.address.slice(0, 6)}...{tx.address.slice(-4)}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        {tx.amount && (
                          <Text fontWeight="bold" color={tx.type === 'mint' ? 'green.500' : 'purple.500'}>
                            {tx.amount} IT
                          </Text>
                        )}
                        <Text fontSize="xs" color="gray.500">
                          {tx.timestamp}
                        </Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}

export default App;
