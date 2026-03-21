import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../Common/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    accountType: 'individual',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]"></div>

      <div className="premium-card w-full max-w-2xl relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-2xl">⚡</div>
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-text-dim">Join thousands of users and businesses shipping globally</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
             <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dim ml-1">Full Name</label>
            <input
              name="fullName"
              className="input-field"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dim ml-1">Account Type</label>
            <select
              name="accountType"
              className="input-field appearance-none bg-[#1e293b]"
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              <option value="individual">Individual</option>
              <option value="business">Business / Bulk Shipper</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dim ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dim ml-1">Phone Number</label>
            <input
              name="phone"
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9988776655"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-text-dim ml-1">Delivery Address</label>
            <input
              name="address"
              className="input-field"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address for pickups"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-text-dim ml-1">Security Password</label>
            <input
              name="password"
              type="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full text-lg mt-4 py-4 md:col-span-2 shadow-xl" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Get Started Now'}
          </button>
        </form>

        <p className="text-center mt-8 text-text-dim text-sm">
          Already shipping with us? <Link to="/login" className="text-white font-semibold hover:text-primary transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
