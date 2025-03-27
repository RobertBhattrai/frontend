import React from 'react';
import Spinner from './Spinner';

const RequestDetailsModal = ({ request, onClose, isLoading }) => {
    if (!request) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'urgent':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <Spinner size="md" color="text-blue-600" />
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Patient Name</p>
                                        <p className="font-medium">{request.patientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Blood Group</p>
                                        <p className="font-medium">{request.bloodGroup}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Urgency</p>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                                            {request.urgency}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Details</h3>
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
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-gray-700">{request.additionalInfo || 'No additional information provided.'}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(request.urgency)}`}>
                                Urgency: {request.urgency}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                Created: {formatDate(request.createdAt)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                Status: {request.status}
                            </span>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestDetailsModal;