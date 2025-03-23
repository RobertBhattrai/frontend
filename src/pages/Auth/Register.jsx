import React, { useState } from 'react';
import axios from 'axios';
import img from '../../assets/images/registerbg.jpg';
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom'; // Add react-router for navigation
import '../../components/Header.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "", // Add username field
    email: "",
    password: "",
    bloodGroup: "",
    isDonor: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.username) newErrors.username = "Username is required"; // Validate username
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood Group is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Use Axios to send POST request
      const response = await axios.post("http://localhost:5000/api/register", formData);

      if (response.status === 201) {
        setMessage({ type: "success", text: "Registration successful!" });
        setIsModalVisible(true); // Show the modal on success
      } else {
        setMessage({ type: "error", text: response.data.message || "Registration failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const Modal = ({ message, onClose, onRedirect }) => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <p className="text-center text-xl">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-md mr-2"
            onClick={onRedirect} // Redirect to login
          >
            Go to Login
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center py-10" style={{ background: `url(${img})`, backgroundPosition: "50% 30%" }}>
      {isModalVisible && (
        <Modal
          message="You have successfully registered!"
          onClose={() => setIsModalVisible(false)}
          onRedirect={() => navigate("/login")} // Use navigate for SPA redirection
        />
      )}
      <div className="flex justify-center items-center rounded-2xl" style={{ backgroundColor: '#3cd1ae', background: 'linear-gradient(90deg, rgba(52,199,164,1) 0%, rgba(96,228,197,1) 25%, rgba(116,245,189,1) 65%, rgba(58,199,166,1) 100%)' }}>
        <form onSubmit={handleSubmit} className="max-w-lg w-full h-full p-8 rounded-lg shadow-lg">
          <img src={logo} alt="" className="h-40" />
          <h2 className="text-3xl font-bold text-start mb-6 text-blue-600 mt-4">Fill the detail below</h2>

          {/* Show Messages */}
          {message.text && (
            <p className={`text-lg ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

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
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="bloodGroup" className="block text-gray-700">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup}</p>}
          </div>

          {/* Donor Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="isDonor"
              checked={formData.isDonor}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isDonor" className="text-gray-700">I want to be a donor</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 custom-button"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <pre>Already have an account? <a href="/login" className="text-lg text-cyan-800">Sign in</a></pre>
        </form>
      </div>
    </div>
  );
};

export default Register;