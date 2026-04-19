import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center">
      <div className="glass p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-8">Create Account 🐪</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl glass mb-4" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-2xl glass mb-4" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl glass mb-6" required />
          <button type="submit" className="w-full bg-desert-500 py-4 rounded-3xl text-xl font-bold">Register</button>
        </form>
        <p className="text-center mt-6">
          Already have an account? <Link to="/login" className="text-fort-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}