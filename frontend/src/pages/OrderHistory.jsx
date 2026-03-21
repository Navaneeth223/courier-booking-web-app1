import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getAll();
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'in_transit', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="premium-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Receiver</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Weight</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{order.bookingId}</td>
                  <td className="px-6 py-4">{order.receiverName}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{order.parcelWeight} kg</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/track?id=${order.bookingId}`} className="text-primary hover:underline font-semibold text-sm">Track</Link>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">No bookings found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-warning/10 text-warning';
    case 'approved': return 'bg-blue/10 text-blue';
    case 'picked_up': return 'bg-purple/10 text-purple';
    case 'in_transit': return 'bg-primary/10 text-primary';
    case 'delivered': return 'bg-success/10 text-success';
    default: return 'bg-gray-100 text-gray-500';
  }
};

export default OrderHistory;
