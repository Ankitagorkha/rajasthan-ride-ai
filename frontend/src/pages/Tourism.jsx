import { Link } from 'react-router-dom';
import TourismBundles from '../components/TourismBundles';
import AITripPlanner from '../components/AITripPlanner';

export default function Tourism() {
  return (
    <div className="min-h-screen">
      <section className="bg-fort-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-sm font-semibold text-amber-200">Rajasthan Tourism</p>
          <h1 className="text-5xl font-bold mt-3 max-w-3xl">Tourism bundles for every bus rider</h1>
          <p className="text-xl text-white/80 mt-5 max-w-3xl">
            Add safaris, palace tours, lake rides, guides and local experiences to your bus booking from one place.
          </p>
          <Link to="/search" className="inline-block mt-8 bg-desert-500 hover:bg-desert-600 px-8 py-4 rounded-lg font-bold">
            Search buses
          </Link>
        </div>
      </section>

      <TourismBundles />
      <AITripPlanner />
    </div>
  );
}
