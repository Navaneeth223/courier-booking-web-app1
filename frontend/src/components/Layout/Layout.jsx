import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { toast } from 'react-toastify'
import '../Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

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

  const isAdmin = user?.role === 'admin' || user?.accountType === 'business'

  return (
    <div className={`main-layout ${theme}-theme`}>
      <header className="header">
        <div className="header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="header-title"><h2>CourierHub</h2></div>
        </div>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="user-profile">
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Sign Out</button>
          </div>
        </div>
      </header>
      
      <div className="layout-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h4>MAIN</h4>
              {MENU_ITEMS.map(item => (
                <Link key={item.path} to={item.path} className="nav-item">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </div>
            {isAdmin && (
              <div className="nav-section">
                <h4>ADMIN</h4>
                {ADMIN_ITEMS.map(item => (
                  <Link key={item.path} to={item.path} className="nav-item">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </aside>
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
