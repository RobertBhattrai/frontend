import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const EditRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        patientName: '',
        bloodGroup: '',
        hospitalName: '',
        location: '',
        contactNumber: '',
        urgency: 'normal',
        unitsRequired: 1,
        additionalInfo: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch request details by ID
    useEffect(() => {
        const fetchRequest = async () => {
            setIsLoading(true);
            setMessage({ text: '', type: '' });
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/blood-requests/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch request details');
                }
                
                const data = await response.json();
                
                // Pre-fill form with data from database
                setFormData({
                    patientName: data.patientName || '',
                    bloodGroup: data.bloodGroup || '',
                    hospitalName: data.hospitalName || '',
                    location: data.location || '',
                    contactNumber: data.contactNumber || '',
                    urgency: data.urgency || 'normal',
                    unitsRequired: data.unitsRequired || 1,
                    additionalInfo: data.additionalInfo || ''
                });
                
            } catch (error) {
                console.error("Fetch error:", error);
                setMessage({
                    text: error.message || 'Failed to load request details',
                    type: 'error'
                });
                
                if (error.message.includes('not found')) {
                    setTimeout(() => navigate(`${username}/home`), 2000);
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        if (id) {
            fetchRequest();
        }
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Validate unitsRequired is between 1-10
        if (name === 'unitsRequired') {
            const numValue = parseInt(value);
            if (isNaN(numValue) || numValue < 1 || numValue > 10) return;
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: name === 'unitsRequired' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setIsSubmitting(true);
    
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/blood-requests/${id}`, // Changed endpoint
                {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData),
                }
            );
            
            // Check if response is OK before parsing as JSON
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update request');
            }
            
            const data = await response.json();
            
            setMessage({
                text: data.message || "Request updated successfully!",
                type: 'success'
            });
            setTimeout(() => navigate(`/${user?.username}/myrequests`), 1500);
        } catch (error) {
            console.error("Submit error:", error);
            setMessage({
                text: error.message.includes('<!DOCTYPE html>') 
                    ? "Failed to update request (server error)" 
                    : error.message,
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading request details...</p>
                </div>
            </div>
        );
    }

    if (message.type === 'error' && message.text.includes('not found')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Request Not Found</h2>
                    <p className="mb-4">The request you're trying to edit doesn't exist.</p>
                    <button 
                        onClick={() => navigate('/my-requests')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to My Requests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Edit Blood Request</h1>
                            <button 
                                onClick={() => navigate(`/${user?.username}/myrequests`)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                ← Back to My Requests
                            </button>
                        </div>
                        
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-md ${
                                message.type === 'success' 
                                    ? 'bg-green-50 text-green-800 border border-green-200' 
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                                {message.text}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="" disabled>Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={formData.hospitalName}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Units Required (1-10)</label>
                                    <input
                                        type="number"
                                        name="unitsRequired"
                                        min="1"
                                        max="10"
                                        value={formData.unitsRequired}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Urgency</label>
                                    <select
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2 space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                                    <textarea
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Any special requirements or notes for donors..."
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        isSubmitting
                                            ? 'bg-blue-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : 'Update Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditRequest;