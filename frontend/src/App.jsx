import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/theme.css'

import { AuthProvider, useAuth } from './context/AuthContext'
import ThemeProvider from './context/ThemeContext'
import Layout from './components/Layout/Layout'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import BookingForm from './pages/BookingForm'
import BookingList from './pages/BookingList'
import TrackingPage from './pages/TrackingPage'
import AdminOrders from './pages/AdminOrders'
import AdminClients from './pages/AdminClients'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function ProtectedComponent({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="loading-screen">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedComponent><Layout /></ProtectedComponent>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="book" element={<BookingForm />} />
              <Route path="bookings" element={<BookingList />} />
              <Route path="track" element={<TrackingPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              
              <Route path="admin/orders" element={<AdminOrders />} />
              <Route path="admin/clients" element={<AdminClients />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer theme="dark" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
