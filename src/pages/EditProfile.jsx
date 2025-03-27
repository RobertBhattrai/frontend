import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';

const EditProfile = () => {
    const { username } = useParams();
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      bloodGroup: '',
      location: '',
      contact: '',
      isDonor: false
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          bloodGroup: user.bloodGroup || '',
          location: user.location || '',
          contact: user.contact || '',
          isDonor: user.isDonor || false
        });
        setIsLoading(false);
      }
    }, [user]);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };
  
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.bloodGroup.trim()) newErrors.bloodGroup = 'Blood group is required';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      setMessage('');
  
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            bloodGroup: formData.bloodGroup,
            location: formData.location || undefined,
            contact: formData.contact || undefined,
            isDonor: formData.isDonor
          })
        });
  
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(text || 'Server error');
        }
  
        const data = await response.json();
        console.log("User :", data)
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update profile');
        }
        
        // Update user context
        setUser(data.user);
        
        setMessage({
          text: 'Profile updated successfully!',
          type: 'success'
        });
        
        setTimeout(() => navigate(`/${username}/home`), 2000);
      } catch (error) {
        console.error('Update error:', error);
        setMessage({
          text: error.message || 'Failed to update profile',
          type: 'error'
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Spinner size="xl" color="text-blue-600" />
        </div>
      );
    }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Edit Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Update your personal information
          </p>
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Name Field */}
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                      'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } sm:text-sm`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>
              
              {/* Email Field */}
              <div className="sm:col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                      'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } sm:text-sm`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
              
              {/* Blood Group Field */}
              <div className="sm:col-span-6">
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                  Blood Group *
                </label>
                <div className="mt-1">
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm ${
                      errors.bloodGroup ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                      'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } sm:text-sm`}
                  >
                    <option value="">Select your blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && (
                    <p className="mt-2 text-sm text-red-600">{errors.bloodGroup}</p>
                  )}
                </div>
              </div>
              
              {/* Contact Number Field (Optional) */}
              <div className="sm:col-span-3">
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="contact"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={`block w-full rounded-md shadow-sm ${
                      errors.contact ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
                      'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } sm:text-sm`}
                  />
                  {errors.contact && (
                    <p className="mt-2 text-sm text-red-600">{errors.contact}</p>
                  )}
                </div>
              </div>
              
              {/* Location Field (Optional) */}
              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Donor Status */}
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <input
                      id="isDonor"
                      name="isDonor"
                      type="checkbox"
                      checked={formData.isDonor}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isDonor" className="font-medium text-gray-700">
                      I'm willing to donate blood
                    </label>
                    <p className="text-gray-500">
                      {formData.isDonor 
                        ? "You'll be visible to requesters as a donor"
                        : "You won't appear in donor searches"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/${username}/profile`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" color="text-white" className="mr-2" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;