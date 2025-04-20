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
  if (['connecting', 'error', 'processing', 'disconnected'].includes(connectionStatus.status)) {
    return (
      <Alert 
        variant={getStatusVariant(connectionStatus.status)} 
        className="text-center mb-4"
      >
        {connectionStatus.message}
        {connectionStatus.status === 'error' && connectionStatus.message.includes('No Ethereum wallet') && (
          <div className="mt-2">
            <p>To use this application, you need a Web3 wallet like MetaMask.</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              Install MetaMask
            </a>
          </div>
        )}
      </Alert>
    );
  }

  return null;
};

export default ConnectionStatus;