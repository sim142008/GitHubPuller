import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useWeb3 } from '../utils/Web3Context';

const Header = ({ userAddress, isConnected }) => {
  const navigate = useNavigate();
  const { initWeb3 } = useWeb3();

  const connectWallet = async () => {
    const success = await initWeb3();
    if (success) {
      navigate('/dashboard');
    }
  };

  // Format the address to be more readable
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/logo.png"
            alt="TukTukGo Logo"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          TukTukGo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isConnected && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/publish-ride">Publish Ride</Nav.Link>
                <Nav.Link as={Link} to="/search-rides">Search Rides</Nav.Link>
                <Nav.Link as={Link} to="/my-rides">My Rides</Nav.Link>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isConnected ? (
              <Navbar.Text className="me-2">
                Connected: <span className="text-success fw-bold">{formatAddress(userAddress)}</span>
              </Navbar.Text>
            ) : (
              <Button variant="outline-primary" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;