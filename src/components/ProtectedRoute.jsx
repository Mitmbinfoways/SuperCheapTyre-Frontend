import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const location = useLocation();

  useEffect(() => {
    // Listen for storage changes (in case of login/logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isLoggedIn) {
    // Redirect to login page while saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;