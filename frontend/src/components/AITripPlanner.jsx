import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function AITripPlanner() {
  const [form, setForm] = useState({ from: 'Jaipur', to: 'Udaipur', budget: 4000, mood: 'royal forts' });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const generatePlan = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/ai/trip-planner', form);
      setPlan(data);
    } catch {
      setPlan({
        title: 'Offline smart trip',
        summary: 'AI demo mode recommends a night bus plus a fort or desert tourism bundle.',
        estimatedTotal: 3749,
        budgetFit: 'Demo estimate',
        plan: ['Choose a late evening bus.', 'Add a city bundle.', 'Track the ride live.', 'Download your ticket from dashboard.']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-stretch">
        <form onSubmit={generatePlan} className="glass rounded-lg p-8">
          <p className="text-sm font-semibold text-desert-600 dark:text-desert-500">AI Travel Planner</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">Build my Rajasthan bus trip</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <input name="from" value={form.from} onChange={updateForm} className="input-field" placeholder="From" />
            <input name="to" value={form.to} onChange={updateForm} className="input-field" placeholder="To" />
            <input name="budget" type="number" value={form.budget} onChange={updateForm} className="input-field" placeholder="Budget" />
            <select name="mood" value={form.mood} onChange={updateForm} className="input-field">
              <option value="royal forts">Royal forts</option>
              <option value="desert adventure">Desert adventure</option>
              <option value="spiritual trip">Spiritual trip</option>
              <option value="family comfort">Family comfort</option>
            </select>
          </div>

          <button className="mt-6 w-full bg-fort-600 hover:bg-fort-700 text-white py-4 rounded-lg font-bold transition">
            {loading ? 'Generating plan...' : 'Generate AI Plan'}
          </button>
        </form>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-8">
          {plan ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{plan.title}</h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">{plan.summary}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Estimated total</p>
                  <p className="text-4xl font-bold text-desert-500">Rs {plan.estimatedTotal}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{plan.budgetFit}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-3">
                {plan.plan.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-lg bg-white/50 dark:bg-white/5 p-4">
                    <span className="font-bold text-fort-600">{index + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full min-h-72 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Your AI plan appears here</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                It combines route, budget, live tracking, and tourism bundle logic into one trip recommendation.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
