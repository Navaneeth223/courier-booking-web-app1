import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';
import Input from '../Common/Input';
import Button from '../Common/Button';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    senderName: '', senderEmail: '', senderPhone: '', senderAddress: '',
    receiverName: '', receiverEmail: '', receiverPhone: '', receiverAddress: '',
    parcelWeight: '', parcelDescription: ''
  });
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mock rate calculation on weight change
  useEffect(() => {
    if (formData.parcelWeight) {
      const weight = parseFloat(formData.parcelWeight);
      setRate(50 + weight * 20); // Base 50 + 20 per kg
    }
  }, [formData.parcelWeight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await bookingService.create(formData);
      setSuccess(res.data.data.bookingId);
      // Reset form or redirect
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="premium-card text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-success mb-2">Booking Successful!</h2>
        <p className="text-gray-500 mb-6">Your booking ID is <strong>{success}</strong></p>
        <Button onClick={() => setSuccess(null)}>Book Another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sender Details */}
        <div className="premium-card">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Sender Details</h3>
          <Input label="Name" name="senderName" value={formData.senderName} onChange={handleChange} required />
          <Input label="Email" name="senderEmail" type="email" value={formData.senderEmail} onChange={handleChange} required />
          <Input label="Phone" name="senderPhone" value={formData.senderPhone} onChange={handleChange} required />
          <Input label="Address" name="senderAddress" value={formData.senderAddress} onChange={handleChange} required />
        </div>

        {/* Receiver Details */}
        <div className="premium-card">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Receiver Details</h3>
          <Input label="Name" name="receiverName" value={formData.receiverName} onChange={handleChange} required />
          <Input label="Email" name="receiverEmail" type="email" value={formData.receiverEmail} onChange={handleChange} required />
          <Input label="Phone" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} required />
          <Input label="Address" name="receiverAddress" value={formData.receiverAddress} onChange={handleChange} required />
        </div>
      </div>

      <div className="premium-card">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Parcel Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Input label="Weight (kg)" name="parcelWeight" type="number" value={formData.parcelWeight} onChange={handleChange} required />
            <Input label="Description" name="parcelDescription" value={formData.parcelDescription} onChange={handleChange} required className="md:col-span-2" />
        </div>
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10 flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">Estimated Delivery Rate</p>
                <p className="text-2xl font-bold text-primary">₹{rate.toFixed(2)}</p>
            </div>
            <Button type="submit" loading={loading} className="px-12 py-3">Confirm Booking</Button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
