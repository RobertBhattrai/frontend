import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';

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

const MyDonations = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const userId = user?._id;
                if (!userId) return;
    
                const response = await fetch(`http://localhost:5000/api/donations/my-donations/${userId}`);
                const data = await response.json();
    
                if (!response.ok) throw new Error(data.message || 'Failed to fetch donations');
    
                setDonations(data);
            } catch (error) {
                console.error('Error fetching donations:', error.message);
                setMessage(error.message || 'Failed to load donations');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchDonations();
    }, [user?._id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pledged':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getHealthStatusColor = (healthStatus) => {
        switch (healthStatus) {
            case 'excellent':
                return 'bg-purple-100 text-purple-800';
            case 'good':
                return 'bg-green-100 text-green-800';
            case 'fair':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                            My Blood Donations
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            Your generous contributions to saving lives
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
                    {donations.length === 0 ? (
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
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No donations yet</h3>
                            <p className="mt-1 text-gray-500">
                                Your generous donations will appear here once you've contributed.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/home')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Find Requests to Donate
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recipient Details
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Donation Info
                                        </th>
                                        {/* <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact Information
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {donations.map((donation) => (
                                        <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {donation.request?.patientName || 'Anonymous'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {donation.request?.hospitalName}
                                                        </div>
                                                        <div className="mt-1">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {donation.request?.bloodGroup}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-2">
                                                    <div>
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                                                            {donation.status}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getHealthStatusColor(donation.healthStatus)}`}>
                                                            {donation.healthStatus} health
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Donated on {formatDate(donation.donationDate)}
                                                    </div>
                                                    {donation.message && (
                                                        <div className="text-xs text-gray-500 italic">
                                                            "{donation.message}"
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {donation.request?.contactNumber || 'Not provided'}
                                                </div>
                                                <div className="mt-2">
                                                    <a 
                                                        href={`mailto:${donation.request?.contactEmail || ''}`} 
                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        {donation.request?.contactEmail || 'No email'}
                                                    </a>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    {donation.request?.location || 'Location not specified'}
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyDonations;