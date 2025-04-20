import React from 'react';
import { Alert } from 'react-bootstrap';
import { useWeb3 } from '../utils/Web3Context';

const ConnectionStatus = () => {
  const { connectionStatus } = useWeb3();

  if (!connectionStatus) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'info';
      case 'disconnected':
        return 'warning';
      case 'error':
        return 'danger';
      case 'processing':
        return 'primary';
      case 'success':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Only show if we have a relevant status
  if (['connecting', 'error', 'processing'].includes(connectionStatus.status)) {
    return (
      <Alert 
        variant={getStatusVariant(connectionStatus.status)} 
        className="text-center mb-4"
      >
        {connectionStatus.message}
      </Alert>
    );
  }

  return null;
};

export default ConnectionStatus;