import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-10 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back, <span className="text-primary">{user?.fullName.split(' ')[0]}</span></h1>
            <p className="text-text-dim mt-2 font-medium">Your courier operations are running smoothly today.</p>
        </div>
        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-sm font-semibold text-text-dim backdrop-blur-md">
           📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard title="Active Shipments" value="12" icon="📦" color="var(--primary)" />
        <StatusCard title="Delivered Safe" value="148" icon="✅" color="var(--success)" />
        <StatusCard title="Pending Review" value="3" icon="⏳" color="var(--secondary)" />
        <StatusCard title="Reward Points" value="1,250" icon="💎" color="#a855f7" />
      </div>

      <div className="premium-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl group-hover:scale-110 transition-transform duration-700">🚀</div>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            Quick Actions
            <div className="h-px flex-1 bg-white/10 ml-4"></div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionButton to="/book" icon="📦" label="New Shipment" sub="Send anything, anywhere" color="primary" />
          <ActionButton to="/track" icon="📍" label="Live Tracking" sub="Real-time GPS updates" color="success" />
          <ActionButton to="/bookings" icon="📜" label="Order History" sub="Manage your past logs" color="secondary" />
          <ActionButton to="/profile" icon="⚙️" label="Settings" sub="Account & Privacy" color="dim" />
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ title, value, icon, color }) => (
  <div className="premium-card p-8 group hover:scale-[1.02] transition-all cursor-default">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
      <div className="w-2 h-2 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: color, color }}></div>
    </div>
    <p className="text-text-dim text-[11px] font-bold uppercase tracking-[2px] mb-1 opacity-70">{title}</p>
    <p className="text-4xl font-extrabold tracking-tight">{value}</p>
  </div>
);

const ActionButton = ({ to, icon, label, sub }) => (
  <Link to={to} className="flex flex-col items-start p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/20 transition-all text-left group">
    <span className="text-3xl mb-4 bg-white/5 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform shadow-lg">{icon}</span>
    <span className="font-bold text-lg mb-1">{label}</span>
    <span className="text-xs text-text-dim font-medium">{sub}</span>
  </Link>
);

export default Dashboard;
