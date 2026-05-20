import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import api from '../lib/api';

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

    api.get('/api/auth/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch(() => setUser(JSON.parse(storedUser)))
      .finally(() => setLoading(false));

    api.get('/api/bookings')
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([
        { id: 'B001', busNumber: 'RJ14-PA-2025', route: 'Jaipur to Udaipur', date: '20 May 2026', seats: ['A3', 'A4'], amount: 2500, status: 'Confirmed' },
        { id: 'B002', busNumber: 'RJ27-UD-1987', route: 'Jodhpur to Jaisalmer', date: '15 May 2026', seats: ['B12'], amount: 1450, status: 'Completed' }
      ]));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const downloadTicket = (booking) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Rajasthan Rider'S", 20, 30);
    doc.setFontSize(16);
    doc.text('AI E-Ticket', 20, 50);
    doc.setFontSize(12);
    doc.text(`Booking ID : ${booking.id}`, 20, 70);
    doc.text(`Bus        : ${booking.busNumber}`, 20, 80);
    doc.text(`Route      : ${booking.route}`, 20, 90);
    doc.text(`Date       : ${booking.date}`, 20, 100);
    doc.text(`Seats      : ${booking.seats.join(', ')}`, 20, 110);
    doc.text(`Amount     : Rs ${booking.amount}`, 20, 120);
    doc.text('Status     : Confirmed', 20, 140);
    doc.text('Live tracking and AI trip support included.', 20, 160);
    doc.save(`Ticket_${booking.id}.pdf`);
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading your dashboard...</div>;
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold text-desert-600 dark:text-desert-500">{user.role} ACCOUNT</p>
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mt-2">Welcome back, {user.name}</h1>
            <p className="text-xl text-gray-500 mt-2">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="bg-fort-600 hover:bg-fort-700 text-white px-8 py-4 rounded-lg font-semibold transition">Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition">Logout</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-lg p-8">
            <h3 className="text-lg font-semibold">Wallet Balance</h3>
            <p className="text-5xl font-bold text-desert-500 mt-3">Rs {user.wallet ?? 2450}</p>
          </div>
          <Link to="/search" className="glass rounded-lg p-8 hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold">Book New Ride</h3>
            <p className="text-gray-500 mt-3">Search buses, seats and route options.</p>
          </Link>
          <Link to="/tracking/demo" className="glass rounded-lg p-8 hover:scale-[1.02] transition">
            <h3 className="text-lg font-semibold">Live Tracking</h3>
            <p className="text-gray-500 mt-3">Track your bus anytime, anywhere.</p>
          </Link>
          <Link to="/tourism" className="glass rounded-lg p-8 hover:scale-[1.02] transition md:col-span-3">
            <h3 className="text-lg font-semibold">Tourism Bundles</h3>
            <p className="text-gray-500 mt-3">Add desert safari, fort trail, lake ride, Pushkar trip or AI-selected activities to your bus ride.</p>
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Bookings</h2>
        <div className="space-y-6">
          {bookings.map((booking) => (
            <motion.div key={booking.id} whileHover={{ scale: 1.01 }} className="glass rounded-lg p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <p className="text-3xl font-bold">{booking.busNumber}</p>
                <p className="text-xl text-gray-500">{booking.route}</p>
                <p className="mt-4 text-sm">
                  <span className="font-medium">Date:</span> {booking.date} -
                  <span className="font-medium ml-4">Seats:</span> {booking.seats.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-desert-500">Rs {booking.amount}</p>
                <p className="text-green-500 mt-1 font-medium">{booking.status}</p>
                <button onClick={() => downloadTicket(booking)} className="mt-6 bg-fort-600 hover:bg-fort-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition">
                  Download E-Ticket PDF
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
