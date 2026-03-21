import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';

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
    const socket = io(import.meta.env.VITE_SOCKET_URL);

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
    <div className="space-y-6">
      <div className="premium-card">
        <h2 className="text-xl font-bold mb-4">Track Your Parcel</h2>
        <form onSubmit={handleTrack} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Enter Booking ID (e.g. BK-2026-XXXXX)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <Button type="submit">Track Status</Button>
        </form>
      </div>

      {trackingData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 premium-card p-0 overflow-hidden h-[500px] relative">
            <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location}>
                <Popup>Current Parcel Location</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="premium-card">
            <h3 className="text-lg font-bold mb-6">Status Timeline</h3>
            <div className="space-y-6">
              {trackingData.history.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === trackingData.history.length - 1 ? 'bg-primary ring-4 ring-primary/20' : 'bg-gray-300'}`}></div>
                    {index !== trackingData.history.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                  </div>
                  <div>
                    <p className={`font-bold ${index === trackingData.history.length - 1 ? 'text-primary' : 'text-dark'}`}>{item.status}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.date}</p>
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
