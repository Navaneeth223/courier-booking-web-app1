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
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipment Logs</h1>
            <p className="text-text-dim mt-1 font-medium">Manage and monitor your global deliveries.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto">
          {['all', 'pending', 'approved', 'in_transit', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-white hover:bg-white/5'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="premium-card p-0 overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-text-dim text-[11px] uppercase font-bold tracking-[1px]">
              <tr>
                <th className="px-8 py-5">Global ID</th>
                <th className="px-8 py-5">Destination</th>
                <th className="px-8 py-5">Weight</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map(order => (
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-bold text-primary">#{order.bookingId}</span>
                    <p className="text-[10px] text-text-dim mt-1 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-white">{order.receiverName}</p>
                    <p className="text-xs text-text-dim mt-1">{order.receiverAddress}</p>
                  </td>
                  <td className="px-8 py-6 font-medium">{order.parcelWeight} kg</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                        to={`/track?id=${order.bookingId}`} 
                        className="btn-primary py-2 px-6 text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity inline-block"
                    >
                        Track Live
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-center py-24 text-text-dim font-medium italic opacity-50">No logs matching this frequency.</td>
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
    case 'pending': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
    case 'approved': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'picked_up': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'in_transit': return 'bg-primary/10 text-primary border border-primary/20';
    case 'delivered': return 'bg-success/10 text-success border border-success/20';
    default: return 'bg-white/5 text-text-dim';
  }
};

export default OrderHistory;
