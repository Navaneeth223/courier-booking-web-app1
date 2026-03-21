import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Common/Layout';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import BookingForm from './components/Booking/BookingForm';
import OrderHistory from './pages/OrderHistory';
import TrackingPage from './pages/TrackingPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientManagement from './pages/ClientManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            {/* Add more protected routes here */}
            <Route
              path="/book"
              element={
                <Layout>
                  <BookingForm />
                </Layout>
              }
            />
            <Route
              path="/bookings"
              element={
                <Layout>
                  <OrderHistory />
                </Layout>
              }
            />
            <Route
              path="/track"
              element={
                <Layout>
                  <TrackingPage />
                </Layout>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <Layout>
                  <ClientManagement />
                </Layout>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
