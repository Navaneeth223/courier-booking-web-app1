import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please make sure the backend is running and you have seeded the admin user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[140px] animate-pulse"></div>

      <div className="premium-card w-full max-w-lg relative z-10 animate-fade-in border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.4)]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6 shadow-lg transform hover:rotate-6 transition-transform">📦</div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Security Portal</h1>
          <p className="text-text-dim font-medium">Access your enterprise logistics dashboard</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/30 text-error p-4 rounded-2xl mb-8 text-sm flex items-center gap-3 backdrop-blur-md">
             <span className="text-lg">🚫</span> 
             <div className="flex flex-col">
                <span className="font-bold">Authentication Failed</span>
                <span className="opacity-80 font-medium">{error}</span>
             </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-dim ml-1 flex items-center gap-2">
                <span className="opacity-70">📧</span> Email Address
            </label>
            <input
              type="email"
              className="input-field h-14 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@courier.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-text-dim flex items-center gap-2">
                    <span className="opacity-70">🔒</span> Password
                </label>
                <Link to="/forgot" className="text-xs text-primary font-bold hover:underline opacity-80 hover:opacity-100 transition-opacity">Reset Key?</Link>
            </div>
            <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field h-14 text-lg pr-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors"
                >
                    {showPassword ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full text-xl mt-6 h-16 shadow-lg hover:scale-[1.01]" 
            disabled={loading}
          >
            {loading ? 'Establishing Connection...' : 'Establish Connection'}
          </button>
        </form>

        <p className="text-center mt-10 text-text-dim text-sm font-medium">
          New terminal detected? <Link to="/register" className="text-white font-bold hover:text-primary transition-colors hover:underline">Deploy account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
