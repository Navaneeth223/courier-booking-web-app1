import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { toast } from 'react-toastify'
import './Settings.css'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true
  })

  const handleNotificationChange = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    })
    toast.success('Notification settings updated!')
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-card">
        <h2>Appearance</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">Dark Mode</span>
            <span className="setting-desc">Currently using {theme} mode</span>
          </div>
          <button 
            className="toggle-btn" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h2>Notifications</h2>
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">Email Notifications</span>
            <span className="setting-desc">Receive updates via email</span>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.email}
            onChange={() => handleNotificationChange('email')}
            className="toggle-checkbox"
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">SMS Notifications</span>
            <span className="setting-desc">Receive updates via SMS</span>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.sms}
            onChange={() => handleNotificationChange('sms')}
            className="toggle-checkbox"
          />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-label">Push Notifications</span>
            <span className="setting-desc">Receive push notifications</span>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.push}
            onChange={() => handleNotificationChange('push')}
            className="toggle-checkbox"
          />
        </div>
      </div>

      <div className="settings-card">
        <h2>About</h2>
        <p>CourierHub v1.0</p>
        <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
          Enterprise Logistics Management System
        </p>
      </div>
    </div>
  )
}