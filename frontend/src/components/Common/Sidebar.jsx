import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'New Shipment', path: '/book', icon: '📦' },
    { name: 'My History', path: '/bookings', icon: '📜' },
    { name: 'Track Parcel', path: '/track', icon: '📍' },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/orders', icon: '🛡️' },
    { name: 'Client Base', path: '/admin/clients', icon: '👥' },
  ];

  const activeLink = (path) => location.pathname === path 
    ? 'bg-primary/20 text-primary border-l-4 border-primary' 
    : 'text-text-dim hover:bg-white/5 hover:text-white';

  return (
    <aside className="w-72 h-screen fixed pt-28 left-0 border-r border-white/5 hidden lg:block z-40 bg-bg-main">
      <div className="px-6 space-y-8">
        <div>
          <p className="text-[10px] font-bold text-text-dim uppercase tracking-[2px] mb-6 px-4">Navigation</p>
          <div className="flex flex-col gap-2">
            {links.map(link => (
              <Link 
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${activeLink(link.path)}`}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {(user?.accountType === 'business' || user?.accountType === 'admin') && (
          <div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[2px] mb-6 px-4">Management</p>
            <div className="flex flex-col gap-2">
              {adminLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${activeLink(link.path)}`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
