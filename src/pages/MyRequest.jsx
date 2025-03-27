import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';
import DonorDetailsModal from '../components/DonorDetailsModal';

const NotificationBell = ({ count = 0, onClick }) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
};

const MyRequest = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [donations, setDonations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showDonorModal, setShowDonorModal] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false); // Add this line

    // Fetch all data
    useEffect(() => {
        if (!user?.username || !user?._id) return;
    
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch requests
                const requestsResponse = await fetch(`http://localhost:5000/api/my-request/${user.username}`);
                const requestsData = await requestsResponse.json();
                
                if (requestsResponse.ok) {
                    setRequests(requestsData);
                    
                    // Fetch donations for fulfilled requests only
                    const fulfilledRequests = requestsData.filter(req => req.status === 'fulfilled');
                    
                    // Fetch each donation individually
                    const donationsPromises = fulfilledRequests.map(async (request) => {
                        try {
                            const response = await fetch(`http://localhost:5000/api/donations/by-request/${request._id}`);
                            if (response.ok) {
                                return await response.json();
                            }
                            return null;
                        } catch (error) {
                            console.error(`Error fetching donation for request ${request._id}:`, error);
                            return null;
                        }
                    });
                    
                    const donationsResults = await Promise.all(donationsPromises);
                    setDonations(donationsResults.filter(d => d !== null));
                    
                    // Fetch notifications
                    const notificationsResponse = await fetch(`http://localhost:5000/api/notifications/${user._id}`);
                    if (notificationsResponse.ok) {
                        const notificationsData = await notificationsResponse.json();
                        setNotifications(notificationsData);
                    }
                }
            } catch (error) {
                setMessage("Error: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [user?.username, user?._id]);

    const fetchDonationDetails = async (donationId) => {
        try {
          setIsModalLoading(true);
          const response = await fetch(`http://localhost:5000/api/donations/${donationId}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch donation details');
          }
          
          const data = await response.json();
          setSelectedDonation(data);
          setShowDonorModal(true);
        } catch (error) {
          console.error('Error fetching donation:', error);
          setMessage(`Error: ${error.message}`);
        } finally {
          setIsModalLoading(false);
        }
      };

    // Get donor info for a request
    const getDonorInfo = (requestId) => {
         // Since donations is now an array of donations for fulfilled requests
    const donation = donations.find(d => d?.request?._id === requestId);
        // console.log("DONATION OBJECT",donation)
        if (!donation || !donation.donor) return null;
        console.log("Blood Group:", donation);
        console.log(donation)
        return {
            name: donation.donor.name || 'Anonymous Donor',
            contact: donation.donor.contact || 'contact not shared',
            bloodGroup: donation.donor.bloodGroup || 'contact not shared',
            donationDate: donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'Date not specified',
            donationId: donation._id
        };
    };

    // Handle notification click
    const handleNotificationClick = async (notification) => {
      try {
        // Mark as read
        await markNotificationAsRead(notification._id);
        setShowNotifications(false);
        
        // If notification has a requestId, find the associated donation
        if (notification.requestId) {
          const donation = donations.find(d => d.request === notification.requestId);
          if (donation) {
            await fetchDonationDetails(donation._id);
          }
        }
      } catch (error) {
        console.error('Error handling notification:', error);
      }
    };

    // Handle delete request
    const handleDelete = async (requestId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/my-request/delete/${requestId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            setMessage("Request deleted successfully!");
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error("Delete error:", error);
            setMessage("Error: Failed to delete request.");
        }
    };

    // Handle edit request
    const handleEdit = (id) => {
        navigate(`/${user.username}/my-requests/edit/${id}`);
    };

    // Handle status update
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/my-request/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedRequest = await response.json();
            setRequests(requests.map(request => 
                request._id === id ? updatedRequest.request : request
            ));
            setMessage("Status updated successfully!");
        } catch (error) {
            console.error("Status update error:", error);
            setMessage("Error: Failed to update status.");
        }
    };

    // Mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
                method: 'PUT'
            });
            
            if (response.ok) {
                setNotifications(notifications.map(n => 
                    n._id === notificationId ? {...n, read: true} : n
                ));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Spinner size="lg" color="text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            My Blood Requests
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            Manage your blood donation requests
                        </p>
                    </div>
                    <div className="relative">
                        <NotificationBell 
                            count={notifications.filter(n => !n.read).length} 
                            onClick={() => setShowNotifications(!showNotifications)}
                        />
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-10">
                                <div className="py-1">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-2 text-sm text-gray-700">No notifications</div>
                                    ) : (
                                        notifications.map(notification => (
                                            <div
                                                key={notification._id}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`px-4 py-2 text-sm cursor-pointer ${
                                                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                                } hover:bg-gray-100`}
                                            >
                                                <div className="font-medium">{notification.title}</div>
                                                <div className="text-gray-600 truncate">{notification.message}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg text-center ${
                        message.includes("successfully") ? 
                        'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    {requests.length === 0 ? (
                        <div className="text-center py-16">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No requests</h3>
                            <p className="mt-1 text-gray-500">
                                You haven't created any blood requests yet.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/create-request')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg
                                        className="-ml-1 mr-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    New Request
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Blood Group
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status/Donor Info
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.map((request) => {
                                        const donorInfo = getDonorInfo(request._id);
                                        return (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {request.patientName}
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {request.hospitalName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {request.bloodGroup}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {request.urgency === 'critical' ? '❗ Critical' : 
                                                         request.urgency === 'urgent' ? '⚠️ Urgent' : 'Normal'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {request.status}
                                                    </span>
                                                    {request.status === 'fulfilled' && (
                                                        <div className="mt-2">
                                                            {donorInfo ? (
                                                                <>
                                                                    <div className="text-xs">
                                                                        <span className="font-medium">Donor:</span> {donorInfo.name}
                                                                    </div>
                                                                    <div className="text-xs">
                                                                        <span className="font-medium">Date:</span> {donorInfo.donationDate}
                                                                    </div>
                                                                    <div className="text-xs">
                                                                        <span className="font-medium">Contact:</span> {donorInfo.contact}
                                                                    </div>
                                                                    <div className="text-xs">
                                                                        <span className="font-medium">BloodGroup:</span> {donorInfo.bloodGroup}
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => {
                                                                            const donation = donations.find(d => d?.request?._id === request._id);
                                                                            if (donation) {
                                                                            fetchDonationDetails(donation._id);
                                                                            }
                                                                        }}
                                                                        className="mt-1 text-xs text-blue-600 hover:underline"
                                                                        >
                                                                        View full details
                                                                        </button>
                                                                </>
                                                            ) : donations.length > 0 ? (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Donor details not available
                                                                </div>
                                                            ) : (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Loading donor info...
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(request._id)}
                                                            className="text-blue-600 hover:text-blue-900 text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(request._id)}
                                                            className="text-red-600 hover:text-red-900 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Donor Details Modal */}
            {showDonorModal && (
                <DonorDetailsModal 
                    donation={selectedDonation}
                    onClose={() => setShowDonorModal(false)}
                />
            )}
        </div>
    );
};

export default MyRequest;