import { useState } from 'react';
import { Link } from 'react-router-dom';
import BusCard from '../components/BusCard';

export default function Search() {
  const [from, setFrom] = useState('Jaipur');
  const [to, setTo] = useState('Udaipur');
  const [buses, setBuses] = useState([]);

  const popularRoutes = [
    { from: 'Jaipur', to: 'Udaipur', price: 650 },
    { from: 'Jodhpur', to: 'Jaisalmer', price: 850 },
    { from: 'Udaipur', to: 'Mount Abu', price: 450 },
    { from: 'Jaipur', to: 'Pushkar', price: 300 }
  ];

  const handleSearch = () => {
    setBuses([
      { 
        id: '1', 
        busNumber: 'RJ14-PA-2025', 
        type: 'AC Sleeper', 
        price: 1250, 
        departure: '22:30', 
        arrival: '07:15', 
        seatsLeft: 8 
      },
      { 
        id: '2', 
        busNumber: 'RJ27-UD-1987', 
        type: 'Volvo Sleeper', 
        price: 1450, 
        departure: '23:00', 
        arrival: '08:30', 
        seatsLeft: 14 
      },
      { 
        id: '3', 
        busNumber: 'RJ19-JD-4567', 
        type: 'AC Seater', 
        price: 750, 
        departure: '06:00', 
        arrival: '13:45', 
        seatsLeft: 22 
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="glass rounded-3xl p-10 mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Find Your Bus in Rajasthan 🐪</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={from} 
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 px-6 py-5 rounded-2xl glass text-lg focus:outline-none placeholder:text-white/70" 
            placeholder="From (e.g. Jaipur)" 
          />
          <input 
            type="text" 
            value={to} 
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 px-6 py-5 rounded-2xl glass text-lg focus:outline-none placeholder:text-white/70" 
            placeholder="To (e.g. Udaipur)" 
          />
          <button 
            onClick={handleSearch}
            className="bg-desert-500 hover:bg-desert-600 text-white px-12 py-5 rounded-3xl font-bold text-xl transition flex-shrink-0"
          >
            Search Buses 🚌
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {buses.length > 0 ? (
          buses.map((bus) => <BusCard key={bus.id} bus={bus} />)
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Select cities and click "Search Buses"</p>
            <p className="text-sm mt-4 text-gray-500">Try: Jaipur → Udaipur</p>
          </div>
        )}
      </div>
    </div>
  );
}