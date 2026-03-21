import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import MainLayout from './components/MainLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

// Placeholder components (to be replaced)
import RegisterPage from './pages/RegisterPage'
import BookingForm from './pages/BookingForm'
import BookingList from './pages/BookingList'
import TrackingPage from './pages/TrackingPage'
import AdminOrders from './pages/AdminOrders'
import AdminClients from './pages/AdminClients'
import AdminDashboard from './pages/AdminDashboard'

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth()
  
  if (loading) return <div>Establishing Connection...</div>
  if (!authenticated) return <Navigate to="/login" />
  
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes nested in MainLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="book" element={<BookingForm />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="track" element={<TrackingPage />} />
          
          {/* Admin Routes */}
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/clients" element={<AdminClients />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
