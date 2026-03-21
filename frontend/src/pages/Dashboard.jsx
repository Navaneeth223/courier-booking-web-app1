import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await api.get('/bookings')
      if (response.data.success) {
        const bookings = response.data.bookings || response.data.data || []
        setStats({
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          inTransit: bookings.filter(b => b.status === 'in_transit').length,
          delivered: bookings.filter(b => b.status === 'delivered').length
        })
        setRecentBookings(bookings.slice(0, 5))
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon, label, value }) => (
    <div className="stat-card glass p-6 flex items-center gap-4 transition-transform hover:scale-105" style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '1rem', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
      <div className="stat-icon text-3xl">{icon}</div>
      <div className="stat-content">
        <div className="stat-value text-2xl font-bold">{value}</div>
        <div className="stat-label text-sm text-text-tertiary">{label}</div>
      </div>
    </div>
  )

  return (
    <div className="dashboard-page fade-in space-y-8">
      <div className="page-header mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome to your courier management system</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="📦" label="Total Bookings" value={stats.total} />
        <StatCard icon="⏳" label="Pending" value={stats.pending} />
        <StatCard icon="🚚" label="In Transit" value={stats.inTransit} />
        <StatCard icon="✅" label="Delivered" value={stats.delivered} />
      </div>

      {/* Quick Actions */}
      <div className="section mt-10">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="actions-grid grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button className="action-btn glass p-6 flex flex-col items-center gap-2 hover:bg-accent-primary/20 transition-colors" onClick={() => navigate('/book')}>
            <span className="text-2xl">📝</span> Create Booking
          </button>
          <button className="action-btn glass p-6 flex flex-col items-center gap-2 hover:bg-accent-primary/20 transition-colors" onClick={() => navigate('/bookings')}>
            <span className="text-2xl">📋</span> View Bookings
          </button>
          <button className="action-btn glass p-6 flex flex-col items-center gap-2 hover:bg-accent-primary/20 transition-colors" onClick={() => navigate('/track')}>
            <span className="text-2xl">🗺️</span> Track Shipment
          </button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="section mt-10">
        <h2 className="text-xl font-semibold mb-6">Recent Bookings</h2>
        {recentBookings.length > 0 ? (
          <div className="bookings-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBookings.map(booking => (
              <div key={booking._id} className="booking-card glass p-6 border-l-4 border-accent-primary">
                <div className="booking-header flex justify-between items-start mb-4">
                  <h4 className="font-bold">{booking.bookingId}</h4>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="booking-receiver text-sm font-medium mb-1">{booking.receiverName}</p>
                <p className="booking-address text-xs text-text-tertiary truncate">{booking.receiverAddress}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state glass p-10 text-center">
            <p className="text-text-secondary mb-4">No bookings yet</p>
            <button className="btn-primary" style={{ background: 'var(--accent-primary)', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: '600' }} onClick={() => navigate('/book')}>
              Create Your First Booking
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .stats-grid { 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
        }
        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
      `}</style>
    </div>
  )
}
