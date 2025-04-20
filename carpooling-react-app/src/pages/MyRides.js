import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const MyRides = () => {
  const { getMyRides, cancelRide, activateRide, completeRide, getBookingsForMyRides } = useWeb3();
  
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingRideId, setProcessingRideId] = useState(null);
  
  // Modal state
  const [showRideModal, setShowRideModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedRideBookings, setSelectedRideBookings] = useState([]);
  
  // Load user's rides
  useEffect(() => {
    const loadMyRides = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user's rides
        const { success: ridesSuccess, rides: myRides, error: ridesError } = await getMyRides();
        
        if (!ridesSuccess) {
          setError(ridesError || 'Failed to load your rides');
          return;
        }
        
        setRides(myRides || []);
        
        // Get bookings for all rides
        const { success: bookingsSuccess, bookings: rideBookings } = await getBookingsForMyRides();
        
        if (bookingsSuccess) {
          setBookings(rideBookings || []);
        }
      } catch (error) {
        console.error('Error loading rides:', error);
        setError('An error occurred while loading your rides');
      } finally {
        setLoading(false);
      }
    };

    loadMyRides();
  }, [getMyRides, getBookingsForMyRides]);

  // Handle ride cancellation
  const handleCancelRide = async (rideId) => {
    try {
      setProcessingRideId(rideId);
      setError('');
      setSuccess('');
      
      const { success, error: cancelError } = await cancelRide(rideId);
      
      if (!success) {
        setError(cancelError || `Failed to cancel ride #${rideId}`);
        return;
      }
      
      setSuccess(`Ride #${rideId} cancelled successfully`);
      
      // Update the ride in the state
      setRides(prevRides => 
        prevRides.map(ride => 
          ride.id === rideId ? { ...ride, status: false } : ride
        )
      );
      
      // Close modal if open
      setShowRideModal(false);
    } catch (error) {
      console.error('Error cancelling ride:', error);
      setError('An error occurred while cancelling the ride');
    } finally {
      setProcessingRideId(null);
    }
  };

  // Handle ride activation
  const handleActivateRide = async (rideId) => {
    try {
      setProcessingRideId(rideId);
      setError('');
      setSuccess('');
      
      const { success, error: activateError } = await activateRide(rideId);
      
      if (!success) {
        setError(activateError || `Failed to activate ride #${rideId}`);
        return;
      }
      
      setSuccess(`Ride #${rideId} activated successfully`);
      
      // Update the ride in the state
      setRides(prevRides => 
        prevRides.map(ride => 
          ride.id === rideId ? { ...ride, status: true } : ride
        )
      );
      
      // Close modal if open
      setShowRideModal(false);
    } catch (error) {
      console.error('Error activating ride:', error);
      setError('An error occurred while activating the ride');
    } finally {
      setProcessingRideId(null);
    }
  };

  // Handle ride completion
  const handleCompleteRide = async (rideId) => {
    try {
      setProcessingRideId(rideId);
      setError('');
      setSuccess('');
      
      const { success, error: completeError } = await completeRide(rideId);
      
      if (!success) {
        setError(completeError || `Failed to complete ride #${rideId}`);
        return;
      }
      
      setSuccess(`Ride #${rideId} marked as completed`);
      
      // Update the ride in the state
      setRides(prevRides => 
        prevRides.map(ride => 
          ride.id === rideId ? { ...ride, isOver: true } : ride
        )
      );
      
      // Close modal if open
      setShowRideModal(false);
    } catch (error) {
      console.error('Error completing ride:', error);
      setError('An error occurred while completing the ride');
    } finally {
      setProcessingRideId(null);
    }
  };

  // Open ride details modal
  const openRideDetails = (ride) => {
    setSelectedRide(ride);
    setShowRideModal(true);
  };

  // Open bookings modal
  const openBookings = (rideId) => {
    // Filter bookings for the selected ride
    const rideBookings = bookings.filter(booking => booking.rideId === rideId);
    setSelectedRideBookings(rideBookings);
    setShowBookingsModal(true);
  };

  // Get ride status badge
  const getRideStatusBadge = (status, isOver) => {
    if (isOver) return <Badge bg="secondary">Completed</Badge>;
    if (!status) return <Badge bg="danger">Cancelled</Badge>;
    return <Badge bg="success">Active</Badge>;
  };

  // Get booking status badge
  const getBookingStatusBadge = (status, payment) => {
    if (payment) return <Badge bg="info">Paid</Badge>;
    if (status) return <Badge bg="success">Approved</Badge>;
    return <Badge bg="warning">Pending</Badge>;
  };

  // Count bookings for a ride
  const countRideBookings = (rideId) => {
    return bookings.filter(booking => booking.rideId === rideId).length;
  };

  if (loading) {
    return <LoadingSpinner text="Loading your rides..." />;
  }

  return (
    <Container>
      <h2 className="mb-4">My Rides</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Rides You've Published</h5>
            <Link to="/publish-ride">
              <Button variant="primary" size="sm">
                Publish New Ride
              </Button>
            </Link>
          </div>
          
          {rides.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Bookings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map(ride => (
                    <tr key={ride.id}>
                      <td>{ride.id}</td>
                      <td>{ride.from}</td>
                      <td>{ride.to}</td>
                      <td>{ride.date}</td>
                      <td>{ride.time}</td>
                      <td>{ride.amount} ETH</td>
                      <td>
                        {ride.nopstatus}/{ride.seats}
                      </td>
                      <td>
                        {getRideStatusBadge(ride.status, ride.isOver)}
                      </td>
                      <td>
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => openBookings(ride.id)}
                          disabled={countRideBookings(ride.id) === 0}
                        >
                          {countRideBookings(ride.id)}
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => openRideDetails(ride)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>You haven't published any rides yet.</p>
              <Link to="/publish-ride">
                <Button variant="primary">Publish a Ride</Button>
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Ride Details Modal */}
      <Modal show={showRideModal} onHide={() => setShowRideModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ride Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRide && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>{selectedRide.from} to {selectedRide.to}</h5>
                  <p className="text-muted">
                    {selectedRide.date} at {selectedRide.time}
                  </p>
                </Col>
                <Col md={6} className="text-md-end">
                  <h5>{selectedRide.amount} ETH</h5>
                  <p className="mb-0">
                    {getRideStatusBadge(selectedRide.status, selectedRide.isOver)}
                  </p>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Vehicle Type:</strong> {selectedRide.vehicleType}
                </Col>
                <Col sm={6}>
                  <strong>Seats:</strong> {selectedRide.nopstatus}/{selectedRide.seats} booked
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                {!selectedRide.isOver && selectedRide.status && (
                  <Button
                    variant="danger"
                    onClick={() => handleCancelRide(selectedRide.id)}
                    disabled={processingRideId === selectedRide.id}
                  >
                    {processingRideId === selectedRide.id ? 'Cancelling...' : 'Cancel Ride'}
                  </Button>
                )}
                
                {!selectedRide.isOver && !selectedRide.status && (
                  <Button
                    variant="success"
                    onClick={() => handleActivateRide(selectedRide.id)}
                    disabled={processingRideId === selectedRide.id}
                  >
                    {processingRideId === selectedRide.id ? 'Activating...' : 'Activate Ride'}
                  </Button>
                )}
                
                {!selectedRide.isOver && selectedRide.status && (
                  <Button
                    variant="primary"
                    onClick={() => handleCompleteRide(selectedRide.id)}
                    disabled={processingRideId === selectedRide.id}
                  >
                    {processingRideId === selectedRide.id ? 'Completing...' : 'Mark as Completed'}
                  </Button>
                )}
                
                <Button
                  variant="outline-secondary"
                  onClick={() => openBookings(selectedRide.id)}
                >
                  View Bookings ({countRideBookings(selectedRide.id)})
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      
      {/* Bookings Modal */}
      <Modal show={showBookingsModal} onHide={() => setShowBookingsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ride Bookings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRideBookings.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedRideBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.passenger.substring(0, 6)}...{booking.passenger.substring(booking.passenger.length - 4)}</td>
                    <td>{booking.seats}</td>
                    <td>{booking.amount} ETH</td>
                    <td>{getBookingStatusBadge(booking.status, booking.payment)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center py-3">No bookings found for this ride.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyRides;