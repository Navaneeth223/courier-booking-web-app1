import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import Button from '../components/Common/Button';

// Fix for default marker icons in Leaflet
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const TrackingPage = () => {
  const [bookingId, setBookingId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [location, setLocation] = useState([28.6139, 77.2090]); // Default to Delhi

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('location-update', (data) => {
      if (data.bookingId === trackingData?._id) {
        setLocation([data.currentLocation.lat, data.currentLocation.lng]);
      }
    });

    return () => socket.disconnect();
  }, [trackingData]);

  const handleTrack = async (e) => {
    e.preventDefault();
    // Simulate fetching tracking data
    setTrackingData({
        _id: '123',
        status: 'In Transit',
        history: [
            { status: 'Pending', description: 'Order created', date: '2026-03-20 10:00' },
            { status: 'Approved', description: 'Admin approved', date: '2026-03-20 14:00' },
            { status: 'In Transit', description: 'Left Delhi Hub', date: '2026-03-21 09:00' },
        ]
    });
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Real-time Tracking</h1>
            <p className="text-text-dim mt-1 font-medium">Monitor your shipment path through our global logistics nodes.</p>
        </div>

      <div className="premium-card">
        <h2 className="text-xl font-bold mb-6">Track Your Parcel</h2>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Enter Global Tracking ID (e.g. BK-2026-XXXXX)"
            className="input-field flex-1 h-14"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <button type="submit" className="btn-primary h-14 px-10 text-lg">Locate Shipment</button>
        </form>
      </div>

      {trackingData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 premium-card p-0 overflow-hidden h-[550px] relative border-white/10 group">
            <div className="absolute top-4 left-4 z-[1000] px-4 py-2 bg-bg-main/80 backdrop-blur-md rounded-xl border border-white/10 text-xs font-bold text-success animate-pulse">
                LIVE GPS ACTIVE 📡
            </div>
            <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(0.7) contrast(1.1)' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location}>
                <Popup>Current Parcel Location</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="premium-card border-white/10">
            <h3 className="text-lg font-bold mb-8 flex items-center justify-between">
                Protocol History
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-full">ACTIVE</span>
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute left-[5px] top-2 bottom-4 w-px bg-white/10"></div>
              {trackingData.history.map((item, index) => (
                <div key={index} className="flex gap-6 relative">
                  <div className={`w-3 h-3 rounded-full z-10 ${index === trackingData.history.length - 1 ? 'bg-primary ring-4 ring-primary/20 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}></div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm leading-none mb-1 ${index === trackingData.history.length - 1 ? 'text-primary' : 'text-white'}`}>{item.status}</p>
                    <p className="text-xs text-text-dim font-medium leading-relaxed">{item.description}</p>
                    <p className="text-[10px] text-text-dim mt-2 font-bold opacity-40 uppercase">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
