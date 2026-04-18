import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BusCard({ bus }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div>
        <h3 className="text-3xl font-bold">{bus.busNumber}</h3>
        <p className="text-xl text-gray-400 mt-1">{bus.type}</p>
        <p className="mt-4">{bus.departure} — {bus.arrival}</p>
      </div>

      <div className="text-right">
        <p className="text-5xl font-bold text-desert-500">₹{bus.price}</p>
        <p className="text-sm text-green-400 mt-1">{bus.seatsLeft} seats left</p>
        
        <Link 
          to={`/bus/${bus.id}`}
          className="mt-6 block bg-fort-600 hover:bg-fort-700 text-white px-10 py-4 rounded-3xl font-semibold text-lg text-center transition"
        >
          View Seats & Book Now
        </Link>
      </div>
    </motion.div>
  );
}