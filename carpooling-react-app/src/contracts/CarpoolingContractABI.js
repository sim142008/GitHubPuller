const CarpoolingContractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "bookingKey",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "status",
        "type": "bool"
      }
    ],
    "name": "BookingStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "bookingKey",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PaymentProcessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "rideKey",
        "type": "uint256"
      }
    ],
    "name": "RideActivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "rideKey",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "driver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "from",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "to",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "date",
        "type": "string"
      }
    ],
    "name": "RideAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "rideKey",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "bookingKey",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "passenger",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "seats",
        "type": "uint256"
      }
    ],
    "name": "RideBooked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "rideKey",
        "type": "uint256"
      }
    ],
    "name": "RideCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "username",
        "type": "string"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
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
        "name": "bookingId",
        "type": "uint256"
      }
    ],
    "name": "SetRideBookingApprovalStatus",
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
        "name": "bookingId",
        "type": "uint256"
      }
    ],
    "name": "SetRidePaymentTransferStatus",
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
            "internalType": "uint256",
            "name": "nopstatus",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "vtype",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isRideBookingDone",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isRideOver",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "rideStatus",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "rideBookingKey",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "bookedbypassenger",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "travelnop",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paidamount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "bookingstatus",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "paymentstatus",
            "type": "bool"
          }
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
            "internalType": "uint256",
            "name": "nopstatus",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "vtype",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isRideBookingDone",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isRideOver",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "rideStatus",
            "type": "bool"
          }
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
            "internalType": "uint256",
            "name": "nopstatus",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "vtype",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isRideBookingDone",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isRideOver",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "rideStatus",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "rideBookingKey",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "bookedbypassenger",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "travelnop",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paidamount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "bookingstatus",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "paymentstatus",
            "type": "bool"
          }
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
            "internalType": "uint256",
            "name": "nopstatus",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "vtype",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isRideBookingDone",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isRideOver",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "rideStatus",
            "type": "bool"
          }
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
            "internalType": "uint256",
            "name": "nopstatus",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "vtype",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isRideBookingDone",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isRideOver",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "rideStatus",
            "type": "bool"
          }
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

export default CarpoolingContractABI;