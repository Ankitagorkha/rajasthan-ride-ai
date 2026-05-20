import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../lib/api';

const busIcon = L.divIcon({
  className: '',
  html: '<div style="background:#f59e0b;color:#111827;border:3px solid white;border-radius:999px;width:42px;height:42px;display:grid;place-items:center;font-weight:900;box-shadow:0 10px 25px rgba(0,0,0,.25)">BUS</div>',
  iconSize: [42, 42],
  iconAnchor: [21, 21]
});

export default function LiveTracking() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [position, setPosition] = useState([26.9124, 75.7873]); // Start at Jaipur
  const [telemetry, setTelemetry] = useState({ eta: 'calculating', speed: 0 });

  useEffect(() => {
    const socket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
    socket.on('busLocation', (location) => {
      setPosition([location.lat, location.lng]);
      setTelemetry({ eta: location.eta || '42 min', speed: location.speed || 55 });
    });

    const interval = setInterval(() => {
      setPosition((prev) => [prev[0] + (Math.random() * 0.01 - 0.005), prev[1] + (Math.random() * 0.01 - 0.005)]);
    }, 1600);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const routePath = [
    [26.9124, 75.7873],
    [26.4499, 74.6399],
    [24.5854, 73.7125]
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="p-8 bg-gradient-to-r from-desert-500 to-fort-600 text-white">
          <h1 className="text-4xl font-bold flex items-center gap-4">
            🐪 Live Bus Tracking 
            <span className="bg-green-500 px-6 py-1 rounded-full text-sm font-medium animate-pulse">LIVE</span>
          </h1>
          <p className="text-xl mt-2">RJ14-PA-2025 - Jaipur to Udaipur - ETA {telemetry.eta} - {telemetry.speed} km/h</p>
        </div>

        <div className="h-[580px] relative">
          <MapContainer 
            center={position} 
            zoom={8} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={routePath} color="#f59e0b" weight={8} opacity={0.8} />
            
            {/* Key forces re-render of marker */}
            <Marker key={`${position[0]}-${position[1]}`} position={position} icon={busIcon} />
          </MapContainer>
        </div>

        <div className="p-6 text-center text-sm text-gray-400">
          AI tracking simulates live GPS updates and will use Socket.io whenever the backend is running.
        </div>
      </motion.div>
    </div>
  );
}
