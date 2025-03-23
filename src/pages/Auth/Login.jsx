import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from '../../assets/images/registerbg.jpg';
import logo from '../../assets/images/logo.png';
import '../../components/Header.css';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useContext(UserContext); // Use setUser from UserContext
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Login successful!' });

        // Store user details in context
        setUser(response.data.user);

        // Redirect to the user's home page after a short delay
        setTimeout(() => {
          navigate(`/${response.data.user.username}/home`);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Login failed' });
      }
    } catch (error) {
      if (error.response) {
        setMessage({
          type: 'error',
          text: error.response.data.message || 'An error occurred. Please try again.',
        });
      } else if (error.request) {
        setMessage({
          type: 'error',
          text: 'Network error. Please check your internet connection.',
        });
      } else {
        setMessage({
          type: 'error',
          text: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10" style={{ background: `url(${img})`, backgroundPosition: "50% 30%" }}>
      <div className="flex justify-center items-center rounded-2xl" style={{ backgroundColor: '#3cd1ae', background: 'linear-gradient(90deg, rgba(52,199,164,1) 0%, rgba(96,228,197,1) 25%, rgba(116,245,189,1) 65%, rgba(58,199,166,1) 100%)' }}>
        <form onSubmit={handleSubmit} className="max-w-lg w-full h-full p-8 rounded-lg shadow-lg">
          <img src={logo} alt="logo" className="h-40" />
          <h2 className="text-3xl font-bold text-start mb-6 text-blue-600 mt-4">Login to your account</h2>

          {/* Show Messages */}
          {message.text && (
            <p className={`text-lg ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 custom-button flex justify-center items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              'Login'
            )}
          </button>
          <pre>Don't have an account? <a href="/register" className="text-lg text-cyan-800">Register here</a></pre>
        </form>
      </div>
    </div>
  );
};

export default Login;