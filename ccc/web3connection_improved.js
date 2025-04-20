// Improved Web3 connection with modern practices and error handling
document.addEventListener('DOMContentLoaded', async function() {
    // Web3 connection status indicator element
    const connectionStatusEl = document.createElement('div');
    connectionStatusEl.id = 'web3-connection-status';
    connectionStatusEl.style.position = 'fixed';
    connectionStatusEl.style.bottom = '10px';
    connectionStatusEl.style.left = '10px';
    connectionStatusEl.style.padding = '5px 10px';
    connectionStatusEl.style.borderRadius = '4px';
    connectionStatusEl.style.fontSize = '12px';
    connectionStatusEl.style.zIndex = '1000';
    document.body.appendChild(connectionStatusEl);

    // Initialize web3
    let web3;
    let myContract;
    let currentAccount = null;

    function updateConnectionStatus(status, message) {
        const statusEl = document.getElementById('web3-connection-status');
        if (status === 'connected') {
            statusEl.style.backgroundColor = '#e3f2fd';
            statusEl.style.color = '#1565c0';
            statusEl.innerHTML = `<span>✓ ${message}</span>`;
        } else if (status === 'connecting') {
            statusEl.style.backgroundColor = '#fff9c4';
            statusEl.style.color = '#ffa000';
            statusEl.innerHTML = `<span>⟳ ${message}</span>`;
        } else {
            statusEl.style.backgroundColor = '#ffebee';
            statusEl.style.color = '#c62828';
            statusEl.innerHTML = `<span>✗ ${message}</span>`;
        }
    }

    async function initWeb3() {
        updateConnectionStatus('connecting', 'Connecting to blockchain...');
        
        try {
            // Modern dapp browsers
            if (window.ethereum) {
                try {
                    web3 = new Web3(window.ethereum);
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await web3.eth.getAccounts();
                    currentAccount = accounts[0];
                    
                    // Set up listener for account changes
                    window.ethereum.on('accountsChanged', function (accounts) {
                        currentAccount = accounts[0];
                        console.log('Account changed to:', currentAccount);
                        // Reload the page to refresh data for the new account
                        window.location.reload();
                    });
                    
                    // Set up listener for chain changes
                    window.ethereum.on('chainChanged', function (chainId) {
                        console.log('Network changed to:', chainId);
                        // Reload the page to refresh data for the new network
                        window.location.reload();
                    });
                    
                    initContract();
                    
                } catch (error) {
                    if (error.code === 4001) {
                        // User rejected request
                        updateConnectionStatus('error', 'Please connect to MetaMask');
                    } else {
                        console.error(error);
                        updateConnectionStatus('error', 'Error connecting to MetaMask');
                    }
                }
            }
            // Legacy dapp browsers or fallback to local node
            else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider);
                const accounts = await web3.eth.getAccounts();
                currentAccount = accounts[0];
                initContract();
            }
            // Fallback to localhost if no web3 injection
            else {
                try {
                    web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
                    const accounts = await web3.eth.getAccounts();
                    if (accounts && accounts.length > 0) {
                        currentAccount = accounts[0];
                        initContract();
                    } else {
                        throw new Error('No accounts found');
                    }
                } catch (error) {
                    console.error('Error connecting to local node:', error);
                    updateConnectionStatus('error', 'No Ethereum provider detected. Please install MetaMask');
                }
            }
        } catch (error) {
            console.error('Error initializing Web3:', error);
            updateConnectionStatus('error', 'Failed to initialize Web3');
        }
    }

    function initContract() {
        // Contract ABI - the interface definition that allows interaction with the smart contract
        const contractABI = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "hashcodeaddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "headingfrom",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "headingto",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "ridingdate",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "ridingtime",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rideamount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nop",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "vtype",
                        "type": "string"
                    }
                ],
                "name": "AddRide",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rideno",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "passenger",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nop",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "ridechagres",
                        "type": "uint256"
                    }
                ],
                "name": "MapRideBooking",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "hashaddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "phonenumber",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "email",
                        "type": "string"
                    }
                ],
                "name": "RegisterUserAccount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rideno",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nop",
                        "type": "uint256"
                    }
                ],
                "name": "RideNOPStatus",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "argRideKey",
                        "type": "uint256"
                    }
                ],
                "name": "activateRide",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "argRideKey",
                        "type": "uint256"
                    }
                ],
                "name": "cancelRide",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rideId",
                        "type": "uint256"
                    }
                ],
                "name": "completeRide",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "dhashcode",
                        "type": "address"
                    }
                ],
                "name": "getDriverBookedRides",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "rideKey",
                                "type": "uint256"
                            },
                            // ... (remaining fields omitted for brevity)
                        ],
                        "internalType": "struct PublishRideBookingList[]",
                        "name": "",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "hashcode",
                        "type": "address"
                    }
                ],
                "name": "getMyRides",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "rideKey",
                                "type": "uint256"
                            },
                            // ... (remaining fields omitted for brevity)
                        ],
                        "internalType": "struct PublishRide[]",
                        "name": "",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "phashcode",
                        "type": "address"
                    }
                ],
                "name": "getPassengerBookedRides",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "rideKey",
                                "type": "uint256"
                            },
                            // ... (remaining fields omitted for brevity)
                        ],
                        "internalType": "struct PublishRideBookingList[]",
                        "name": "",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "hashcode",
                        "type": "address"
                    }
                ],
                "name": "getPassengerRides",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "rideKey",
                                "type": "uint256"
                            },
                            // ... (remaining fields omitted for brevity)
                        ],
                        "internalType": "struct PublishRide[]",
                        "name": "",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getTotalBookings",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getTotalRides",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getTotalUsers",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "hashcode",
                        "type": "address"
                    }
                ],
                "name": "getUserDetails",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "hashcode",
                        "type": "address"
                    }
                ],
                "name": "loginPanel",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rbid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "action",
                        "type": "uint256"
                    }
                ],
                "name": "rideBookingStatusUpdate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "rbid",
                        "type": "uint256"
                    }
                ],
                "name": "ridepaymentupdates",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "phashcode",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "headingfrom",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "headingto",
                        "type": "string"
                    }
                ],
                "name": "searchByLocation",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "rideKey",
                                "type": "uint256"
                            },
                            // ... (remaining fields omitted for brevity)
                        ],
                        "internalType": "struct PublishRide[]",
                        "name": "",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "argRideKey",
                        "type": "uint256"
                    }
                ],
                "name": "searchView",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        
        // Update with your contract address
        const contractAddress = '0xYourContractAddressHere';
        
        try {
            // Create contract instance
            myContract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Make the contract globally available
            window.myContract = myContract;
            window.web3 = web3;
            window.getCurrentAccount = () => currentAccount;
            
            // Update connection status
            updateConnectionStatus('connected', 'Connected to blockchain');
            
            // Dispatch event that web3 is initialized
            const event = new CustomEvent('web3Initialized', {
                detail: { web3, myContract, currentAccount }
            });
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error('Error initializing contract:', error);
            updateConnectionStatus('error', 'Failed to initialize contract');
        }
    }

    // Start initialization
    initWeb3();

    // Utility functions for common contract interactions
    window.contractUtils = {
        // Convert address to checksum format to ensure consistency
        getChecksumAddress: (address) => {
            try {
                return web3.utils.toChecksumAddress(address);
            } catch (e) {
                console.error('Invalid Ethereum address:', e);
                return null;
            }
        },
        
        // Common function to handle contract calls with proper error handling
        callContract: async (method, params, options = {}) => {
            try {
                if (!myContract) {
                    throw new Error('Contract not initialized');
                }
                
                // Get current gas price with 10% increase for faster confirmation
                const gasPrice = await web3.eth.getGasPrice();
                const adjustedGasPrice = Math.floor(parseInt(gasPrice) * 1.1).toString();
                
                // Merge default parameters with provided options
                const txOptions = {
                    from: currentAccount,
                    gasPrice: adjustedGasPrice,
                    ...options
                };
                
                // For view/pure functions (calls)
                if (method.includes('.call(')) {
                    return await eval(`myContract.methods.${method}`);
                }
                // For transactions
                else {
                    const tx = await eval(`myContract.methods.${method}`).send(txOptions);
                    return tx;
                }
            } catch (error) {
                console.error(`Error in contract call ${method}:`, error);
                // Re-throw with user-friendly message
                throw new Error(simplifyErrorMessage(error));
            }
        },
        
        // User management
        async registerUser(username, phoneNumber, email) {
            return await this.callContract(
                `RegisterUserAccount(getCurrentAccount(), "${username}", "${phoneNumber}", "${email}")`,
                []
            );
        },
        
        async login(address) {
            const checksumAddress = this.getChecksumAddress(address);
            if (!checksumAddress) return [null, 0];
            
            return await this.callContract(
                `loginPanel("${checksumAddress}").call()`,
                []
            );
        },
        
        async getUserDetails(address) {
            const checksumAddress = this.getChecksumAddress(address);
            if (!checksumAddress) return ["Not Found", "Not Found", "Not Found"];
            
            return await this.callContract(
                `getUserDetails("${checksumAddress}").call()`,
                []
            );
        },
        
        // Ride management
        async publishRide(from, to, date, time, amount, seats, vehicleType) {
            return await this.callContract(
                `AddRide(getCurrentAccount(), "${from}", "${to}", "${date}", "${time}", ${amount}, ${seats}, "${vehicleType}")`,
                []
            );
        },
        
        async cancelRide(rideId) {
            return await this.callContract(
                `cancelRide(${rideId})`,
                []
            );
        },
        
        async activateRide(rideId) {
            return await this.callContract(
                `activateRide(${rideId})`,
                []
            );
        },
        
        async completeRide(rideId) {
            return await this.callContract(
                `completeRide(${rideId})`,
                []
            );
        },
        
        // Booking management
        async bookRide(rideId, seats, amount) {
            return await this.callContract(
                `MapRideBooking(${rideId}, getCurrentAccount(), ${seats}, ${amount})`,
                []
            );
        },
        
        async approveBooking(bookingId) {
            return await this.callContract(
                `rideBookingStatusUpdate(${bookingId}, 1)`,
                []
            );
        },
        
        async rejectBooking(bookingId) {
            return await this.callContract(
                `rideBookingStatusUpdate(${bookingId}, 0)`,
                []
            );
        },
        
        async processPayment(bookingId) {
            return await this.callContract(
                `ridepaymentupdates(${bookingId})`,
                []
            );
        },
        
        // View functions
        async getMyRides() {
            return await this.callContract(
                `getMyRides(getCurrentAccount()).call()`,
                []
            );
        },
        
        async getAvailableRides() {
            return await this.callContract(
                `getPassengerRides(getCurrentAccount()).call()`,
                []
            );
        },
        
        async searchRidesByLocation(from, to) {
            return await this.callContract(
                `searchByLocation(getCurrentAccount(), "${from}", "${to}").call()`,
                []
            );
        },
        
        async getMyBookings() {
            return await this.callContract(
                `getPassengerBookedRides(getCurrentAccount()).call()`,
                []
            );
        },
        
        async getBookingsForMyRides() {
            return await this.callContract(
                `getDriverBookedRides(getCurrentAccount()).call()`,
                []
            );
        },
        
        // Platform statistics
        async getPlatformStats() {
            const [users, rides, bookings] = await Promise.all([
                this.callContract('getTotalUsers().call()', []),
                this.callContract('getTotalRides().call()', []),
                this.callContract('getTotalBookings().call()', [])
            ]);
            
            return { users, rides, bookings };
        }
    };
    
    // Helper function to simplify error messages
    function simplifyErrorMessage(error) {
        if (!error) return 'Unknown error occurred';
        
        // Extract message from different error formats
        let message = '';
        if (error.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        } else {
            message = JSON.stringify(error);
        }
        
        // Simplify common blockchain error messages
        if (message.includes('gas')) {
            return 'Transaction failed: Not enough gas provided';
        } else if (message.includes('rejected')) {
            return 'Transaction rejected by user';
        } else if (message.includes('revert')) {
            // Extract custom error message if available
            const revertMatch = message.match(/revert (.*?)(?:,|$)/);
            if (revertMatch && revertMatch[1]) {
                return `Transaction reverted: ${revertMatch[1]}`;
            }
            return 'Transaction reverted by smart contract';
        } else if (message.includes('timeout')) {
            return 'Connection timeout. Please try again';
        }
        
        // Default to original message if no simplification available
        return message;
    }
});