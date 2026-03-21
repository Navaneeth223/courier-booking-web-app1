import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../services/api'
import './AuthPages.css'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: 'admin@courier.app',
    password: 'admin123',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Note: The guide uses api.post directly
      const response = await api.post('/auth/login', formData)
      
      if (response.data.success) {
        // Correctly handle the token and user data matching sendTokenResponse fix
        login(response.data.token, response.data.data)
        toast.success('Welcome back! 🎉')
        navigate('/dashboard')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(errorMsg)
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Animated Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="auth-container">
        {/* Left Section - Branding */}
        <div className="auth-left">
          <div className="brand-section">
            <div className="brand-icon">📦</div>
            <h1>CourierHub</h1>
            <p>Enterprise Logistics Management</p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Real-Time Tracking</h4>
                <p>Track shipments in real-time with live updates</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <div>
                <h4>Instant Notifications</h4>
                <p>Email, SMS, and push notifications for all updates</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h4>Advanced Analytics</h4>
                <p>Detailed insights and reporting dashboard</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div>
                <h4>Enterprise Security</h4>
                <p>Bank-level encryption and security protocols</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="auth-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="form-input"
                  />
                  <span className="input-icon">✉️</span>
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️🗨️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-footer">
                <label className="remember-me">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <Link to="#" className="forgot-link">Forgot password?</Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button className="btn-social">
                <span>🔗</span> Google
              </button>
              <button className="btn-social">
                <span>📘</span> Microsoft
              </button>
            </div>

            {/* Register Link */}
            <div className="register-link">
              <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
            </div>

            {/* Test Credentials */}
            <div className="test-box">
              <strong>🧪 Test Account</strong>
              <p>Email: admin@courier.app</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
