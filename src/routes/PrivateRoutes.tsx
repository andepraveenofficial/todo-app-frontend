import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';

const PrivateRoutes: React.FC = () => {
  //   const isLoggedIn = true;

  const { isLoggedIn } = useAuth(); // Get the logged-in state from context

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default PrivateRoutes;
