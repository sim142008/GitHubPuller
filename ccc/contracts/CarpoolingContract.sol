// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "./DataBank.sol";

contract CarPoolingContract {
    // Data structures
    mapping (uint => RegiterUsers) private registerUsersList;
    uint private userindex;
    
    mapping (uint => PublishRide) private publishRideList;
    uint private rideindex;
    uint private rideKey;
        
    mapping (uint => RideBooking) private bookingList;
    uint private bookingindex;
    uint private bookingKey;
    
    // Events for better tracking and frontend integration
    event UserRegistered(address indexed userAddress, string username);
    event RideAdded(uint indexed rideKey, address indexed driver, string from, string to, string date);
    event RideBooked(uint indexed rideKey, uint indexed bookingKey, address indexed passenger, uint seats);
    event RideCancelled(uint indexed rideKey);
    event RideActivated(uint indexed rideKey);
    event BookingStatusUpdated(uint indexed bookingKey, bool status);
    event PaymentProcessed(uint indexed bookingKey, uint amount);
    
    constructor() {
        userindex = 0;
        rideindex = 0;
        rideKey = 1;
        bookingindex = 0;
        bookingKey = 1;
    }
    
    // Modifier to check if user exists
    modifier userExists(address hashaddress) {
        bool found = false;
        for(uint i = 0; i < userindex; i++) {
            if(registerUsersList[i].hashcodeaddress == hashaddress) {
                found = true;
                break;
            }
        }
        require(found, "User does not exist");
        _;
    }
    
    // Modifier to check if ride exists
    modifier rideExists(uint rideId) {
        require(rideId > 0 && rideId <= rideKey, "Ride does not exist");
        _;
    }
    
    // Modifier to check if booking exists
    modifier bookingExists(uint bookingId) {
        require(bookingId > 0 && bookingId <= bookingKey, "Booking does not exist");
        _;
    }
    
    // Register a new user account
    function RegisterUserAccount(
        address hashaddress,
        string memory username,
        string memory phonenumber,
        string memory email
    ) public {
        // Check if user already exists
        for(uint i = 0; i < userindex; i++) {
            if(registerUsersList[i].hashcodeaddress == hashaddress) {
                revert("User already registered");
            }
        }
        
        RegiterUsers memory obj = RegiterUsers(
            hashaddress,
            0,
            username,
            phonenumber,
            email
        );
        registerUsersList[userindex] = obj;
        userindex++;
        
        emit UserRegistered(hashaddress, username);
    }
    
    // Add a new ride
    function AddRide(
        address hashcodeaddress,
        string memory headingfrom,
        string memory headingto,
        string memory ridingdate,
        string memory ridingtime,
        uint rideamount,
        uint nop,
        string memory vtype
    ) public userExists(hashcodeaddress) {
        require(nop > 0, "Number of passengers must be greater than zero");
        require(rideamount > 0, "Ride amount must be greater than zero");
        
        PublishRide memory obj = PublishRide(
            rideKey,
            hashcodeaddress,
            headingfrom,
            headingto,
            ridingdate,
            ridingtime,
            rideamount,
            nop,
            0,
            vtype,
            false,
            false,
            true
        );
        publishRideList[rideindex] = obj;
        rideindex++;
        
        emit RideAdded(rideKey, hashcodeaddress, headingfrom, headingto, ridingdate);
        rideKey++;
    }
    
    // View ride details
    function searchView(uint argRideKey) public view rideExists(argRideKey) returns (
        address,
        string memory,
        string memory,
        string memory,
        string memory,
        uint,
        uint,
        uint,
        string memory,
        bool,
        bool,
        bool
    ) {
        uint searchindex = argRideKey - 1;
        PublishRide memory returnobj = publishRideList[searchindex];
        
        return (
            returnobj.hashcodeaddress,
            returnobj.headingfrom,
            returnobj.headingto,
            returnobj.ridingdate,
            returnobj.ridingtime,
            returnobj.rideamount,
            returnobj.nop,
            returnobj.nopstatus,
            returnobj.vtype,
            returnobj.isRideBookingDone,
            returnobj.isRideOver,
            returnobj.rideStatus
        );
    }
    
    // Login function
    function loginPanel(address hashcode) view public returns (string memory, uint) {
        RegiterUsers memory obj;
        uint index = 0;
        uint status = 0;
        string memory rvalue = "Not Found";
        
        while(index < userindex) {
            obj = registerUsersList[index];
            if(obj.hashcodeaddress == hashcode) {
                rvalue = obj.username;
                status = 1;
                break;
            }
            index++;
        }
        return (rvalue, status);
    }
    
    // Get user details
    function getUserDetails(address hashcode) view public returns (
        string memory,
        string memory,
        string memory
    ) {
        RegiterUsers memory obj;
        uint index = 0;
        
        while(index < userindex) {
            obj = registerUsersList[index];
            if(obj.hashcodeaddress == hashcode) {
                return (obj.username, obj.contactnumber, obj.emailid);
            }
            index++;
        }
        return ("Not Found", "Not Found", "Not Found");
    }
    
    // Get user's rides
    function getMyRides(address hashcode) view public returns (PublishRide[] memory, uint) {
        // Count user's rides
        uint userRideCount = 0;
        uint index = 0;
        
        while(index < rideindex) {
            if(publishRideList[index].hashcodeaddress == hashcode) {
                userRideCount++;
            }
            index++;
        }
        
        // Create and fill array
        PublishRide[] memory objlist = new PublishRide[](userRideCount);
        PublishRide memory obj;
        
        uint objindex = 0;
        index = 0;
        
        while(index < rideindex) {
            if(publishRideList[index].hashcodeaddress == hashcode) {
                obj = publishRideList[index];
                objlist[objindex] = obj;
                objindex++;
            }
            index++;
        }
        return (objlist, userRideCount);
    }
    
    // Get available rides for passengers
    function getPassengerRides(address hashcode) view public returns (PublishRide[] memory, uint) {
        // Count available rides
        uint passengerRideCount = 0;
        uint index = 0;
        
        while(index < rideindex) {
            if(publishRideList[index].hashcodeaddress != hashcode && 
               publishRideList[index].rideStatus == true && 
               !publishRideList[index].isRideBookingDone) {
                passengerRideCount++;
            }
            index++;
        }
        
        // Create and fill array
        PublishRide[] memory objlist = new PublishRide[](passengerRideCount);
        PublishRide memory obj;
        
        uint objindex = 0;
        index = 0;
        
        while(index < rideindex) {
            if(publishRideList[index].hashcodeaddress != hashcode && 
               publishRideList[index].rideStatus == true && 
               !publishRideList[index].isRideBookingDone) {
                obj = publishRideList[index];
                objlist[objindex] = obj;
                objindex++;
            }
            index++;
        }
        return (objlist, passengerRideCount);
    }
    
    // Cancel a ride
    function cancelRide(uint argRideKey) public rideExists(argRideKey) {
        uint searchindex = argRideKey - 1;
        PublishRide storage obj = publishRideList[searchindex];
        
        // Verify that sender is the ride creator
        require(obj.hashcodeaddress == msg.sender, "Only ride creator can cancel");
        // Verify ride is not already cancelled
        require(obj.rideStatus == true, "Ride is already cancelled");
        // Verify ride is not completed
        require(obj.isRideOver == false, "Cannot cancel completed ride");
        
        obj.rideStatus = false;
        
        emit RideCancelled(argRideKey);
    }
    
    // Activate a ride
    function activateRide(uint argRideKey) public rideExists(argRideKey) {
        uint searchindex = argRideKey - 1;
        PublishRide storage obj = publishRideList[searchindex];
        
        // Verify that sender is the ride creator
        require(obj.hashcodeaddress == msg.sender, "Only ride creator can activate");
        // Verify ride is currently cancelled
        require(obj.rideStatus == false, "Ride is already active");
        // Verify ride is not completed
        require(obj.isRideOver == false, "Cannot activate completed ride");
        
        obj.rideStatus = true;
        
        emit RideActivated(argRideKey);
    }
    
    // Book a ride
    function MapRideBooking(
        uint rideno,
        address passenger,
        uint nop,
        uint ridechagres
    ) public rideExists(rideno) userExists(passenger) {
        uint searchindex = rideno - 1;
        PublishRide storage obj = publishRideList[searchindex];
        
        // Check if ride is active
        require(obj.rideStatus == true, "Ride is not active");
        // Check if ride is not fully booked
        require(!obj.isRideBookingDone, "Ride is fully booked");
        // Check if passenger is not the ride creator
        require(obj.hashcodeaddress != passenger, "Cannot book your own ride");
        
        uint diffnop = obj.nop - obj.nopstatus;
        
        // Check if enough seats available
        require(diffnop >= nop, "Not enough seats available");
        
        // Update ride status
        obj.nopstatus = obj.nopstatus + nop;
        
        if(obj.nop == obj.nopstatus) {
            obj.isRideBookingDone = true;
        }
        
        // Create booking
        uint rideamount = nop * ridechagres;
        RideBooking memory RBobj = RideBooking(
            bookingKey,
            rideno,
            passenger,
            nop,
            rideamount,
            false,
            false
        );
        bookingList[bookingindex] = RBobj;
        
        emit RideBooked(rideno, bookingKey, passenger, nop);
        
        bookingindex++;
        bookingKey++;
    }
    
    // Check if enough seats are available
    function RideNOPStatus(uint rideno, uint nop) view public rideExists(rideno) returns(bool) {
        uint searchindex = rideno - 1;
        PublishRide memory obj = publishRideList[searchindex];
        
        uint diffnop = obj.nop - obj.nopstatus;
        return diffnop >= nop;
    }
    
    // Search rides by location
    function searchByLocation(
        address phashcode,
        string memory headingfrom,
        string memory headingto
    ) view public returns(PublishRide[] memory, uint) {
        // Count matching rides
        uint locRideCount = 0;
        uint index = 0;
        
        while(index < rideindex) {
            if(( keccak256(abi.encodePacked(publishRideList[index].headingfrom)) == keccak256(abi.encodePacked(headingfrom)) 
                || 
                keccak256(abi.encodePacked(publishRideList[index].headingto)) == keccak256(abi.encodePacked(headingto)) )
                &&
                publishRideList[index].hashcodeaddress != phashcode &&
                publishRideList[index].rideStatus == true &&
                !publishRideList[index].isRideOver) {
                locRideCount++;
            }
            index++;
        }
        
        // Create and fill array
        PublishRide[] memory objlist = new PublishRide[](locRideCount);
        PublishRide memory obj;
        
        uint objindex = 0;
        index = 0;
        
        while(index < rideindex) {
            if(( keccak256(abi.encodePacked(publishRideList[index].headingfrom)) == keccak256(abi.encodePacked(headingfrom)) 
                || 
                keccak256(abi.encodePacked(publishRideList[index].headingto)) == keccak256(abi.encodePacked(headingto)) )
                &&
                publishRideList[index].hashcodeaddress != phashcode &&
                publishRideList[index].rideStatus == true &&
                !publishRideList[index].isRideOver) {
                obj = publishRideList[index];
                objlist[objindex] = obj;
                objindex++;
            }
            index++;
        }
        return (objlist, locRideCount);
    }
    
    // Get passenger's booked rides
    function getPassengerBookedRides(address phashcode) view public returns(
        PublishRideBookingList[] memory,
        uint
    ) {
        uint passengerbookingcount = 0;
        uint index = 0;
        
        while(index < bookingindex) {
            if(bookingList[index].bookedbypassenger == phashcode) {
                passengerbookingcount++;
            }
            index++;
        }
        
        PublishRideBookingList[] memory bookingobjlist = new PublishRideBookingList[](passengerbookingcount);
        
        // Fill array
        index = 0;
        uint booklistindex = 0;
        
        while(index < bookingindex) {
            if(bookingList[index].bookedbypassenger == phashcode) {
                uint searchindex = bookingList[index].rideKey - 1;
                PublishRide memory probj = publishRideList[searchindex];
                
                PublishRideBookingList memory obj = PublishRideBookingList(
                    bookingList[index].rideKey,
                    probj.hashcodeaddress,
                    probj.headingfrom,
                    probj.headingto,
                    probj.ridingdate,
                    probj.ridingtime,
                    probj.rideamount,
                    probj.nop,
                    probj.nopstatus,
                    probj.vtype,
                    probj.isRideBookingDone,
                    probj.isRideOver,
                    probj.rideStatus,
                    bookingList[index].rideBookingKey,
                    bookingList[index].bookedbypassenger,
                    bookingList[index].travelnop,
                    bookingList[index].paidamount,
                    bookingList[index].bookingstatus,
                    bookingList[index].paymentstatus
                );
                bookingobjlist[booklistindex] = obj;
                booklistindex++;
            }
            index++;
        }
        
        return (bookingobjlist, booklistindex);
    }
    
    // Get driver's booked rides
    function getDriverBookedRides(address dhashcode) view public returns(
        PublishRideBookingList[] memory,
        uint
    ) {
        uint driverBookingCount = 0;
        uint index = 0;
        
        while(index < bookingindex) {
            // Check if the ride belongs to this driver
            if(publishRideList[bookingList[index].rideKey - 1].hashcodeaddress == dhashcode) {
                driverBookingCount++;
            }
            index++;
        }
        
        PublishRideBookingList[] memory bookingObjList = new PublishRideBookingList[](driverBookingCount);
        
        // Fill array
        index = 0;
        uint bookListIndex = 0;
        
        while(index < bookingindex) {
            if(publishRideList[bookingList[index].rideKey - 1].hashcodeaddress == dhashcode) {
                PublishRide memory probj = publishRideList[bookingList[index].rideKey - 1];
                
                PublishRideBookingList memory obj = PublishRideBookingList(
                    bookingList[index].rideKey,
                    probj.hashcodeaddress,
                    probj.headingfrom,
                    probj.headingto,
                    probj.ridingdate,
                    probj.ridingtime,
                    probj.rideamount,
                    probj.nop,
                    probj.nopstatus,
                    probj.vtype,
                    probj.isRideBookingDone,
                    probj.isRideOver,
                    probj.rideStatus,
                    bookingList[index].rideBookingKey,
                    bookingList[index].bookedbypassenger,
                    bookingList[index].travelnop,
                    bookingList[index].paidamount,
                    bookingList[index].bookingstatus,
                    bookingList[index].paymentstatus
                );
                bookingObjList[bookListIndex] = obj;
                bookListIndex++;
            }
            index++;
        }
        
        return (bookingObjList, bookListIndex);
    }
    
    // Update booking status (approve/reject)
    function rideBookingStatusUpdate(uint rbid, uint action) public bookingExists(rbid) {
        uint searchindex = rbid - 1;
        RideBooking storage booking = bookingList[searchindex];
        uint rideindex = booking.rideKey - 1;
        PublishRide storage ride = publishRideList[rideindex];
        
        // Only the ride creator can update booking status
        require(ride.hashcodeaddress == msg.sender, "Only ride creator can update booking status");
        
        if(action == 1) {
            booking.bookingstatus = true;
        } else {
            booking.bookingstatus = false;
            
            // If rejected, free up the seats
            ride.nopstatus = ride.nopstatus - booking.travelnop;
            if(ride.isRideBookingDone) {
                ride.isRideBookingDone = false;
            }
        }
        
        emit BookingStatusUpdated(rbid, booking.bookingstatus);
    }
    
    // Process ride payment
    function ridepaymentupdates(uint rbid) public bookingExists(rbid) {
        uint searchindex = rbid - 1;
        RideBooking storage booking = bookingList[searchindex];
        
        // Only passenger who booked can pay
        require(booking.bookedbypassenger == msg.sender, "Only booking owner can process payment");
        // Booking must be approved
        require(booking.bookingstatus == true, "Booking must be approved before payment");
        // Payment should not be already processed
        require(booking.paymentstatus == false, "Payment already processed");
        
        booking.paymentstatus = true;
        
        emit PaymentProcessed(rbid, booking.paidamount);
    }
    
    // Mark ride as completed
    function completeRide(uint rideId) public rideExists(rideId) {
        uint searchindex = rideId - 1;
        PublishRide storage ride = publishRideList[searchindex];
        
        // Only ride creator can mark as complete
        require(ride.hashcodeaddress == msg.sender, "Only ride creator can complete ride");
        // Ride must be active
        require(ride.rideStatus == true, "Ride must be active to complete");
        // Ride should not be already completed
        require(ride.isRideOver == false, "Ride already completed");
        
        ride.isRideOver = true;
    }
    
    // Get total number of users
    function getTotalUsers() public view returns (uint) {
        return userindex;
    }
    
    // Get total number of rides
    function getTotalRides() public view returns (uint) {
        return rideindex;
    }
    
    // Get total number of bookings
    function getTotalBookings() public view returns (uint) {
        return bookingindex;
    }
}