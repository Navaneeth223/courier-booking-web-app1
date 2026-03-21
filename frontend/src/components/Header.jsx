import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import './Layout.css'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <div className="header-title">
          <h2>Dashboard</h2>
        </div>
      </div>

      <div className="header-right">
        <div className="user-menu">
          <button 
            className="user-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="user-avatar">{user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}</span>
            <div className="user-info">
              <span className="user-name">{user?.fullName || user?.name}</span>
              <span className="user-role">{user?.accountType}</span>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="#profile">Profile</a>
              <a href="#settings">Settings</a>
              <button onClick={handleLogout} className="logout-btn">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
