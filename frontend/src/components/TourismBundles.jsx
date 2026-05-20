import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';

const fallbackBundles = [
  {
    id: 'bundle-desert',
    title: 'Golden Desert Safari',
    city: 'Jaisalmer',
    price: 2499,
    duration: '1 night',
    includes: ['Bus add-on', 'Dune dinner', 'Camel safari', 'Folk music show'],
    aiTip: 'Best for sunset photos and overnight desert experience.'
  },
  {
    id: 'bundle-fort',
    title: 'Royal Fort Trail',
    city: 'Udaipur',
    price: 1899,
    duration: '1 day',
    includes: ['City Palace', 'Lake Pichola boat ride', 'Guide support'],
    aiTip: 'Pair with a morning arrival bus to avoid afternoon rush.'
  },
  {
    id: 'bundle-pushkar',
    title: 'Pushkar Spiritual Ride',
    city: 'Pushkar',
    price: 999,
    duration: 'Half day',
    includes: ['Brahma Temple', 'Pushkar Lake', 'Rose market walk'],
    aiTip: 'Good low-budget bundle for Jaipur weekend riders.'
  }
];

const bundleStyles = [
  'from-orange-500 to-amber-600',
  'from-blue-600 to-cyan-600',
  'from-rose-600 to-fuchsia-600'
];

export default function TourismBundles({ compact = false }) {
  const [bundles, setBundles] = useState(fallbackBundles);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/api/tourism-bundles')
      .then((res) => setBundles(res.data?.length ? res.data : fallbackBundles))
      .catch(() => setBundles(fallbackBundles));
  }, []);

  const handleAdd = (bundle) => {
    const existing = JSON.parse(localStorage.getItem('tourismBundles') || '[]');
    const next = [bundle, ...existing.filter((item) => item.id !== bundle.id)];
    localStorage.setItem('tourismBundles', JSON.stringify(next));
    setSelected(bundle.id);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16" id="tourism-bundles">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-sm font-semibold text-desert-600 dark:text-desert-500">Tourism Bundles</p>
          <h2 className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">Book bus plus Rajasthan experiences</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            Combine your ride with desert safaris, palace visits, spiritual trips, guides, food and local transfers.
          </p>
        </div>
        {!compact && (
          <div className="rounded-lg bg-fort-600 text-white px-5 py-4 font-semibold">
            AI will recommend the best bundle for your route
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {bundles.map((bundle, index) => (
          <motion.article
            key={bundle.id}
            whileHover={{ y: -8, scale: 1.01 }}
            className="glass rounded-lg overflow-hidden shadow-xl"
          >
            <div className={`h-44 bg-gradient-to-br ${bundleStyles[index % bundleStyles.length]} p-6 flex flex-col justify-end text-white`}>
              <p className="text-sm font-semibold uppercase tracking-wide">{bundle.city}</p>
              <h3 className="text-3xl font-bold mt-2">{bundle.title}</h3>
            </div>

            <div className="p-7">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bundle Price</p>
                  <p className="text-4xl font-bold text-desert-500">Rs {bundle.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-bold">{bundle.duration}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {bundle.includes.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-green-500 text-white text-xs">OK</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="mt-6 rounded-lg bg-white/50 dark:bg-white/5 p-4 text-sm text-gray-700 dark:text-gray-300">
                AI tip: {bundle.aiTip}
              </p>

              <button
                onClick={() => handleAdd(bundle)}
                className="mt-6 w-full bg-gradient-to-r from-desert-500 to-fort-600 text-white py-4 rounded-lg font-bold hover:scale-[1.02] transition"
              >
                {selected === bundle.id ? 'Added to Trip' : 'Add Bundle to Trip'}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
