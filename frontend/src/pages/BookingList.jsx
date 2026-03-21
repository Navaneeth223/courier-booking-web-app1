import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './List.css'

export default function BookingList() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings')
      if (response.data.success) {
        setBookings(response.data.bookings || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>My Bookings</h1>
        <button className="btn-new" onClick={() => navigate('/book')}>
          ➕ New Booking
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings yet</p>
          <button onClick={() => navigate('/book')}>Create Your First Booking</button>
        </div>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Receiver</th>
                <th>Weight (kg)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingId || 'N/A'}</td>
                  <td>{booking.receiverName}</td>
                  <td>{booking.weight}</td>
                  <td><span className={`badge status-${booking.status}`}>{booking.status}</span></td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => navigate(`/track?id=${booking._id}`)}>Track</button>
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