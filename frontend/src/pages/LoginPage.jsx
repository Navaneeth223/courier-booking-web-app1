import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import api from '../services/api'
import './Auth.css'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@courier.com')
  const [password, setPassword] = useState('admin123@password')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      console.log('Response:', response.data)
      
      if (response.data.success) {
        const result = login(response.data.token, response.data.user)
        console.log('Login result:', result)
        toast.success('Login successful! 🎉')
        
        // Force redirect after small delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 500)
      } else {
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </div>

      <div className="auth-container">
        <div className="auth-left">
          <div className="brand-section">
            <div className="brand-icon">📦</div>
            <h1>CourierHub</h1>
            <p>Enterprise Logistics</p>
          </div>
          <div className="features-list">
            <div className="feature">⚡ Real-Time Tracking</div>
            <div className="feature">🔔 Instant Notifications</div>
            <div className="feature">📊 Advanced Analytics</div>
            <div className="feature">🛡️ Enterprise Security</div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-login">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have account? <Link to="/register">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
