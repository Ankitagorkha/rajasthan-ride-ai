import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SeatMap({ onBookSeats }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Realistic 2-2 seater layout (24 seats)
  const rows = [
    { row: 1, seats: ['1A', '1B', null, '1C', '1D'] },
    { row: 2, seats: ['2A', '2B', null, '2C', '2D'] },
    { row: 3, seats: ['3A', '3B', null, '3C', '3D'] },
    { row: 4, seats: ['4A', '4B', null, '4C', '4D'] },
    { row: 5, seats: ['5A', '5B', null, '5C', '5D'] },
    { row: 6, seats: ['6A', '6B', null, '6C', '6D'] },
  ];

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < 6) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const totalAmount = selectedSeats.length * 1250;

  return (
    <div className="mt-10 glass rounded-3xl p-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold">Interactive Seat Map 🪑</h3>
        <div className="text-sm bg-green-500 text-white px-4 py-1 rounded-full font-medium">LIVE AVAILABILITY</div>
      </div>

      {/* Bus Layout Container */}
      <div className="max-w-2xl mx-auto border-4 border-gray-300 dark:border-gray-700 rounded-3xl p-8 bg-white/10 backdrop-blur-xl">
        
        {/* Driver Area */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-gray-300 dark:bg-gray-600 rounded-xl flex items-center justify-center text-xl">🛞</div>
            <p className="text-xs text-gray-500 mt-1">Driver</p>
          </div>
          <div className="text-center">
            <div className="px-6 py-2 bg-amber-300 text-black font-bold rounded-2xl text-sm">FRONT</div>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="space-y-6">
          {rows.map((rowData) => (
            <div key={rowData.row} className="flex items-center gap-4">
              {/* Left Side Seats */}
              <div className="flex gap-3">
                {rowData.seats.slice(0, 2).map((seat) => (
                  <motion.button
                    key={seat}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSeat(seat)}
                    className={`w-14 h-14 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-md ${
                      selectedSeats.includes(seat)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/90 dark:bg-gray-700 hover:bg-white text-gray-800'
                    }`}
                  >
                    {seat}
                  </motion.button>
                ))}
              </div>

              {/* Aisle */}
              <div className="flex-1 flex justify-center">
                <div className="w-8 h-8 bg-transparent"></div>
              </div>

              {/* Right Side Seats */}
              <div className="flex gap-3">
                {rowData.seats.slice(3).map((seat) => (
                  <motion.button
                    key={seat}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSeat(seat)}
                    className={`w-14 h-14 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-md ${
                      selectedSeats.includes(seat)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/90 dark:bg-gray-700 hover:bg-white text-gray-800'
                    }`}
                  >
                    {seat}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Rear Label */}
        <div className="text-center mt-8 text-xs text-gray-400 font-medium">REAR OF BUS</div>
      </div>

      {/* Selected Seats & Amount */}
      <div className="mt-10 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Selected Seats</p>
          <p className="text-2xl font-bold">{selectedSeats.join(', ') || '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Amount</p>
          <p className="text-4xl font-bold text-desert-500">₹{totalAmount}</p>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <button
          onClick={() => onBookSeats(selectedSeats, totalAmount)}
          className="mt-8 w-full bg-gradient-to-r from-desert-500 to-fort-600 py-6 rounded-3xl text-2xl font-bold hover:scale-105 transition"
        >
          Proceed to Pay ₹{totalAmount} →
        </button>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-8 mt-10 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-xl"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/90 dark:bg-gray-700 border border-gray-300 rounded-xl"></div>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}