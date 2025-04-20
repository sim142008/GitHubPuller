import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const RideDetails = ({ userAddress }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, searchView, bookRide, RideNOPStatus } = useWeb3();
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [ride, setRide] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [bookingData, setBookingData] = useState({
    seats: 1
  });

  // Load ride details
  useEffect(() => {
    const loadRideDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Call the contract to get ride details
        const rideDetails = await searchView(id);
        
        if (!rideDetails) {
          setError('Failed to load ride details');
          return;
        }
        
        // Format the ride data
        const formattedRide = {
          id: id,
          driver: rideDetails[0],
          from: rideDetails[1],
          to: rideDetails[2],
          date: rideDetails[3],
          time: rideDetails[4],
          amount: rideDetails[5],
          seats: rideDetails[6],
          nopstatus: rideDetails[7],
          vehicleType: rideDetails[8],
          isRideBookingDone: rideDetails[9],
          isRideOver: rideDetails[10],
          rideStatus: rideDetails[11]
        };
        
        setRide(formattedRide);
      } catch (error) {
        console.error('Error loading ride details:', error);
        setError('An error occurred while loading ride details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRideDetails();
    }
  }, [id, searchView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prevData => ({
      ...prevData,
      [name]: parseInt(value)
    }));
  };

  const handleBookRide = async () => {
    if (!ride) return;
    
    // Simple validation
    if (bookingData.seats <= 0) {
      setError('Please select at least 1 seat');
      return;
    }
    
    // Check if enough seats are available
    try {
      setBooking(true);
      setError('');
      
      const hasEnoughSeats = await RideNOPStatus(id, bookingData.seats);
      
      if (!hasEnoughSeats) {
        setError(`Not enough seats available. Only ${ride.seats - ride.nopstatus} seats left.`);
        setBooking(false);
        return;
      }
      
      // Calculate total amount
      const totalAmount = (parseFloat(ride.amount) * bookingData.seats).toString();
      
      // Book the ride
      const { success, error: bookingError } = await bookRide(
        id,
        bookingData.seats,
        totalAmount
      );
      
      if (!success) {
        setError(bookingError || 'Failed to book ride');
        return;
      }
      
      setSuccess('Ride booked successfully! Redirecting to your bookings...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (error) {
      console.error('Error booking ride:', error);
      setError('An error occurred while booking this ride');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading ride details..." />;
  }

  if (!ride) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Ride not found or has been removed
        </Alert>
        <Button variant="primary" onClick={() => navigate('/search-rides')}>
          Back to Search
        </Button>
      </Container>
    );
  }

  // Check if this is the user's own ride
  const isUserRide = ride.driver.toLowerCase() === account.toLowerCase();
  // Check if the ride is available for booking
  const isAvailable = ride.rideStatus && !ride.isRideBookingDone && !ride.isRideOver;
  // Calculate available seats
  const availableSeats = ride.seats - ride.nopstatus;

  return (
    <Container>
      <h2 className="mb-4">Ride Details</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 className="mb-1">{ride.from} to {ride.to}</h3>
                  <p className="text-muted mb-0">
                    {ride.date} at {ride.time}
                  </p>
                </div>
                <div>
                  {ride.isRideOver ? (
                    <Badge bg="secondary">Completed</Badge>
                  ) : !ride.rideStatus ? (
                    <Badge bg="danger">Cancelled</Badge>
                  ) : ride.isRideBookingDone ? (
                    <Badge bg="warning">Fully Booked</Badge>
                  ) : (
                    <Badge bg="success">Available</Badge>
                  )}
                </div>
              </div>
              
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="px-0">
                  <Row>
                    <Col sm={4}>
                      <strong>Price per Seat:</strong>
                    </Col>
                    <Col sm={8}>
                      {ride.amount} ETH
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Row>
                    <Col sm={4}>
                      <strong>Available Seats:</strong>
                    </Col>
                    <Col sm={8}>
                      {availableSeats} of {ride.seats}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Row>
                    <Col sm={4}>
                      <strong>Vehicle Type:</strong>
                    </Col>
                    <Col sm={8}>
                      {ride.vehicleType}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Row>
                    <Col sm={4}>
                      <strong>Driver:</strong>
                    </Col>
                    <Col sm={8}>
                      {isUserRide ? 'You' : ride.driver.substring(0, 6) + '...' + ride.driver.substring(ride.driver.length - 4)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              
              {!isUserRide && isAvailable && (
                <div className="border-top pt-3">
                  <h5>Book This Ride</h5>
                  <Form className="mt-3">
                    <Row className="align-items-end">
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Group>
                          <Form.Label>Number of Seats</Form.Label>
                          <Form.Control
                            as="select"
                            name="seats"
                            value={bookingData.seats}
                            onChange={handleChange}
                            disabled={booking}
                          >
                            {[...Array(availableSeats)].map((_, index) => (
                              <option key={index + 1} value={index + 1}>
                                {index + 1} {index === 0 ? 'seat' : 'seats'} - {((index + 1) * parseFloat(ride.amount)).toFixed(3)} ETH
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Button 
                          variant="primary" 
                          className="w-100"
                          onClick={handleBookRide}
                          disabled={booking || availableSeats === 0}
                        >
                          {booking ? 'Processing...' : 'Book Now'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
              
              {isUserRide && (
                <div className="border-top pt-3">
                  <Alert variant="info">
                    This is your ride. You can manage it from the "My Rides" section.
                  </Alert>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/my-rides')}
                  >
                    Go to My Rides
                  </Button>
                </div>
              )}
              
              {!isAvailable && !isUserRide && (
                <div className="border-top pt-3">
                  <Alert variant="warning">
                    This ride is not available for booking at the moment.
                  </Alert>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/search-rides')}
                  >
                    Search Other Rides
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Booking Information</h5>
              <div className="mb-4">
                <p className="mb-1">
                  <strong>Total Cost:</strong>
                </p>
                <h3 className="text-primary">
                  {(bookingData.seats * parseFloat(ride.amount)).toFixed(3)} ETH
                </h3>
                <small className="text-muted">
                  for {bookingData.seats} {bookingData.seats === 1 ? 'seat' : 'seats'}
                </small>
              </div>
              
              <div className="mb-3">
                <h6>How Booking Works:</h6>
                <ol className="small">
                  <li>Request the number of seats you need</li>
                  <li>Driver will approve or reject your request</li>
                  <li>If approved, payment will be processed on the blockchain</li>
                  <li>After the ride, funds are transferred to the driver</li>
                </ol>
              </div>
              
              <div className="border-top pt-3 mt-3">
                <h6>Cancellation Policy:</h6>
                <p className="small mb-0">
                  Cancellations made more than 24 hours before the ride are fully refunded. 
                  Later cancellations may incur a fee as per the smart contract terms.
                </p>
              </div>
            </Card.Body>
          </Card>
          
          <Button 
            variant="outline-secondary" 
            className="w-100"
            onClick={() => navigate('/search-rides')}
          >
            Back to Search Results
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RideDetails;