import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const DonatePage = () => {
  const { username, id: requestId } = useParams(); // requestId is already extracted here
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [donationDetails, setDonationDetails] = useState({
    donationDate: '',
    healthStatus: 'good',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationDetails(prev => ({ ...prev, [name]: value }));
  };

  const updateRequestStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/my-request/status/${requestId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'fulfilled'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      setMessage({ text: 'You must be logged in to donate', type: 'error' });
      return;
    }
  
    // Validate donation date
    if (!donationDetails.donationDate) {
      setMessage({ text: 'Please select a donation date', type: 'error' });
      return;
    }
  
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const token = localStorage.getItem('token');
      const formattedDate = new Date(donationDetails.donationDate).toISOString();
      
      // First create the donation
      const donationResponse = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestId,  // Use requestId from params
          donorId: user._id,
          donationDate: formattedDate,
          healthStatus: donationDetails.healthStatus,
          message: donationDetails.message
        })
      });
  
      if (!donationResponse.ok) {
        const errorData = await donationResponse.json();
        throw new Error(errorData.message || 'Failed to submit donation');
      }

      // Then update the request status
      await updateRequestStatus();
  
      setMessage({
        text: 'Donation submitted and request marked as fulfilled!',
        type: 'success'
      });
      
      setTimeout(() => navigate(`/${user.username}/home`), 2000);
    } catch (error) {
      console.error('Donation error:', error);
      setMessage({
        text: error.message || 'Failed to complete donation process',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Donate Blood</h1>
            
            {message.text && (
              <div className={`mb-6 p-4 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Donation Date *
                  </label>
                  <input
                    type="date"
                    name="donationDate"
                    value={donationDetails.donationDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Health Status *
                  </label>
                  <select
                    name="healthStatus"
                    value={donationDetails.healthStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={donationDetails.message}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information for the recipient..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(`/${username}`)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Submit Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;