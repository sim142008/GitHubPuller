import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>TukTukGo</h5>
            <p className="text-muted">
              A blockchain-based carpooling platform that connects drivers and passengers securely and efficiently.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none">Home</a></li>
              <li><a href="/search-rides" className="text-decoration-none">Find a Ride</a></li>
              <li><a href="/publish-ride" className="text-decoration-none">Offer a Ride</a></li>
              <li><a href="/my-rides" className="text-decoration-none">My Rides</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect</h5>
            <ul className="list-unstyled">
              <li>Email: info@tuktukgo.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Follow us: @TukTukGo</li>
            </ul>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p className="mb-0">© {currentYear} TukTukGo. All rights reserved.</p>
            <p className="text-muted small mb-0">Powered by Ethereum Blockchain</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;