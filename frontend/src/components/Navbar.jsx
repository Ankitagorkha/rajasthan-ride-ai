import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3 text-3xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-desert-500">🐪</span>
          <span className="bg-gradient-to-r from-desert-500 to-fort-500 bg-clip-text text-transparent">Rajasthan Ride AI</span>
        </motion.div>

        <div className="flex items-center gap-8 text-lg">
          <Link to="/" className="hover:text-desert-500 transition">Home</Link>
          <Link to="/search" className="hover:text-desert-500 transition">Search Buses</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-desert-500 transition font-medium">Dashboard</Link>
              <span className="font-medium text-desert-400">Hi, {user.name.split(' ')[0]}</span>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-fort-600 text-white px-6 py-3 rounded-3xl font-semibold hover:bg-fort-700 transition">
              Login / Register
            </Link>
          )}

          <button 
            onClick={toggleTheme}
            className="px-4 py-2 rounded-2xl glass text-sm font-medium"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}