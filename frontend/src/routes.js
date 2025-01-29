import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TransferMarket from './pages/TransferMarket';
import NotFound from './pages/NotFound';
import Transaction from './pages/Transaction';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/transfer-market"
          element={
            <PrivateRoute>
              <TransferMarket />
            </PrivateRoute>
          }
        />
         <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transaction />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

  );
};

export default AppRoutes;
