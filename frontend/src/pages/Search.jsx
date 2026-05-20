import { useEffect, useMemo, useState } from 'react';
import BusCard from '../components/BusCard';
import api from '../lib/api';

const fallbackRoutes = [
  { from: 'Jaipur', to: 'Udaipur' },
  { from: 'Jodhpur', to: 'Jaisalmer' },
  { from: 'Udaipur', to: 'Mount Abu' },
  { from: 'Jaipur', to: 'Pushkar' },
  { from: 'Jaipur', to: 'Jodhpur' },
  { from: 'Jaipur', to: 'Ajmer' },
  { from: 'Jaipur', to: 'Kota' },
  { from: 'Bikaner', to: 'Jaipur' },
  { from: 'Ajmer', to: 'Udaipur' },
  { from: 'Kota', to: 'Udaipur' },
  { from: 'Jaisalmer', to: 'Bikaner' }
];

export default function Search() {
  const [from, setFrom] = useState('Jaipur');
  const [to, setTo] = useState('Udaipur');
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState(fallbackRoutes);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    api.get('/api/routes')
      .then((res) => setRoutes(res.data?.length ? res.data : fallbackRoutes))
      .catch(() => setRoutes(fallbackRoutes));
  }, []);

  const cities = useMemo(() => {
    return [...new Set(routes.flatMap((route) => [route.from, route.to]))].sort();
  }, [routes]);

  const handleSearch = async (nextFrom = from, nextTo = to) => {
    setFrom(nextFrom);
    setTo(nextTo);
    setLoading(true);
    setSearched(true);

    try {
      const { data } = await api.get('/api/buses/search', { params: { from: nextFrom, to: nextTo } });
      setBuses(data);
    } catch {
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="glass rounded-lg p-8 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-sm font-semibold text-desert-600 dark:text-desert-500">Bus Search</p>
            <h2 className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">Find buses across Rajasthan</h2>
            <p className="text-gray-500 mt-3">Use city names or click a popular route below.</p>
          </div>
        </div>

        <datalist id="rajasthan-cities">
          {cities.map((city) => <option value={city} key={city} />)}
        </datalist>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            list="rajasthan-cities"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="input-field flex-1"
            placeholder="From (e.g. Jaipur)"
          />
          <input
            type="text"
            list="rajasthan-cities"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="input-field flex-1"
            placeholder="To (e.g. Udaipur)"
          />
          <button
            onClick={() => handleSearch()}
            className="bg-desert-500 hover:bg-desert-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition flex-shrink-0"
          >
            {loading ? 'Searching...' : 'Search Buses'}
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-500 mb-3">Popular routes</p>
          <div className="flex flex-wrap gap-3">
            {routes.map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                onClick={() => handleSearch(route.from, route.to)}
                className="rounded-lg border border-white/20 bg-white/60 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-desert-500 hover:text-desert-600 dark:bg-white/5 dark:text-white"
              >
                {route.from} to {route.to}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading && <div className="text-center py-16 text-xl text-gray-500">Finding buses...</div>}

        {!loading && buses.length > 0 && buses.map((bus) => <BusCard key={bus.id} bus={bus} />)}

        {!loading && searched && buses.length === 0 && (
          <div className="glass rounded-lg p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No buses found for {from} to {to}</h3>
            <p className="text-gray-500 mt-3">Try one of the popular routes above, or add schedules from the admin panel.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">Select cities and click Search Buses</p>
            <p className="text-sm mt-4 text-gray-500">Try Jaipur to Jodhpur, Jaipur to Kota, or Jodhpur to Jaisalmer.</p>
          </div>
        )}
      </div>
    </div>
  );
}
