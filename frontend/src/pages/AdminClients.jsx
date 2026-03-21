import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'
import './Admin.css'

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await api.get('/auth/users')
      if (response.data.success) {
        setClients(response.data.users || [])
      }
    } catch (error) {
      // Fallback: show registered users
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Client Management</h1>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone || 'N/A'}</td>
                  <td>{client.accountType}</td>
                  <td><span className="badge-active">Active</span></td>
                  <td>
                    <button className="btn-action" onClick={() => toast.info('View client details')}>
                      View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No clients yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}