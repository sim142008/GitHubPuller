import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../utils/Web3Context';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = ({ setIsConnected, setUserAddress, setUserDetails }) => {
  const navigate = useNavigate();
  const { initWeb3, account, getUserDetails, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isConnected && account) {
      handleLogin();
    }
  }, [isConnected, account]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      const success = await initWeb3();
      
      if (!success) {
        setError('Failed to connect to wallet. Please make sure MetaMask is installed and unlocked.');
        setLoading(false);
        return;
      }
      
      // Login will be handled by the useEffect when account is updated
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      if (!account) {
        setError('No account connected');
        setLoading(false);
        return;
      }

      // Get user details from the contract
      const { success, user, error } = await getUserDetails(account);
      
      if (!success) {
        setError(error || 'Failed to retrieve user details');
        setLoading(false);
        return;
      }
      
      // Check if user is registered
      if (user && user.username && user.username !== 'Not Found') {
        // Save user state
        setIsConnected(true);
        setUserAddress(account);
        setUserDetails(user);
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // User is connected but not registered
        setIsConnected(true);
        setUserAddress(account);
        
        // Navigate to registration
        navigate('/register');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to blockchain..." />;
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="mb-0">Welcome to TukTukGo</h2>
                <p className="text-muted">Blockchain-based carpooling platform</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="d-grid gap-2 mb-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={connectWallet}
                  disabled={loading}
                >
                  Connect with MetaMask
                </Button>
                
                <div className="text-center mt-3">
                  <p className="mb-0">
                    New to TukTukGo? You'll be prompted to register after connecting.
                  </p>
                </div>
              </div>
              
              <div className="border-top pt-3">
                <h5>What is TukTukGo?</h5>
                <p>
                  TukTukGo is a decentralized carpooling platform that connects drivers with empty seats to passengers traveling the same direction. Built on blockchain technology, it provides secure, transparent, and trustless transactions.
                </p>
                
                <h5>How it works:</h5>
                <ol>
                  <li>Connect your Ethereum wallet</li>
                  <li>Register your profile</li>
                  <li>Search for rides or publish your own</li>
                  <li>Complete bookings on the blockchain</li>
                  <li>Pay and get paid automatically through smart contracts</li>
                </ol>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;