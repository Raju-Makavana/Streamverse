import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import AuthDialog from './AuthDialog';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If user is not authenticated and not loading, show the dialog
    if (!isAuthenticated && !loading) {
      setShowAuthDialog(true);
    }
  }, [isAuthenticated, loading]);

  const handleClose = () => {
    setShowAuthDialog(false);
  };

  // While authentication state is loading, return null or a loading indicator
  if (loading) {
    return null;
  }

  // If authenticated, render the protected content
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, show the dialog and also prepare to redirect if dialog is closed
  return (
    <>
      <AuthDialog 
        open={showAuthDialog} 
        onClose={handleClose}
        title="Authentication Required"
        message="You need to be logged in to access this page."
      />
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
};

export default ProtectedRoute; 