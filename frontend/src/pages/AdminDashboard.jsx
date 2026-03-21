import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ totalBookings: 0, pendingCount: 0, inTransitCount: 0, deliveredCount: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, oRes] = await Promise.all([
        adminService.getMetrics(),
        adminService.getOrders()
      ]);
      setMetrics(mRes.data.data);
      setOrders(oRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveOrder(id);
      fetchData();
    } catch (err) {
      alert('Approval failed');
    }
  };

  return (
    <div className="space-y-10 py-4 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
        <p className="text-text-dim mt-1 font-medium">Manage global shipping logs and approve enterprise manifests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Manifests" value={metrics.totalBookings} color="var(--primary)" />
        <StatsCard title="Pending Review" value={metrics.pendingCount} color="var(--secondary)" />
        <StatsCard title="In Transit" value={metrics.inTransitCount} color="#3b82f6" />
        <StatsCard title="Completed" value={metrics.deliveredCount} color="var(--success)" />
      </div>

      <div className="premium-card p-0 overflow-hidden border-white/10 shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">Pending Approvals</h2>
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black rounded-lg">REQUIRES ACTION</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-text-dim text-[11px] uppercase font-bold tracking-[1px]">
              <tr>
                <th className="px-8 py-4">Manifest ID</th>
                <th className="px-8 py-4">Origin/Sender</th>
                <th className="px-8 py-4">Dest/Receiver</th>
                <th className="px-8 py-4">Spec</th>
                <th className="px-8 py-4 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.filter(o => o.status === 'pending').map(order => (
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 font-bold text-primary">#{order.bookingId}</td>
                  <td className="px-8 py-5 text-sm font-medium">{order.senderName}</td>
                  <td className="px-8 py-5 text-sm font-medium">{order.receiverName}</td>
                  <td className="px-8 py-5 text-sm">{order.parcelWeight} kg</td>
                  <td className="px-8 py-5 text-right">
                    <button 
                        onClick={() => handleApprove(order._id)} 
                        className="btn-primary text-[10px] px-6 py-2 shadow-md"
                    >
                        Approve Manifest
                    </button>
                  </td>
                </tr>
              ))}
              {orders.filter(o => o.status === 'pending').length === 0 && (
                  <tr><td colSpan="5" className="text-center py-16 text-text-dim font-medium italic opacity-50">All manifests have been cleared from the queue.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, color }) => (
  <div className="premium-card group hover:scale-[1.02] transition-all">
    <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: color }}></div>
        <p className="text-text-dim text-[10px] font-bold uppercase tracking-wider opacity-60">{title}</p>
    </div>
    <p className="text-3xl font-black">{value || 0}</p>
  </div>
);

export default AdminDashboard;
