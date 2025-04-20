import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ConnectionStatus from './components/ConnectionStatus';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublishRide from './pages/PublishRide';
import SearchRides from './pages/SearchRides';
import MyRides from './pages/MyRides';
import RideDetails from './pages/RideDetails';
import MyBookings from './pages/MyBookings';

// Utils
import { Web3Provider } from './utils/Web3Context';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isConnected || !userAddress) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Web3Provider>
      <div className="app">
        <Header userAddress={userAddress} isConnected={isConnected} />
        <ConnectionStatus />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Login 
                  setIsConnected={setIsConnected} 
                  setUserAddress={setUserAddress}
                  setUserDetails={setUserDetails}
                />
              } 
            />
            <Route 
              path="/register" 
              element={
                <Register 
                  setIsConnected={setIsConnected} 
                  setUserAddress={setUserAddress}
                  setUserDetails={setUserDetails}
                />
              } 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard userDetails={userDetails} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/publish-ride"
              element={
                <ProtectedRoute>
                  <PublishRide userAddress={userAddress} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-rides"
              element={
                <ProtectedRoute>
                  <SearchRides userAddress={userAddress} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rides"
              element={
                <ProtectedRoute>
                  <MyRides userAddress={userAddress} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ride/:id"
              element={
                <ProtectedRoute>
                  <RideDetails userAddress={userAddress} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings userAddress={userAddress} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Web3Provider>
  );
}

export default App;