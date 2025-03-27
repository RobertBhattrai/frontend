import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const RequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/api/blood-requests/${requestId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setRequest(data);
        
      } catch (error) {
        console.error('Error fetching request details:', error);
        setError('Failed to fetch request details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" color="text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-medium">{request.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{request.patientAge || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium">{request.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Required Units</p>
                    <p className="font-medium">{request.unitsRequired}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Hospital Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Hospital Name</p>
                    <p className="font-medium">{request.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{request.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium">{request.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Requested By</p>
                    <p className="font-medium">{request.requestedBy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{request.additionalInfo || 'No additional information provided.'}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                Status: {request.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                request.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                Urgency: {request.urgency}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Created: {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to List
              </button>
              {localStorage.getItem('userType') === 'donor' && (
                <button
                  onClick={() => navigate(`/donate/${request._id}`)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Donate Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;