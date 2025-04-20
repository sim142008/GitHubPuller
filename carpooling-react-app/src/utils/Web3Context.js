import React, { createContext, useState, useContext } from 'react';
import Web3 from 'web3';

// Import the ABI
import CarpoolingContractABI from '../contracts/CarpoolingContractABI';
import DataBankABI from '../contracts/DataBankABI';

// Contract addresses - using real deployed contract addresses
// The CarpoolingContract has been deployed to the network
// The DataBank contract is imported by CarpoolingContract and doesn't need a separate address
const CARPOOLING_CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const DATABANK_CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138'; // Same as CarpoolingContract since DataBank is included

// Create the context
const Web3Context = createContext();

// Custom hook for accessing the context
export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [carpoolingContract, setCarpoolingContract] = useState(null);
  const [dataBankContract, setDataBankContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    status: 'disconnected',
    message: 'Not connected to blockchain'
  });
  
  // Attempt to connect automatically when the component mounts
  // We're deliberately excluding initWeb3 from deps because we want this to run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const attemptConnection = async () => {
      try {
        await initWeb3();
      } catch (error) {
        console.error('Failed to initialize Web3 automatically:', error);
      }
    };
    
    attemptConnection();
  }, []);

  // Initialize Web3 and contracts
  const initWeb3 = async () => {
    try {
      updateConnectionStatus('connecting', 'Connecting to blockchain...');
      
      // For development mode, we can use a fallback mode if no provider is available
      const isDevelopment = process.env.NODE_ENV === 'development';
      const mockMode = isDevelopment && (!window.ethereum && !window.web3);
      
      // Check if MetaMask or other provider is available
      if (window.ethereum) {
        console.log('Using MetaMask provider');
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        setProvider(web3Instance);
        
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get the connected account
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            
            // Get network ID
            const netId = await web3Instance.eth.net.getId();
            setNetworkId(netId);
            
            // Initialize contracts
            initializeContracts(web3Instance);
            
            setIsConnected(true);
            updateConnectionStatus('connected', 'Connected to blockchain');
            
            // Setup event listeners for account or network changes
            setupEventListeners();
            
            return true;
          } else {
            console.error('No accounts found after connecting');
            updateConnectionStatus('error', 'No accounts found. Please unlock your wallet.');
            return false;
          }
        } catch (error) {
          console.error('User denied account access:', error);
          updateConnectionStatus('error', 'User denied account access');
          return false;
        }
      } 
      // Legacy dapp browsers
      else if (window.web3) {
        console.log('Using legacy Web3 provider');
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
        setProvider(web3Instance);
        
        try {
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            
            const netId = await web3Instance.eth.net.getId();
            setNetworkId(netId);
            
            initializeContracts(web3Instance);
            
            setIsConnected(true);
            updateConnectionStatus('connected', 'Connected to blockchain');
            
            setupEventListeners();
            
            return true;
          } else {
            updateConnectionStatus('error', 'No accounts found. Please unlock your wallet.');
            return false;
          }
        } catch (error) {
          console.error('Error accessing accounts:', error);
          updateConnectionStatus('error', 'Error accessing accounts. Please unlock your wallet.');
          return false;
        }
      } 
      // Development mode fallback (for testing UI without blockchain)
      else if (mockMode) {
        console.log('No provider found, but in development mode - using mock mode');
        updateConnectionStatus('warning', 'Running in development mode without blockchain connection. Install MetaMask for full functionality.');
        return false;
      }
      // No web3 provider in production
      else {
        console.error('No Ethereum wallet detected');
        updateConnectionStatus('error', 'No Ethereum wallet detected. Please install MetaMask or another wallet');
        return false;
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      return false;
    }
  };

  const initializeContracts = (web3Instance) => {
    try {
      if (!web3Instance) {
        console.error('Web3 instance not available');
        updateConnectionStatus('error', 'Web3 instance not available');
        return;
      }
      
      // Validate contract addresses
      if (!Web3.utils.isAddress(CARPOOLING_CONTRACT_ADDRESS) || 
          !Web3.utils.isAddress(DATABANK_CONTRACT_ADDRESS)) {
        console.warn('Using placeholder contract addresses in development mode');
        updateConnectionStatus('warning', 'Using placeholder contract addresses. Smart contract functions will not work.');
        return;
      }

      // Initialize the CarpoolingContract
      try {
        const carpoolingContractInstance = new web3Instance.eth.Contract(
          CarpoolingContractABI,
          CARPOOLING_CONTRACT_ADDRESS
        );
        setCarpoolingContract(carpoolingContractInstance);
        console.log('CarpoolingContract initialized successfully');
      } catch (contractError) {
        console.error('Failed to initialize CarpoolingContract:', contractError);
      }
      
      // Initialize the DataBank contract
      try {
        const dataBankContractInstance = new web3Instance.eth.Contract(
          DataBankABI,
          DATABANK_CONTRACT_ADDRESS
        );
        setDataBankContract(dataBankContractInstance);
        console.log('DataBankContract initialized successfully');
      } catch (contractError) {
        console.error('Failed to initialize DataBankContract:', contractError);
      }
      
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      updateConnectionStatus('error', 'Failed to initialize smart contracts');
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          updateConnectionStatus('connected', 'Account changed');
        } else {
          setAccount('');
          setIsConnected(false);
          updateConnectionStatus('disconnected', 'Please connect to MetaMask');
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload(); // Recommended by MetaMask
      });
      
      // Listen for disconnect
      window.ethereum.on('disconnect', () => {
        setIsConnected(false);
        updateConnectionStatus('disconnected', 'Disconnected from blockchain');
      });
    }
  };

  const updateConnectionStatus = (status, message) => {
    setConnectionStatus({ status, message });
  };

  // Simplified error messages for user-friendly display
  const simplifyErrorMessage = (error) => {
    let message = error.message || 'Unknown error occurred';
    
    // Shorten the message if it's too long
    if (message.length > 100) {
      message = message.substring(0, 100) + '...';
    }
    
    // Check for common Web3 errors
    if (message.includes('User denied')) {
      return 'Transaction was rejected by user';
    } else if (message.includes('gas')) {
      return 'Gas estimation failed. The transaction might fail.';
    } else if (message.includes('nonce')) {
      return 'Nonce error. Please reset your MetaMask account.';
    } else if (message.includes('already known')) {
      return 'Transaction already pending. Please wait for confirmation.';
    } else if (message.includes('underpriced')) {
      return 'Gas price too low. Please increase gas price.';
    }
    
    return message;
  };

  // Function to register a new user
  const registerUser = async (username, phoneNumber, email) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Registering user...');
      
      // Call the contract method - use RegisterUserAccount which is the actual function name in the contract
      const tx = await carpoolingContract.methods
        .RegisterUserAccount(account, username, phoneNumber, email)
        .send({ from: account });
      
      updateConnectionStatus('success', 'User registered successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error registering user:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to get user details
  const getUserDetails = async (address = null) => {
    try {
      if (!carpoolingContract) {
        throw new Error('Contract not initialized');
      }
      
      const userAddress = address || account;
      
      if (!userAddress) {
        throw new Error('No user address provided');
      }
      
      // Try to call the login panel first to check if user exists
      const loginStatus = await carpoolingContract.methods
        .loginPanel(userAddress)
        .call();
      
      // Then get user details
      const userDetails = await carpoolingContract.methods
        .getUserDetails(userAddress)
        .call();
      
      // If username is "Not Found", user is not registered
      const isRegistered = userDetails[0] !== "Not Found";
      
      return { 
        success: true, 
        user: {
          username: userDetails[0],
          phoneNumber: userDetails[1],
          email: userDetails[2],
          isRegistered: isRegistered
        } 
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return { 
        success: false, 
        error: simplifyErrorMessage(error) 
      };
    }
  };

  // Function to publish a new ride
  const publishRide = async (from, to, date, time, amount, seats, vehicleType) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Publishing ride...');
      
      // Convert amount to wei (if amount is in Ether)
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .publishRide(from, to, date, time, amountInWei, seats, vehicleType)
        .send({ from: account });
      
      updateConnectionStatus('success', 'Ride published successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error publishing ride:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to get available rides
  const getAvailableRides = async () => {
    try {
      if (!carpoolingContract) {
        throw new Error('Contract not initialized');
      }
      
      // Call the contract method
      const rides = await carpoolingContract.methods
        .getAvailableRides()
        .call();
      
      // Format the rides data
      const formattedRides = rides.map(ride => ({
        id: ride[0],
        driver: ride[1],
        from: ride[2],
        to: ride[3],
        date: ride[4],
        time: ride[5],
        amount: web3.utils.fromWei(ride[6], 'ether'),
        seats: ride[7],
        vehicleType: ride[8],
        status: ride[9]
      }));
      
      return { success: true, rides: formattedRides };
    } catch (error) {
      console.error('Error getting available rides:', error);
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to search rides by location
  const searchRidesByLocation = async (from, to) => {
    try {
      if (!carpoolingContract) {
        throw new Error('Contract not initialized');
      }
      
      // Call the contract method
      const rides = await carpoolingContract.methods
        .searchRidesByLocation(from, to)
        .call();
      
      // Format the rides data
      const formattedRides = rides.map(ride => ({
        id: ride[0],
        driver: ride[1],
        from: ride[2],
        to: ride[3],
        date: ride[4],
        time: ride[5],
        amount: web3.utils.fromWei(ride[6], 'ether'),
        seats: ride[7],
        vehicleType: ride[8],
        status: ride[9]
      }));
      
      return { success: true, rides: formattedRides };
    } catch (error) {
      console.error('Error searching rides:', error);
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to book a ride
  const bookRide = async (rideId, seats, amount) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Booking ride...');
      
      // Convert amount to wei (if amount is in Ether)
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .bookRide(rideId, seats)
        .send({ from: account, value: amountInWei });
      
      updateConnectionStatus('success', 'Ride booked successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error booking ride:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to get user's booked rides
  const getMyBookings = async () => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      // Call the contract method
      const bookings = await carpoolingContract.methods
        .getMyBookings()
        .call({ from: account });
      
      // Format the bookings data
      const formattedBookings = bookings.map(booking => ({
        id: booking[0],
        rideId: booking[1],
        passenger: booking[2],
        seats: booking[3],
        amount: web3.utils.fromWei(booking[4], 'ether'),
        status: booking[5]
      }));
      
      return { success: true, bookings: formattedBookings };
    } catch (error) {
      console.error('Error getting bookings:', error);
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to get user's published rides
  const getMyRides = async () => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      // Call the contract method
      const rides = await carpoolingContract.methods
        .getMyRides()
        .call({ from: account });
      
      // Format the rides data
      const formattedRides = rides.map(ride => ({
        id: ride[0],
        driver: ride[1],
        from: ride[2],
        to: ride[3],
        date: ride[4],
        time: ride[5],
        amount: web3.utils.fromWei(ride[6], 'ether'),
        seats: ride[7],
        vehicleType: ride[8],
        status: ride[9]
      }));
      
      return { success: true, rides: formattedRides };
    } catch (error) {
      console.error('Error getting rides:', error);
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to get bookings for driver's rides
  const getBookingsForMyRides = async () => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      // Call the contract method
      const bookings = await carpoolingContract.methods
        .getBookingsForMyRides()
        .call({ from: account });
      
      // Format the bookings data
      const formattedBookings = bookings.map(booking => ({
        id: booking[0],
        rideId: booking[1],
        passenger: booking[2],
        seats: booking[3],
        amount: web3.utils.fromWei(booking[4], 'ether'),
        status: booking[5]
      }));
      
      return { success: true, bookings: formattedBookings };
    } catch (error) {
      console.error('Error getting bookings for rides:', error);
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to approve a booking
  const approveBooking = async (bookingId) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Approving booking...');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .approveBooking(bookingId)
        .send({ from: account });
      
      updateConnectionStatus('success', 'Booking approved successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error approving booking:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to reject a booking
  const rejectBooking = async (bookingId) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Rejecting booking...');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .rejectBooking(bookingId)
        .send({ from: account });
      
      updateConnectionStatus('success', 'Booking rejected successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error rejecting booking:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to cancel a ride
  const cancelRide = async (rideId) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Cancelling ride...');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .cancelRide(rideId)
        .send({ from: account });
      
      updateConnectionStatus('success', 'Ride cancelled successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error cancelling ride:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to activate a ride
  const activateRide = async (rideId) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Activating ride...');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .activateRide(rideId)
        .send({ from: account });
      
      updateConnectionStatus('success', 'Ride activated successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error activating ride:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to complete a ride
  const completeRide = async (rideId) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Completing ride...');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .completeRide(rideId)
        .send({ from: account });
      
      updateConnectionStatus('success', 'Ride completed successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error completing ride:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to process payment
  const processPayment = async (bookingId) => {
    try {
      if (!carpoolingContract || !account) {
        throw new Error('Contract or account not initialized');
      }
      
      updateConnectionStatus('processing', 'Processing payment...');
      
      // Call the contract method
      const tx = await carpoolingContract.methods
        .processPayment(bookingId)
        .send({ from: account });
      
      updateConnectionStatus('success', 'Payment processed successfully');
      
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error processing payment:', error);
      updateConnectionStatus('error', simplifyErrorMessage(error));
      
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Function to get platform statistics
  const getPlatformStats = async () => {
    try {
      if (!carpoolingContract) {
        throw new Error('Contract not initialized');
      }
      
      // Call the contract method
      const stats = await carpoolingContract.methods
        .getPlatformStats()
        .call();
      
      return { 
        success: true, 
        stats: {
          totalUsers: stats[0],
          totalRides: stats[1],
          totalBookings: stats[2],
          totalAmountTransacted: web3.utils.fromWei(stats[3], 'ether')
        } 
      };
    } catch (error) {
      console.error('Error getting platform stats:', error);
      return { success: false, error: simplifyErrorMessage(error) };
    }
  };

  // Value object - all the functions and state that will be available through the context
  const value = {
    web3,
    provider,
    account,
    carpoolingContract,
    dataBankContract,
    networkId,
    isConnected,
    connectionStatus,
    initWeb3,
    registerUser,
    getUserDetails,
    publishRide,
    getAvailableRides,
    searchRidesByLocation,
    bookRide,
    getMyBookings,
    getMyRides,
    getBookingsForMyRides,
    approveBooking,
    rejectBooking,
    cancelRide,
    activateRide,
    completeRide,
    processPayment,
    getPlatformStats
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};