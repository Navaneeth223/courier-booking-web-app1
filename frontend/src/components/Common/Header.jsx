import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 glass-nav fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-8 border-b border-white/5">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
          📦
        </div>
        <span className="text-2xl font-bold tracking-tight">
          Courier<span className="gradient-text">Go</span>
        </span>
      </Link>

      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-white">{user.fullName}</span>
                <span className="text-[10px] uppercase tracking-wider text-text-dim font-bold">{user.accountType}</span>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-error/10 text-error text-sm font-bold hover:bg-error/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-text-dim hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-6 py-2.5">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
