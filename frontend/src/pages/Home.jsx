import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TourismBundles from '../components/TourismBundles';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-bg h-screen flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#ffffff22_0%,transparent_70%)]"></div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center z-10 px-6 max-w-5xl"
        >
          <div className="flex justify-center mb-6 text-8xl">🐪</div>
          <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-widest">
            RAJASTHAN RIDE <span className="text-amber-300">AI</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-10 max-w-2xl mx-auto">
            Premium bus booking with live GPS tracking across the land of kings
          </p>
          
          <Link 
            to="/search"
            className="inline-block bg-white hover:bg-amber-100 text-fort-700 px-14 py-6 rounded-3xl text-2xl font-bold shadow-2xl transition-all hover:scale-110"
          >
            Search Buses Across Rajasthan →
          </Link>
        </motion.div>
      </div>

      {/* Quick Info */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Why Choose Rajasthan Ride AI?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">Real-time bookings • Animated seat maps • Tourism bundles • Live camel tracking</p>
      </div>
            {/* Tourism Bundles Section */}
      <TourismBundles />
    </div>
  );
}