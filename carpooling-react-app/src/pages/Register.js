import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = ({ setIsConnected, setUserAddress, setUserDetails }) => {
  const navigate = useNavigate();
  const { registerUser, account, getUserDetails } = useWeb3();
  
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is already registered
  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!account) {
        navigate('/');
        return;
      }

      try {
        const { success, user } = await getUserDetails(account);
        
        if (success && user && user.username && user.username !== 'Not Found') {
          // User is already registered, redirect to dashboard
          setUserDetails(user);
          setIsConnected(true);
          setUserAddress(account);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking user registration:', error);
      } finally {
        setChecking(false);
      }
    };

    checkUserRegistration();
  }, [account, navigate, getUserDetails, setIsConnected, setUserAddress, setUserDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { success, error: registrationError } = await registerUser(
        formData.username,
        formData.phoneNumber,
        formData.email
      );
      
      if (!success) {
        setError(registrationError || 'Registration failed. Please try again.');
        return;
      }
      
      setSuccess('Registration successful! Redirecting to dashboard...');
      
      // Get user details after registration
      const { success: detailsSuccess, user } = await getUserDetails(account);
      
      if (detailsSuccess && user) {
        setUserDetails(user);
        setIsConnected(true);
        setUserAddress(account);
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <LoadingSpinner text="Checking registration status..." />;
  }

  if (loading) {
    return <LoadingSpinner text="Processing registration..." />;
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="mb-0">Register for TukTukGo</h2>
                <p className="text-muted">Complete your profile to start using the platform</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Wallet Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={account || 'Not connected'}
                    disabled
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    This is your Ethereum wallet address automatically detected from MetaMask
                  </Form.Text>
                </Form.Group>
                
                <div className="d-grid gap-2 mt-4">
                  <Button variant="primary" type="submit" disabled={loading || !account}>
                    Complete Registration
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    Back to Login
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

export default Register;