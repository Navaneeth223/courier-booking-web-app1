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
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="premium-card text-center py-20 animate-fade-in max-w-2xl mx-auto mt-10">
        <div className="w-24 h-24 bg-success/10 rounded-full mx-auto flex items-center justify-center text-5xl mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          ✅
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Booking Initiated</h2>
        <p className="text-text-dim mb-8 font-medium">Your global tracking ID has been generated:<br/> 
           <span className="text-primary text-2xl font-bold mt-2 inline-block">#{success}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setSuccess(null)} className="px-8">Create New Shipment</Button>
            <Button variant="outline" className="px-8 border-white/10 hover:bg-white/5">Download Label</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
        <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">New Shipment</h1>
            <p className="text-text-dim font-medium">Configure your parcel delivery details across our global network.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Sender Details */}
            <div className="premium-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                <h3 className="text-xl font-bold">Sender Details</h3>
              </div>
              <div className="space-y-5">
                <Input label="Full Name" name="senderName" value={formData.senderName} onChange={handleChange} required />
                <Input label="Email Address" name="senderEmail" type="email" value={formData.senderEmail} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" name="senderPhone" value={formData.senderPhone} onChange={handleChange} required />
                  <Input label="City/State" name="senderAddress" value={formData.senderAddress} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Receiver Details */}
            <div className="premium-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">2</div>
                <h3 className="text-xl font-bold">Receiver Details</h3>
              </div>
              <div className="space-y-5">
                <Input label="Full Name" name="receiverName" value={formData.receiverName} onChange={handleChange} required />
                <Input label="Email Address" name="receiverEmail" type="email" value={formData.receiverEmail} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} required />
                  <Input label="City/State" name="receiverAddress" value={formData.receiverAddress} onChange={handleChange} required />
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">📦</div>
                <h3 className="text-xl font-bold">Parcel Specifications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <Input label="Weight (kg)" name="parcelWeight" type="number" value={formData.parcelWeight} onChange={handleChange} required />
                <Input label="Description / Contents" name="parcelDescription" value={formData.parcelDescription} onChange={handleChange} required className="md:col-span-2" />
            </div>
            
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl">
                        <p className="text-xs text-text-dim uppercase tracking-wider font-bold mb-1 opacity-60">Estimated Cost</p>
                        <p className="text-3xl font-black text-white">₹{rate.toFixed(2)}</p>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary px-16 h-16 text-xl shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3">
                    {loading ? 'Processing...' : 'Confirm Shipment'}
                </button>
            </div>
          </div>
        </form>
    </div>
  );
};

export default BookingForm;
