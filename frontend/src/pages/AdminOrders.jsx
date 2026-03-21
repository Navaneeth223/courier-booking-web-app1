import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'
import './Admin.css'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/bookings')
      if (response.data.success) {
        setOrders(response.data.bookings || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const response = await api.put(`/bookings/${id}`, { status })
      if (response.data.success) {
        toast.success('Status updated!')
        fetchOrders()
      }
    } catch (error) {
      toast.error('Error updating status')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Order Management</h1>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Receiver</th>
                <th>Sender</th>
                <th>Status</th>
                <th>Weight</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.bookingId || 'N/A'}</td>
                  <td>{order.receiverName}</td>
                  <td>{order.senderName}</td>
                  <td>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`status-select status-${order.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td>{order.weight} kg</td>
                  <td>
                    <button className="btn-action" onClick={() => toast.info('View details')}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}