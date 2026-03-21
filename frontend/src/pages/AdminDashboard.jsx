import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import Button from '../components/Common/Button';

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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Command Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Orders" value={metrics.totalBookings} color="primary" />
        <StatsCard title="Pending Review" value={metrics.pendingCount} color="warning" />
        <StatsCard title="In Transit" value={metrics.inTransitCount} color="blue" />
        <StatsCard title="Delivered" value={metrics.deliveredCount} color="success" />
      </div>

      <div className="premium-card overflow-hidden">
        <h2 className="text-lg font-bold mb-4 px-2">Pending Approvals</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">Receiver</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.filter(o => o.status === 'pending').map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-primary">{order.bookingId}</td>
                  <td className="px-4 py-4">{order.senderName}</td>
                  <td className="px-4 py-4">{order.receiverName}</td>
                  <td className="px-4 py-4">{order.parcelWeight} kg</td>
                  <td className="px-4 py-4">
                    <Button onClick={() => handleApprove(order._id)} className="text-sm px-4 py-1">Approve</Button>
                  </td>
                </tr>
              ))}
              {orders.filter(o => o.status === 'pending').length === 0 && (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No pending orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, color }) => (
  <div className={`premium-card border-l-4 border-${color}`}>
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default AdminDashboard;
