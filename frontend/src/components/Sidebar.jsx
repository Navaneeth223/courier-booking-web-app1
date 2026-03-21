import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const MENU_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'New Booking', path: '/book', icon: '📝' },
  { label: 'My Bookings', path: '/bookings', icon: '📋' },
  { label: 'Track Shipment', path: '/track', icon: '🗺️' },
]

const ADMIN_ITEMS = [
  { label: 'Orders', path: '/admin/orders', icon: '📦' },
  { label: 'Clients', path: '/admin/clients', icon: '👥' },
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📈' },
]

export default function Sidebar({ isOpen }) {
  const location = useLocation()
  const { user } = useAuth()
  const isAdmin = user?.accountType === 'business' || user?.role === 'admin'

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span>📦</span>
            <span>Courier Hub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4>MAIN</h4>
            {MENU_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>

          {isAdmin && (
            <div className="nav-section">
              <h4>ADMIN</h4>
              {ADMIN_ITEMS.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <p>© 2026 CourierHub</p>
        </div>
      </div>
    </aside>
  )
}
