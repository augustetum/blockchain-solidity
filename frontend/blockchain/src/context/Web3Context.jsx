import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EventTicketABI from '../contracts/EventTicket.json';
import TicketMarketplaceABI from '../contracts/TicketMarketplace.json';

const Web3Context = createContext();

// Contract addresses - update these after deployment
// After running deployEventsAndMintTickets.js, update the eventTickets array
const CONTRACTS = {
  ganache: {
    marketplace: '0x0517a53bBCA7402ad8452cC801e30e93D430e223',
    eventTickets: [
      { name: "Jessica Shy | Vingio Parkas", address: "0xe730be3C37E470B710b8C484AA32d308335796Bb" },
      { name: "Vaidas Baumila | Žalgirio arena", address: "0x0A7D07f9ca664E3b2D21BceF53c7ec66E52B5036" },
      { name: "JUODAS VILNIUS 2026", address: "0xe26fC48Ed0Ff931aEBB036e765041E8942676931" },
      { name: "Kings of Leon | The only show in the region", address: "0xdC74abcC482e1B26934819fF74432A338bC2B81a" },
      { name: "Andrius Mamontovas: TIK HITAI", address: "0x6FDc4ED11D61956a0090adf8027dAd1db231f7fF" },
      { name: "punktò ~ KAUNAS", address: "0x7976665e956443CDCa51a07048845A3d07e6A73C" }
    ]
  },
  sepolia: {
    marketplace: null,
    eventTickets: []
  }
};

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [contracts, setContracts] = useState({ eventTickets: [], marketplace: null });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this app');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setNetwork({
        chainId: Number(network.chainId),
        name: network.name
      });

      // Initialize contracts based on network
      await initializeContracts(provider, signer, Number(network.chainId));

      console.log('Connected to wallet:', accounts[0]);
      console.log('Network:', network);

    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Initialize contracts based on network
  const initializeContracts = async (provider, signer, chainId) => {
    try {
      let eventTicketsConfig, marketplaceAddress;

      // Ganache (local): chainId 1337 or 5777
      if (chainId === 1337 || chainId === 5777) {
        eventTicketsConfig = CONTRACTS.ganache.eventTickets;
        marketplaceAddress = CONTRACTS.ganache.marketplace;
      }
      // Sepolia: chainId 11155111
      else if (chainId === 11155111) {
        eventTicketsConfig = CONTRACTS.sepolia.eventTickets;
        marketplaceAddress = CONTRACTS.sepolia.marketplace;
      }
      else {
        throw new Error(`Unsupported network. Please connect to Ganache (localhost) or Sepolia testnet.`);
      }

      if (!marketplaceAddress) {
        console.warn('Contract addresses not set for this network. Please deploy contracts first.');
        return;
      }

      // Initialize marketplace contract
      const marketplace = new ethers.Contract(
        marketplaceAddress,
        TicketMarketplaceABI.abi,
        signer
      );

      // Initialize all event ticket contracts
      const eventTickets = eventTicketsConfig.map(config => ({
        name: config.name,
        address: config.address,
        contract: new ethers.Contract(
          config.address,
          EventTicketABI.abi,
          signer
        )
      }));

      setContracts({ eventTickets, marketplace });
      console.log('Contracts initialized:', {
        marketplace: marketplaceAddress,
        eventTicketsCount: eventTickets.length
      });

    } catch (err) {
      console.error('Error initializing contracts:', err);
      setError(err.message);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setNetwork(null);
    setContracts({ eventTickets: [], marketplace: null });
    setError(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet();
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const value = {
    provider,
    signer,
    account,
    network,
    contracts,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
}

// Helper function to update contract addresses
export function updateContractAddresses(network, eventTickets, marketplace) {
  if (network === 'ganache') {
    CONTRACTS.ganache.eventTickets = eventTickets;
    CONTRACTS.ganache.marketplace = marketplace;
  } else if (network === 'sepolia') {
    CONTRACTS.sepolia.eventTickets = eventTickets;
    CONTRACTS.sepolia.marketplace = marketplace;
  }
}

// Helper function to get contract by event name
export function getEventTicketContract(contracts, eventName) {
  if (!contracts.eventTickets || contracts.eventTickets.length === 0) {
    return null;
  }

  const found = contracts.eventTickets.find(ticket => ticket.name === eventName);
  return found ? found.contract : null;
}
