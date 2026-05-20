import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';

const initialBus = {
  busNumber: '',
  type: 'AC_Sleeper',
  totalSeats: 36,
  driverName: '',
  amenities: 'WiFi, Charging, CCTV'
};

export default function AdminPanel() {
  const [summary, setSummary] = useState(null);
  const [buses, setBuses] = useState([]);
  const [busForm, setBusForm] = useState(initialBus);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.allSettled([api.get('/api/admin/summary'), api.get('/api/buses')]).then(([summaryRes, busesRes]) => {
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
      if (busesRes.status === 'fulfilled') setBuses(busesRes.value.data);
    });
  }, []);

  const updateBus = (event) => {
    setBusForm({ ...busForm, [event.target.name]: event.target.value });
  };

  const addBus = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const { data } = await api.post('/api/buses', busForm);
      setBuses([data, ...buses]);
      setBusForm(initialBus);
      setMessage('Bus added with seats generated automatically.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Could not add bus. Login as admin and try again.');
    }
  };

  const stats = [
    ['Fleet', summary?.buses ?? buses.length],
    ['Active trips', summary?.activeTrips ?? 0],
    ['Tourism bundles', summary?.tourismBundles ?? 0],
    ['Revenue today', `Rs ${summary?.todayRevenue ?? 0}`]
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-sm font-semibold text-desert-600 dark:text-desert-500">Admin Control Room</p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">Manage buses, trips and AI alerts</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-300 max-w-xl">
          Demo admin login: admin@rajasthanride.ai / admin123. Add buses here, then connect schedules as the next backend step.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(([label, value]) => (
          <motion.div key={label} whileHover={{ y: -3 }} className="glass rounded-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">
        <form onSubmit={addBus} className="glass rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add Bus</h2>
          <div className="grid gap-4">
            <input name="busNumber" value={busForm.busNumber} onChange={updateBus} className="input-field" placeholder="Bus number e.g. RJ14-AB-1234" required />
            <select name="type" value={busForm.type} onChange={updateBus} className="input-field">
              <option value="AC_Sleeper">AC Sleeper</option>
              <option value="NonAC_Seater">Non AC Seater</option>
              <option value="Volvo_Sleeper">Volvo Sleeper</option>
              <option value="AC_Seater">AC Seater</option>
              <option value="Sleeper">Sleeper</option>
            </select>
            <input name="totalSeats" type="number" value={busForm.totalSeats} onChange={updateBus} className="input-field" min="12" max="60" required />
            <input name="driverName" value={busForm.driverName} onChange={updateBus} className="input-field" placeholder="Driver name" required />
            <input name="amenities" value={busForm.amenities} onChange={updateBus} className="input-field" placeholder="Amenities comma separated" />
          </div>
          <button className="mt-6 w-full bg-desert-500 hover:bg-desert-600 text-white py-4 rounded-lg font-bold transition">Add Bus</button>
          {message && <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        </form>

        <div className="glass rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Fleet List</h2>
          <div className="space-y-4 max-h-[520px] overflow-auto pr-2">
            {buses.map((bus) => (
              <div key={bus.id || bus.busNumber} className="rounded-lg bg-white/60 dark:bg-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-bold">{bus.busNumber}</p>
                  <p className="text-sm text-gray-500">{String(bus.type).replaceAll('_', ' ')} - {bus.driverName}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-semibold">{bus.totalSeats || bus.seatsLeft || 0} seats</p>
                  <p className="text-sm text-gray-500">{Array.isArray(bus.amenities) ? bus.amenities.join(', ') : 'Live route ready'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {summary?.aiAlerts?.length > 0 && (
        <div className="glass rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">AI Operations Alerts</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {summary.aiAlerts.map((alert) => <div key={alert} className="rounded-lg bg-fort-600 text-white p-4">{alert}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
