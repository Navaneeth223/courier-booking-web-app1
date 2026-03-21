import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../services/api'
import './Forms.css'

export default function BookingForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    receiverAddress: '',
    weight: '',
    description: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/bookings', formData)
      
      if (response.data.success) {
        toast.success('Booking created successfully!')
        navigate('/bookings')
      } else {
        toast.error('Failed to create booking')
      }
    } catch (error) {
      toast.error('Error creating booking')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <h1>Create New Booking</h1>
        <p>Fill in the details to create a new shipment</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Sender Section */}
        <div className="form-section">
          <h2>Sender Information</h2>
          <div className="form-grid">
            <input
              type="text"
              name="senderName"
              placeholder="Full Name"
              value={formData.senderName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="senderEmail"
              placeholder="Email"
              value={formData.senderEmail}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="senderPhone"
              placeholder="Phone"
              value={formData.senderPhone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="senderAddress"
              placeholder="Address"
              value={formData.senderAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Receiver Section */}
        <div className="form-section">
          <h2>Receiver Information</h2>
          <div className="form-grid">
            <input
              type="text"
              name="receiverName"
              placeholder="Full Name"
              value={formData.receiverName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="receiverEmail"
              placeholder="Email"
              value={formData.receiverEmail}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="receiverPhone"
              placeholder="Phone"
              value={formData.receiverPhone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="receiverAddress"
              placeholder="Address"
              value={formData.receiverAddress}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Parcel Section */}
        <div className="form-section">
          <h2>Parcel Details</h2>
          <div className="form-grid">
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Creating...' : 'Create Booking'}
        </button>
      </form>
    </div>
  )
}