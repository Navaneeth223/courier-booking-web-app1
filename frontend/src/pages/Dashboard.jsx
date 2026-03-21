import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0, pending: 0, inTransit: 0, delivered: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/bookings')
      if (response.data.success) {
        const bookings = response.data.bookings || []
        setStats({
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          inTransit: bookings.filter(b => b.status === 'in_transit').length,
          delivered: bookings.filter(b => b.status === 'delivered').length
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your courier management system</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card stat-transit">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.inTransit}</div>
            <div className="stat-label">In Transit</div>
          </div>
        </div>

        <div className="stat-card stat-delivered">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.delivered}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/book')}>
            <span className="action-icon">➕</span>
            <span>Create Booking</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/bookings')}>
            <span className="action-icon">📋</span>
            <span>View Bookings</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/track')}>
            <span className="action-icon">🗺️</span>
            <span>Track Shipment</span>
          </button>
        </div>
      </div>
    </div>
  )
}
