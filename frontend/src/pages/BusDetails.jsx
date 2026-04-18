import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import SeatMap from '../components/SeatMap';
import { motion } from 'framer-motion';

export default function BusDetails() {
  const { id } = useParams();
  const [showSeatMap, setShowSeatMap] = useState(false);

  const handleBookSeats = (seats, amount) => {
    alert(`🎟️ Booking Confirmed!\nSeats: ${seats.join(', ')}\nTotal Amount: ₹${amount}`);
    setShowSeatMap(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/search" className="text-desert-500 hover:underline mb-8 inline-block">← Back to Search</Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-10"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Bus Details */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-3">RJ14-PA-2025</h1>
            <p className="text-3xl text-desert-500 mb-2">AC Sleeper Bus</p>
            <p className="text-2xl mb-8">Jaipur → Udaipur • 22:30 - 07:15 (8h 45m)</p>

            <div className="space-y-6 text-lg">
              <div><strong>Departure:</strong> 22:30 from Jaipur Central</div>
              <div><strong>Arrival:</strong> 07:15 at Udaipur City</div>
              <div><strong>Amenities:</strong> WiFi, Toilet, Charging Points, Water Bottle, CCTV</div>
              <div><strong>Seats Available:</strong> 12</div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex-1 flex flex-col justify-center gap-6">
            <button 
              onClick={() => setShowSeatMap(!showSeatMap)}
              className="w-full bg-gradient-to-r from-desert-500 to-fort-600 text-white py-6 rounded-3xl text-2xl font-bold hover:scale-105 transition"
            >
              {showSeatMap ? "Hide Seat Map" : "🎫 Select Seats & Book Now"}
            </button>

            {/* 🔥 This is the button you were missing */}
            <Link 
              to={`/tracking/${id || 'demo'}`}
              className="w-full text-center border-2 border-white/30 hover:border-white/60 text-white py-6 rounded-3xl text-2xl font-bold transition hover:bg-white/10"
            >
              🗺️ Track Live Bus
            </Link> track bus live link
          </div>
        </div>

        {/* Seat Map Section */}
        {showSeatMap && <SeatMap onBookSeats={handleBookSeats} />}
      </motion.div>
    </div>
  );
}