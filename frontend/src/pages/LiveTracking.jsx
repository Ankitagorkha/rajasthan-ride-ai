import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

export default function LiveTracking() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [position, setPosition] = useState([26.9124, 75.7873]); // Start at Jaipur

  useEffect(() => {
    console.log("🚀 Live Tracking started - marker will move now");

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newLat = prev[0] + (Math.random() * 0.025 - 0.0125);
        const newLng = prev[1] + (Math.random() * 0.025 - 0.0125);
        console.log("📍 Marker moved to:", newLat.toFixed(4), newLng.toFixed(4));
        return [newLat, newLng];
      });
    }, 900); // Moves every 0.9 seconds - very visible

    return () => clearInterval(interval);
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
          <p className="text-xl mt-2">RJ14-PA-2025 • Jaipur → Udaipur</p>
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
            <Marker key={`${position[0]}-${position[1]}`} position={position} />
          </MapContainer>
        </div>

        <div className="p-6 text-center text-sm text-gray-400">
          Marker is moving every 0.9 seconds • Check console (F12) for logs
        </div>
      </motion.div>
    </div>
  );
}