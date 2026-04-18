import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import jsPDF from 'jspdf';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    // Fetch fresh user data from backend (recommended)
    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch(() => {
        // Fallback to localStorage if backend call fails
        setUser(JSON.parse(storedUser));
      })
      .finally(() => setLoading(false));

    // Demo bookings (you can later connect to real backend)
    setBookings([
      {
        id: 'B001',
        busNumber: 'RJ14-PA-2025',
        route: 'Jaipur → Udaipur',
        date: '20 Apr 2026',
        seats: ['A3', 'A4'],
        amount: 2500,
        status: 'Confirmed'
      },
      {
        id: 'B002',
        busNumber: 'RJ27-UD-1987',
        route: 'Jodhpur → Jaisalmer',
        date: '15 Apr 2026',
        seats: ['B12'],
        amount: 1450,
        status: 'Completed'
      }
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const downloadTicket = (booking) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('🐪 Rajasthan Ride AI', 20, 30);
    doc.setFontSize(16);
    doc.text('E-Ticket', 20, 50);
    doc.setFontSize(12);
    doc.text(`Booking ID : ${booking.id}`, 20, 70);
    doc.text(`Bus         : ${booking.busNumber}`, 20, 80);
    doc.text(`Route       : ${booking.route}`, 20, 90);
    doc.text(`Date        : ${booking.date}`, 20, 100);
    doc.text(`Seats       : ${booking.seats.join(', ')}`, 20, 110);
    doc.text(`Amount      : ₹${booking.amount}`, 20, 120);
    doc.text('Status      : Confirmed', 20, 140);
    doc.text('Thank you for riding with us!', 20, 160);
    doc.save(`Ticket_${booking.id}.pdf`);
  };

  if (loading) {
    return <div className="text-center py-20 text-2xl">Loading your dashboard...</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-xl text-gray-500 mt-2">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-3xl font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* Wallet Card */}
        <div className="glass rounded-3xl p-10 mb-12">
          <h3 className="text-2xl font-semibold mb-3">Your Wallet Balance</h3>
          <p className="text-6xl font-bold text-desert-500">₹2,450</p>
          <p className="text-sm text-gray-400 mt-2">You can add money via UPI / Card</p>
        </div>

        {/* My Bookings */}
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Bookings</h2>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex-1">
                <p className="text-3xl font-bold">{booking.busNumber}</p>
                <p className="text-xl text-gray-400">{booking.route}</p>
                <p className="mt-4 text-sm">
                  <span className="font-medium">Date:</span> {booking.date} • 
                  <span className="font-medium ml-4">Seats:</span> {booking.seats.join(', ')}
                </p>
              </div>

              <div className="text-right">
                <p className="text-5xl font-bold text-desert-500">₹{booking.amount}</p>
                <p className="text-green-400 mt-1 font-medium">{booking.status}</p>
                
                <button
                  onClick={() => downloadTicket(booking)}
                  className="mt-6 bg-fort-600 hover:bg-fort-700 text-white px-8 py-3 rounded-2xl text-sm font-medium transition"
                >
                  Download E-Ticket PDF 📄
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-8 rounded-3xl text-center hover:scale-105 transition cursor-pointer">
            <span className="text-6xl block mb-4">🚌</span>
            <p className="font-semibold text-xl">Book New Ride</p>
          </div>
          <div className="glass p-8 rounded-3xl text-center hover:scale-105 transition cursor-pointer">
            <span className="text-6xl block mb-4">🏜️</span>
            <p className="font-semibold text-xl">Tourism Bundles</p>
          </div>
          <div className="glass p-8 rounded-3xl text-center hover:scale-105 transition cursor-pointer">
            <span className="text-6xl block mb-4">🛡️</span>
            <p className="font-semibold text-xl">Travel Insurance</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}