import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes: React.FC = () => {
  //   const isLoggedIn = true;

  const token = localStorage.getItem('token');
  console.log(token);

  return token ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default PrivateRoutes;
