import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true)
  try {
    const response = await api.post('/auth/login', formData);
    login(response.data.token);
    navigate('/dashboard');
    setLoading(false)
  } catch (error) {
    if (error.response) {
    const data = error.response.data;
    if (data.errors) {
      setError(data.errors[0]);
    } else {
      setError(data.message);
    }
    setLoading(false)
  } else {
    setError('Something went wrong. Please try again.');
  }
  setLoading(false)
  }
};
return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
    <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
    {error && <p className="text-white text-sm text-center bg-red-500 mb-4 font-bold ">{error}</p>}
    <form onSubmit={handleSubmit}>
      <input
      className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your email"
      />
      <input
      className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Your password"
      />
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">Login</button>
      <div className='mt-4 flex items-center justify-center gap-4'>
    <p className="text-gray-500 font-bold">Forgot password ? <Link to="/forgot-password" className="hover:underline py-2 text-red-300 hover:text-red-500 text-md">Yes</Link></p>
    <p className="text-gray-500 font-bold">New User ? <Link to="/register" className="hover:underline py-2 text-green-300 hover:text-green-500 text-md">Register</Link></p>
    </div>
    {loading && (
      <div className="flex justify-center mt-2">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
        )}
    </form>
    </div>
  </div>
);
}

export default Login