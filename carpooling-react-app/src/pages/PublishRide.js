import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const PublishRide = () => {
  const navigate = useNavigate();
  const { publishRide } = useWeb3();
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    amount: '',
    seats: '',
    vehicleType: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.from.trim() || !formData.to.trim()) {
      setError('Origin and destination are required');
      return;
    }
    
    if (!formData.date || !formData.time) {
      setError('Date and time are required');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!formData.seats || parseInt(formData.seats) <= 0) {
      setError('Please enter a valid number of seats');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { success, error: publishError } = await publishRide(
        formData.from,
        formData.to,
        formData.date,
        formData.time,
        formData.amount,
        formData.seats,
        formData.vehicleType || 'Standard'
      );
      
      if (!success) {
        setError(publishError || 'Failed to publish ride. Please try again.');
        return;
      }
      
      setSuccess('Ride published successfully!');
      
      // Reset form
      setFormData({
        from: '',
        to: '',
        date: '',
        time: '',
        amount: '',
        seats: '',
        vehicleType: ''
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/my-rides');
      }, 2000);
    } catch (error) {
      console.error('Error publishing ride:', error);
      setError('An error occurred while publishing the ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Publishing ride..." />;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Publish a New Ride</h2>
                <p className="text-muted">Share your journey with others and offset your travel costs</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>From</Form.Label>
                      <Form.Control
                        type="text"
                        name="from"
                        value={formData.from}
                        onChange={handleChange}
                        placeholder="Starting location"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>To</Form.Label>
                      <Form.Control
                        type="text"
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        placeholder="Destination"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Price per Seat (ETH)</Form.Label>
                      <Form.Control
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.01"
                        step="0.001"
                        min="0.001"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Available Seats</Form.Label>
                      <Form.Control
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        placeholder="1"
                        min="1"
                        max="10"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Standard">Standard Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={loading}>
                    Publish Ride
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublishRide;