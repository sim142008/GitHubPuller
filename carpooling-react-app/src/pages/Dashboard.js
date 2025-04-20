import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = ({ userDetails }) => {
  const { account, getMyRides, getMyBookings, getPlatformStats } = useWeb3();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRides: 0,
    totalBookings: 0,
    totalAmountTransacted: 0
  });
  const [myRides, setMyRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get platform stats
        const { success: statsSuccess, stats: platformStats } = await getPlatformStats();
        if (statsSuccess) {
          setStats(platformStats);
        }
        
        // Get user's rides
        const { success: ridesSuccess, rides } = await getMyRides();
        if (ridesSuccess) {
          // Get most recent rides (up to 3)
          setMyRides(rides.slice(0, 3));
        }
        
        // Get user's bookings
        const { success: bookingsSuccess, bookings } = await getMyBookings();
        if (bookingsSuccess) {
          // Get most recent bookings (up to 3)
          setMyBookings(bookings.slice(0, 3));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      loadDashboardData();
    }
  }, [account, getMyRides, getMyBookings, getPlatformStats]);

  const getRideStatusBadge = (status, isOver) => {
    if (isOver) return <Badge bg="secondary">Completed</Badge>;
    if (!status) return <Badge bg="danger">Cancelled</Badge>;
    return <Badge bg="success">Active</Badge>;
  };

  const getBookingStatusBadge = (status, payment) => {
    if (payment) return <Badge bg="info">Paid</Badge>;
    if (status) return <Badge bg="success">Approved</Badge>;
    return <Badge bg="warning">Pending</Badge>;
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Welcome, {userDetails?.username || 'User'}</h2>
          <p className="text-muted">
            Your TukTukGo blockchain carpooling dashboard
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3 mb-md-0">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h3 className="display-4">{stats.totalUsers}</h3>
              <Card.Title>Total Users</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3 mb-md-0">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h3 className="display-4">{stats.totalRides}</h3>
              <Card.Title>Total Rides</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3 mb-md-0">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h3 className="display-4">{stats.totalBookings}</h3>
              <Card.Title>Total Bookings</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <h3 className="display-4">{parseFloat(stats.totalAmountTransacted).toFixed(2)} ETH</h3>
              <Card.Title>Total Amount</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Recent Rides</h5>
              <Link to="/my-rides">
                <Button variant="outline-primary" size="sm">View All</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {myRides.length > 0 ? (
                <ListGroup variant="flush">
                  {myRides.map(ride => (
                    <ListGroup.Item key={ride.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{ride.from} to {ride.to}</strong>
                        <div className="text-muted small">
                          {ride.date} at {ride.time} • {ride.seats} seats • {ride.amount} ETH
                        </div>
                      </div>
                      <div>
                        {getRideStatusBadge(ride.status, ride.isOver)}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
        </Col>
        
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Recent Bookings</h5>
              <Link to="/my-bookings">
                <Button variant="outline-primary" size="sm">View All</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {myBookings.length > 0 ? (
                <ListGroup variant="flush">
                  {myBookings.map(booking => (
                    <ListGroup.Item key={booking.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Ride #{booking.rideId}</strong>
                        <div className="text-muted small">
                          {booking.seats} seats • {booking.amount} ETH
                        </div>
                      </div>
                      <div>
                        {getBookingStatusBadge(booking.status, booking.payment)}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Quick Actions</h5>
              <Row className="mt-3">
                <Col sm={6} md={3} className="mb-3">
                  <Link to="/publish-ride" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100 py-3">
                      <i className="bi bi-plus-circle mb-2"></i>
                      <div>Publish Ride</div>
                    </Button>
                  </Link>
                </Col>
                <Col sm={6} md={3} className="mb-3">
                  <Link to="/search-rides" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100 py-3">
                      <i className="bi bi-search mb-2"></i>
                      <div>Find Ride</div>
                    </Button>
                  </Link>
                </Col>
                <Col sm={6} md={3} className="mb-3">
                  <Link to="/my-rides" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100 py-3">
                      <i className="bi bi-car-front mb-2"></i>
                      <div>My Rides</div>
                    </Button>
                  </Link>
                </Col>
                <Col sm={6} md={3} className="mb-3">
                  <Link to="/my-bookings" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100 py-3">
                      <i className="bi bi-calendar-check mb-2"></i>
                      <div>My Bookings</div>
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;