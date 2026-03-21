import { useState } from 'react'
import api from '../services/api'
import './Tracking.css'

export default function TrackingPage() {
  const [bookingId, setBookingId] = useState('')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await api.get(`/bookings?id=${bookingId}`)
      if (response.data.success && response.data.bookings?.length > 0) {
        setBooking(response.data.bookings[0])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <h1>Track Your Shipment</h1>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {booking && (
        <div className="tracking-info">
          <div className="info-card">
            <h2>Booking Details</h2>
            <div className="info-grid">
              <div><strong>ID:</strong> {booking.bookingId}</div>
              <div><strong>Receiver:</strong> {booking.receiverName}</div>
              <div><strong>Status:</strong> <span className={`badge status-${booking.status}`}>{booking.status}</span></div>
              <div><strong>Weight:</strong> {booking.weight} kg</div>
            </div>
          </div>

          <div className="timeline">
            <div className={`timeline-item ${booking.status === 'pending' ? 'active' : 'done'}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-text">Booking Created</div>
            </div>
            <div className={`timeline-item ${booking.status === 'approved' ? 'active' : booking.status !== 'pending' ? 'done' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-text">Order Approved</div>
            </div>
            <div className={`timeline-item ${booking.status === 'in_transit' ? 'active' : booking.status === 'delivered' ? 'done' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-text">In Transit</div>
            </div>
            <div className={`timeline-item ${booking.status === 'delivered' ? 'done' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-text">Delivered</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}