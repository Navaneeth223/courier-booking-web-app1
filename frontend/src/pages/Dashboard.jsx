import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-10 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome, <span className="gradient-text">{user?.fullName.split(' ')[0]}</span></h1>
            <p className="text-text-dim mt-2 font-medium">Here's what's happening with your shipments today.</p>
        </div>
        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-sm font-semibold text-text-dim">
           📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard title="Active Shipments" value="0" icon="📦" color="primary" />
        <StatusCard title="Delivered Safe" value="0" icon="✅" color="success" />
        <StatusCard title="Pending Review" value="0" icon="⏳" color="secondary" />
        <StatusCard title="Reward Points" value="500" icon="💎" color="purple" />
      </div>

      <div className="premium-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl group-hover:scale-110 transition-transform duration-700">🚀</div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            Quick Actions
            <div className="h-px flex-1 bg-white/10"></div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionButton icon="📦" label="New Shipment" sub="Send anything, anywhere" color="primary" />
          <ActionButton icon="📍" label="Live Tracking" sub="Real-time GPS updates" color="success" />
          <ActionButton icon="📜" label="Order History" sub="Manage your past logs" color="secondary" />
          <ActionButton icon="⚙️" label="Account Settings" sub="Preferences & Security" color="dim" />
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ title, value, icon, color }) => (
  <div className="premium-card p-8 group hover:scale-[1.02] transition-all cursor-default">
    <div className="flex justify-between items-start mb-4">
      <span className="text-3xl filter drop-shadow-lg">{icon}</span>
      <div className={`w-2 h-2 rounded-full bg-${color} animate-pulse shadow-[0_0_10px_rgba(var(--${color}-rgb),0.5)]`}></div>
    </div>
    <p className="text-text-dim text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
    <p className="text-4xl font-extrabold tracking-tight">{value}</p>
  </div>
);

const ActionButton = ({ icon, label, sub, color }) => (
  <button className="flex flex-col items-start p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/20 transition-all text-left group">
    <span className="text-3xl mb-4 bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="font-bold text-lg mb-1">{label}</span>
    <span className="text-xs text-text-dim">{sub}</span>
  </button>
);

export default Dashboard;
