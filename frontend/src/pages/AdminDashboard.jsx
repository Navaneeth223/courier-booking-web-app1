import { useState, useEffect } from 'react'
import api from '../services/api'
import './Admin.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    pendingOrders: 0,
    deliveredToday: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const bookingsRes = await api.get('/bookings')
      const bookings = bookingsRes.data.bookings || []

      setStats({
        totalBookings: bookings.length,
        totalUsers: 0,
        pendingOrders: bookings.filter(b => b.status === 'pending').length,
        deliveredToday: bookings.filter(b => b.status === 'delivered').length
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>System Overview</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingOrders}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.deliveredToday}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Quick Stats</h2>
        <div className="quick-stats">
          <div className="quick-stat">
            <span>Average Delivery Time:</span>
            <strong>2-3 days</strong>
          </div>
          <div className="quick-stat">
            <span>On-Time Delivery Rate:</span>
            <strong>98%</strong>
          </div>
          <div className="quick-stat">
            <span>Customer Satisfaction:</span>
            <strong>4.8/5</strong>
          </div>
        </div>
      </div>
    </div>
  )
}