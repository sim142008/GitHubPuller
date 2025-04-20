import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
  const { getMyBookings, processPayment } = useWeb3();
  
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingBookingId, setProcessingBookingId] = useState(null);
  
  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Load user's bookings
  useEffect(() => {
    const loadMyBookings = async () => {
      try {
        setLoading(true);
        setError('');
        
        const { success: bookingsSuccess, bookings: myBookings, error: bookingsError } = await getMyBookings();
        
        if (!bookingsSuccess) {
          setError(bookingsError || 'Failed to load your bookings');
          return;
        }
        
        setBookings(myBookings || []);
      } catch (error) {
        console.error('Error loading bookings:', error);
        setError('An error occurred while loading your bookings');
      } finally {
        setLoading(false);
      }
    };

    loadMyBookings();
  }, [getMyBookings]);

  // Handle payment processing
  const handleProcessPayment = async (bookingId) => {
    try {
      setProcessingBookingId(bookingId);
      setError('');
      setSuccess('');
      
      const { success, error: paymentError } = await processPayment(bookingId);
      
      if (!success) {
        setError(paymentError || `Failed to process payment for booking #${bookingId}`);
        return;
      }
      
      setSuccess(`Payment for booking #${bookingId} processed successfully`);
      
      // Update the booking in the state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, payment: true } : booking
        )
      );
      
      // Close modal if open
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('An error occurred while processing the payment');
    } finally {
      setProcessingBookingId(null);
    }
  };

  // Open booking details modal
  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Get booking status badge
  const getBookingStatusBadge = (status, payment) => {
    if (payment) return <Badge bg="info">Paid</Badge>;
    if (status) return <Badge bg="success">Approved</Badge>;
    return <Badge bg="warning">Pending</Badge>;
  };

  if (loading) {
    return <LoadingSpinner text="Loading your bookings..." />;
  }

  return (
    <Container>
      <h2 className="mb-4">My Bookings</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Rides You've Booked</h5>
            <Link to="/search-rides">
              <Button variant="primary" size="sm">
                Find More Rides
              </Button>
            </Link>
          </div>
          
          {bookings.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Ride ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.rideId}</td>
                      <td>{booking.from}</td>
                      <td>{booking.to}</td>
                      <td>{booking.date}</td>
                      <td>{booking.seats}</td>
                      <td>{booking.amount} ETH</td>
                      <td>
                        {getBookingStatusBadge(booking.status, booking.payment)}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openBookingDetails(booking)}
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
              <p>You haven't booked any rides yet.</p>
              <Link to="/search-rides">
                <Button variant="primary">Find a Ride</Button>
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Booking Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Booking #{selectedBooking.id}</h5>
                  <p className="text-muted">
                    Ride #{selectedBooking.rideId}
                  </p>
                </Col>
                <Col md={6} className="text-md-end">
                  <h5>{selectedBooking.amount} ETH</h5>
                  <p className="mb-0">
                    {getBookingStatusBadge(selectedBooking.status, selectedBooking.payment)}
                  </p>
                </Col>
              </Row>
              
              <Card className="mb-3">
                <Card.Body>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <strong>From:</strong>
                    </Col>
                    <Col sm={8}>
                      {selectedBooking.from}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <strong>To:</strong>
                    </Col>
                    <Col sm={8}>
                      {selectedBooking.to}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <strong>Date & Time:</strong>
                    </Col>
                    <Col sm={8}>
                      {selectedBooking.date} at {selectedBooking.time}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <strong>Seats:</strong>
                    </Col>
                    <Col sm={8}>
                      {selectedBooking.seats}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <strong>Driver:</strong>
                    </Col>
                    <Col sm={8}>
                      {selectedBooking.driver && 
                        `${selectedBooking.driver.substring(0, 6)}...${selectedBooking.driver.substring(selectedBooking.driver.length - 4)}`
                      }
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <div className="d-flex justify-content-between">
                {selectedBooking.status && !selectedBooking.payment && (
                  <Button
                    variant="primary"
                    onClick={() => handleProcessPayment(selectedBooking.id)}
                    disabled={processingBookingId === selectedBooking.id}
                  >
                    {processingBookingId === selectedBooking.id ? 'Processing...' : 'Process Payment'}
                  </Button>
                )}
                
                <Link to={`/ride/${selectedBooking.rideId}`}>
                  <Button variant="outline-secondary">
                    View Ride Details
                  </Button>
                </Link>
              </div>
              
              {!selectedBooking.status && (
                <Alert variant="warning" className="mt-3">
                  This booking is still pending approval from the driver.
                </Alert>
              )}
              
              {selectedBooking.payment && (
                <Alert variant="success" className="mt-3">
                  Payment has been processed successfully.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyBookings;