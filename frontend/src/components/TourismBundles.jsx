import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const bundles = [
  {
    id: 1,
    title: "Golden Desert Safari",
    subtitle: "Jaisalmer Experience",
    price: 2499,
    busPrice: "₹850",
    image: "🏜️",
    description: "Bus + Camel Safari + Dune Dinner + Star Gazing",
    highlights: ["Jaisalmer Fort", "Camel Ride", "Cultural Show"],
    color: "from-orange-500 to-amber-600"
  },
  {
    id: 2,
    title: "Royal Fort Trail",
    subtitle: "Udaipur & Chittorgarh",
    price: 1899,
    busPrice: "₹650",
    image: "🏰",
    description: "Bus + Lake Pichola Boat Ride + City Palace Entry",
    highlights: ["Lake Palace", "City Palace", "Light & Sound Show"],
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: 3,
    title: "Pushkar Holy Ride",
    subtitle: "Spiritual Journey",
    price: 999,
    busPrice: "₹450",
    image: "🕉️",
    description: "Bus + Brahma Temple + Sacred Lake Visit",
    highlights: ["Pushkar Lake", "Brahma Temple", "Rose Garden"],
    color: "from-purple-600 to-pink-600"
  }
];

export default function TourismBundles() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Explore Rajasthan with Us 🏜️</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">Bus Ticket + Exclusive Tourism Bundles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {bundles.map((bundle) => (
          <motion.div
            key={bundle.id}
            whileHover={{ y: -12, scale: 1.02 }}
            className="glass rounded-3xl overflow-hidden shadow-xl group"
          >
            <div className={`h-48 bg-gradient-to-br ${bundle.color} flex items-center justify-center text-8xl transition-all group-hover:scale-110`}>
              {bundle.image}
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold mb-1">{bundle.title}</h3>
              <p className="text-desert-500 font-medium">{bundle.subtitle}</p>

              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                {bundle.description}
              </p>

              <div className="mt-6 space-y-2">
                {bundle.highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span> {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-400">Bundle Price</p>
                  <p className="text-4xl font-bold text-desert-500">₹{bundle.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Bus Only</p>
                  <p className="text-xl font-semibold">{bundle.busPrice}</p>
                </div>
              </div>

              <button 
                onClick={() => alert(`🎟️ Bundle "${bundle.title}" added to your trip!\n\nYou can combine this with your bus booking.`)}
                className="mt-8 w-full bg-gradient-to-r from-desert-500 to-fort-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition"
              >
                Add Bundle to Booking
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12 text-sm text-gray-500">
        Bundles can be combined with any bus ticket • Limited seats available
      </div>
    </div>
  );
}