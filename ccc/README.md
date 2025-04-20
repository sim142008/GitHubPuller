# Blockchain-Based Carpooling Platform

A decentralized carpooling application built on blockchain technology that allows users to register as drivers or passengers, publish rides, book seats, and manage carpooling transactions securely.

## Features

- **User Registration**: Register with your Ethereum wallet address
- **User Authentication**: Login with your blockchain identity
- **Ride Publishing**: Drivers can publish rides with details like origin, destination, date, time, cost, and number of seats
- **Ride Search**: Passengers can search available rides by location
- **Booking System**: Book seats on available rides with transparent pricing
- **Ride Management**: Activate, cancel, or complete rides
- **Booking Approvals**: Approve or reject booking requests
- **Payment Processing**: Secure payment handling using blockchain

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Blockchain**: Ethereum
- **Smart Contracts**: Solidity
- **Web3 Integration**: Web3.js

## Smart Contract Structure

The platform consists of several key smart contract components:

### Data Structures
- `RegiterUsers`: Stores user information (address, name, contact details)
- `PublishRide`: Stores ride information (route, date, time, cost, available seats)
- `RideBooking`: Manages booking information between passengers and rides
- `PublishRideBookingList`: Combined structure for ride and booking details

### Key Functions
- User registration and authentication
- Ride publishing and management
- Ride searching and filtering
- Booking processing and status management
- Payment handling

## Setup and Installation

### Prerequisites
- MetaMask or any Ethereum wallet
- Access to an Ethereum network (local Ganache or public testnet)

### Local Development Setup
1. Clone the repository
2. Open `index.html` in your browser
3. Connect your Ethereum wallet
4. Start using the application

### Smart Contract Deployment
1. Deploy the `CarpoolingContract.sol` to your Ethereum network
2. Update the contract address in `web3connection_improved.js`

## Usage Guide

### For Drivers
1. Register using your Ethereum wallet
2. Publish rides with your route information
3. Manage booking requests
4. Complete rides and receive payments

### For Passengers
1. Register using your Ethereum wallet
2. Search for available rides
3. Book available seats
4. Complete payments for confirmed bookings

## Security Considerations

- The smart contracts include access control to ensure only authorized users can modify relevant data
- Transactions are secured through blockchain cryptography
- User data is associated with Ethereum addresses for identity verification

## Future Improvements

- Implement a rating and review system for both drivers and passengers
- Add ride sharing verification through GPS tracking
- Integrate decentralized insurance for rides
- Implement a token-based loyalty program
- Add advanced search filters and route optimization
- Develop a native mobile application

## Credits

This project utilizes Ethereum blockchain technology and Web3.js for decentralized application development.

## License

This project is licensed under the GNU General Public License v3.0