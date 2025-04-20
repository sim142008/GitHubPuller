import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchRides = () => {
  const { getAvailableRides, searchRidesByLocation } = useWeb3();
  
  const [searchData, setSearchData] = useState({
    from: '',
    to: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');

  // Load all available rides on component mount
  useEffect(() => {
    const loadRides = async () => {
      try {
        setLoading(true);
        setError('');
        
        const { success, rides: availableRides, error: ridesError } = await getAvailableRides();
        
        if (!success) {
          setError(ridesError || 'Failed to load available rides');
          return;
        }
        
        setRides(availableRides || []);
      } catch (error) {
        console.error('Error loading rides:', error);
        setError('An error occurred while loading rides');
      } finally {
        setLoading(false);
      }
    };

    loadRides();
  }, [getAvailableRides]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchData.from.trim() && !searchData.to.trim()) {
      setError('Please enter at least one search location');
      return;
    }
    
    try {
      setSearching(true);
      setError('');
      
      const { success, rides: searchResults, error: searchError } = await searchRidesByLocation(
        searchData.from,
        searchData.to
      );
      
      if (!success) {
        setError(searchError || 'Search failed');
        return;
      }
      
      setRides(searchResults || []);
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred during search');
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchData({
      from: '',
      to: ''
    });
    
    try {
      setSearching(true);
      
      const { success, rides: availableRides } = await getAvailableRides();
      
      if (success) {
        setRides(availableRides || []);
      }
    } catch (error) {
      console.error('Error resetting search:', error);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading available rides..." />;
  }

  return (
    <Container>
      <h2 className="mb-4">Find a Ride</h2>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="text"
                    name="from"
                    value={searchData.from}
                    onChange={handleChange}
                    placeholder="Enter origin"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="text"
                    name="to"
                    value={searchData.to}
                    onChange={handleChange}
                    placeholder="Enter destination"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="me-2 flex-grow-1"
                  disabled={searching}
                >
                  Search
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={handleClearSearch}
                  disabled={searching}
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {searching ? (
        <LoadingSpinner text="Searching for rides..." />
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Available Rides</h5>
            
            {rides.length > 0 ? (
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Price</th>
                      <th>Seats</th>
                      <th>Vehicle</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rides.map(ride => (
                      <tr key={ride.id}>
                        <td>{ride.from}</td>
                        <td>{ride.to}</td>
                        <td>{ride.date}</td>
                        <td>{ride.time}</td>
                        <td>{ride.amount} ETH</td>
                        <td>
                          <Badge bg="info">
                            {ride.seats - ride.nopstatus}/{ride.seats} available
                          </Badge>
                        </td>
                        <td>{ride.vehicleType}</td>
                        <td>
                          <Link to={`/ride/${ride.id}`}>
                            <Button size="sm" variant="outline-primary">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p>No rides found matching your search criteria.</p>
                <p className="text-muted">Try searching with different locations or check back later.</p>
                <Link to="/publish-ride">
                  <Button variant="primary">Publish a Ride Instead</Button>
                </Link>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SearchRides;