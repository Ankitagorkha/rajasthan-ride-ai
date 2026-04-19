import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert('Login successful! 🎉');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center">
      <div className="glass p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-8">Welcome Back 🐪</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-6 py-4 rounded-2xl glass mb-4" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-6 py-4 rounded-2xl glass mb-6" 
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-desert-500 py-4 rounded-3xl text-xl font-bold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6">
          Don't have an account? <Link to="/register" className="text-fort-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}