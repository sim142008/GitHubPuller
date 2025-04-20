import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" role="status" variant="primary" className="mb-3">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="text-center">{text}</p>
    </Container>
  );
};

export default LoadingSpinner;